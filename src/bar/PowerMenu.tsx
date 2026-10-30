import { useCallback, useRef, useState } from 'react';
import { Keyboard, LayoutList, RotateCcw, SquareX } from 'lucide-react';
import { usePrefs } from '../prefs/PrefsContext';
import { useShell } from '../shell/ShellContext';
import { ContextMenu } from '../ui/ContextMenu';
import { useWM } from '../wm/WindowManager';
import styles from './TopBar.module.css';

/** The ⭘ button (wlogout on the real desktop) becomes the session menu. */
export function PowerMenu() {
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const wm = useWM();
  const { reset } = usePrefs();
  const { setSimpleView, notify } = useShell();

  const close = useCallback(() => {
    setAnchor(null);
    button.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={button}
        className={`${styles.module} ${styles.power}`}
        aria-haspopup="menu"
        aria-expanded={anchor !== null}
        aria-label="Menu da sessão"
        title="Menu da sessão"
        onClick={() => {
          const r = button.current!.getBoundingClientRect();
          setAnchor(anchor ? null : { x: r.left, y: r.bottom + 4 });
        }}
      >
        ⭘
      </button>
      {anchor && (
        <ContextMenu
          label="Menu da sessão"
          anchorRef={button}
          x={anchor.x}
          y={anchor.y}
          onClose={close}
          items={[
            { label: 'Visão simples', icon: LayoutList, action: () => setSimpleView(true) },
            { label: 'Atalhos de teclado', icon: Keyboard, hint: 'Alt+H', action: () => wm.openApp('keys') },
            'separator',
            { label: 'Fechar todas as janelas', icon: SquareX, action: wm.closeAll },
            {
              label: 'Restaurar padrões',
              icon: RotateCcw,
              action: () => {
                wm.closeAll();
                reset();
                notify('Preferências restauradas', 'success');
              },
            },
          ]}
        />
      )}
    </>
  );
}
