import { memo, Suspense, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Maximize2, Minimize2, Minus, X } from 'lucide-react';
import { apps } from '../apps/registry';
import type { AppId, AppProps } from '../apps/ids';
import { trackPointer } from '../lib/trackPointer';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { useWM } from './WindowManager';
import { GAP, MIN_SIZE, type Rect, type Size, type WindowState } from './windowReducer';
import styles from './Window.module.css';

type Edge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
const EDGES: Edge[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

interface Props {
  win: WindowState;
  focused: boolean;
  visible: boolean;
  /** Small screens: every window fills the desktop and cannot be moved. */
  compact: boolean;
  bounds: Size;
  zIndex: number;
}

function resizeRect(base: Rect, edge: Edge, dx: number, dy: number): Rect {
  let { x, y, w, h } = base;
  if (edge.includes('e')) w = Math.max(MIN_SIZE.w, base.w + dx);
  if (edge.includes('s')) h = Math.max(MIN_SIZE.h, base.h + dy);
  if (edge.includes('w')) {
    w = Math.max(MIN_SIZE.w, base.w - dx);
    x = base.x + base.w - w;
  }
  if (edge.includes('n')) {
    h = Math.max(MIN_SIZE.h, base.h - dy);
    y = Math.max(0, base.y + base.h - h);
    h = base.y + base.h - y;
  }
  return { x, y, w, h };
}

export function Window({ win, focused, visible, compact, bounds, zIndex }: Props) {
  const wm = useWM();
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState<Rect | null>(null);
  const stopTracking = useRef<(() => void) | null>(null);
  const def = apps[win.app];
  const filled = win.maximized || compact;

  useEffect(() => () => stopTracking.current?.(), []);

  // Move keyboard focus into the window when it becomes the active one.
  useEffect(() => {
    const el = ref.current;
    if (focused && visible && el && !el.contains(document.activeElement)) {
      (el.querySelector<HTMLElement>('[data-autofocus]') ?? el).focus({ preventScroll: true });
    }
  }, [focused, visible]);

  const rect: Rect = filled
    ? { x: GAP, y: GAP, w: bounds.w - GAP * 2, h: bounds.h - GAP * 2 }
    : (live ?? win.rect);

  const startMove = (e: ReactPointerEvent) => {
    if (e.button !== 0 || compact) return;
    e.preventDefault();
    wm.focus(win.id);
    // Dragging a maximized window restores it under the pointer, like most WMs.
    const base = win.maximized
      ? { ...win.rect, x: e.clientX - win.rect.w / 2, y: 0 }
      : win.rect;
    let moved = false;
    stopTracking.current?.();
    stopTracking.current = trackPointer(e, {
      onMove: (dx, dy) => {
        moved = moved || Math.abs(dx) + Math.abs(dy) > 3;
        if (moved) setLive({ ...base, x: base.x + dx, y: base.y + dy });
      },
      onEnd: (dx, dy) => {
        stopTracking.current = null;
        setLive(null);
        if (moved) wm.setRect(win.id, { ...base, x: base.x + dx, y: base.y + dy });
      },
    });
  };

  const startResize = (edge: Edge) => (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    wm.focus(win.id);
    const base = win.rect;
    stopTracking.current?.();
    stopTracking.current = trackPointer(e, {
      onMove: (dx, dy) => setLive(resizeRect(base, edge, dx, dy)),
      onEnd: (dx, dy) => {
        stopTracking.current = null;
        setLive(null);
        wm.setRect(win.id, resizeRect(base, edge, dx, dy));
      },
    });
  };

  const onPointerDownCapture = (e: ReactPointerEvent) => {
    if (!focused) wm.focus(win.id);
    // Alt + drag moves the window from anywhere (Super + drag in Hyprland).
    if (e.altKey && e.button === 0) {
      e.stopPropagation();
      startMove(e);
    }
  };

  const className = [
    styles.window,
    focused ? styles.focused : '',
    filled ? styles.filled : '',
    live ? styles.dragging : '',
  ].join(' ');

  return (
    <section
      ref={ref}
      className={className}
      style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h, zIndex }}
      hidden={!visible}
      tabIndex={-1}
      aria-label={win.title}
      data-window-id={win.id}
      onPointerDownCapture={onPointerDownCapture}
    >
      <header
        className={styles.titlebar}
        onPointerDown={startMove}
        onDoubleClick={() => !compact && wm.toggleMaximize(win.id)}
      >
        <def.icon size={14} className={styles.appIcon} aria-hidden />
        <h2 className={styles.title}>{win.title}</h2>
        <div className={styles.controls} onPointerDown={(e) => e.stopPropagation()}>
          <button className={styles.control} onClick={() => wm.minimize(win.id)} aria-label="Minimizar" title="Minimizar (Alt+M)">
            <Minus size={14} />
          </button>
          {!compact && (
            <button
              className={styles.control}
              onClick={() => wm.toggleMaximize(win.id)}
              aria-label={win.maximized ? 'Restaurar tamanho' : 'Maximizar'}
              title={win.maximized ? 'Restaurar (Alt+F)' : 'Maximizar (Alt+F)'}
            >
              {win.maximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          )}
          <button className={`${styles.control} ${styles.close}`} onClick={() => wm.close(win.id)} aria-label="Fechar" title="Fechar (Alt+Q)">
            <X size={15} />
          </button>
        </div>
      </header>
      <div className={styles.body}>
        <WindowBody windowId={win.id} app={win.app} props={win.props} />
      </div>
      {!filled &&
        EDGES.map((edge) => (
          <div key={edge} className={`${styles.handle} ${styles[`h_${edge}`]}`} onPointerDown={startResize(edge)} aria-hidden />
        ))}
    </section>
  );
}

/** Memoized so moving or focusing the window frame never re-renders the app inside. */
const WindowBody = memo(function WindowBody({ windowId, app, props }: { windowId: string; app: AppId; props: AppProps }) {
  const wm = useWM();
  const AppComponent = apps[app].component;
  return (
    <ErrorBoundary
      fallback={(error, retry) => (
        <div className={styles.crash} role="alert">
          <p>Este aplicativo encontrou um erro e foi interrompido.</p>
          <code>{error.message}</code>
          <div>
            <button onClick={retry}>Tentar novamente</button>
            <button onClick={() => wm.close(windowId)}>Fechar</button>
          </div>
        </div>
      )}
    >
      <Suspense fallback={<div className={styles.loading}>carregando…</div>}>
        <AppComponent windowId={windowId} props={props} />
      </Suspense>
    </ErrorBoundary>
  );
});
