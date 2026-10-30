import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { Command, FolderOpen, Image, Keyboard, LayoutGrid, LayoutList, ExternalLink, RotateCcw, SquareTerminal } from 'lucide-react';
import { useOpener } from '../apps/useOpener';
import { desktopEntries } from '../fs/vfs';
import { trackPointer } from '../lib/trackPointer';
import { usePrefs } from '../prefs/PrefsContext';
import type { Point } from '../prefs/storage';
import { useShell } from '../shell/ShellContext';
import { ContextMenu, type MenuItem } from '../ui/ContextMenu';
import { nodeIcon } from '../ui/nodeIcon';
import { useWM, useWMState } from '../wm/WindowManager';
import { boxFromPoints, clampIcon, defaultIconPosition, iconIntersects, type Box } from './iconLayout';
import styles from './Desktop.module.css';

const DRAG_THRESHOLD = 4;
/** Icons live only on the first workspace; the others are left to their windows. */
const ICON_WORKSPACE = 1;

type Menu = { x: number; y: number; icon: string | null };

export function Desktop() {
  const { bounds, workspace } = useWMState();
  const showIcons = workspace === ICON_WORKSPACE;
  const wm = useWM();
  const open = useOpener();
  const { prefs, update } = usePrefs();
  const { notify, setLauncherOpen, setSimpleView } = useShell();

  const areaRef = useRef<HTMLDivElement>(null);
  const stopTracking = useRef<(() => void) | null>(null);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [drag, setDrag] = useState<{ names: Set<string>; dx: number; dy: number } | null>(null);
  const [marquee, setMarquee] = useState<Box | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);


  const positions = useMemo(() => {
    const map = new Map<string, Point>();
    desktopEntries.forEach((node, i) => {
      map.set(node.name, clampIcon(prefs.iconPositions[node.name] ?? defaultIconPosition(i, bounds), bounds));
    });
    return map;
  }, [prefs.iconPositions, bounds]);

  useEffect(() => () => stopTracking.current?.(), []);

  const openIcon = useCallback(
    (name: string) => {
      const entry = desktopEntries.find((e) => e.name === name);
      const error = entry ? open(entry) : `${name}: item não encontrado`;
      if (error) notify(error, 'error');
    },
    [open, notify],
  );

  const toLocal = (clientX: number, clientY: number): Point => {
    const r = areaRef.current!.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  };

  // ---- Icons: select, drag (all selected icons move together), open ----
  const onIconPointerDown = (name: string) => (e: PointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      setSelected((s) => {
        const next = new Set(s);
        if (next.has(name)) next.delete(name);
        else next.add(name);
        return next;
      });
      return;
    }
    const names = selected.has(name) ? new Set(selected) : new Set([name]);
    setSelected(names);
    let moved = false;
    const touch = e.pointerType !== 'mouse';
    stopTracking.current?.();
    stopTracking.current = trackPointer(e, {
      onMove: (dx, dy) => {
        moved = moved || Math.hypot(dx, dy) > DRAG_THRESHOLD;
        if (moved) setDrag({ names, dx, dy });
      },
      onEnd: (dx, dy, cancelled) => {
        stopTracking.current = null;
        setDrag(null);
        if (moved && !cancelled) {
          update((p) => {
            const iconPositions = { ...p.iconPositions };
            for (const n of names) {
              const from = positions.get(n)!;
              iconPositions[n] = clampIcon({ x: from.x + dx, y: from.y + dy }, bounds);
            }
            return { ...p, iconPositions };
          });
        } else if (!moved && touch && !cancelled) {
          // Touch screens have no double click: a tap opens the item.
          openIcon(name);
        }
      },
    });
  };

  const onIconKeyDown = (name: string, index: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      openIcon(name);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
      const buttons = areaRef.current?.querySelectorAll<HTMLButtonElement>('[data-icon]');
      if (buttons?.length) buttons[(index + step + buttons.length) % buttons.length].focus();
    } else if (e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey)) {
      e.preventDefault();
      const r = e.currentTarget.getBoundingClientRect();
      setSelected(new Set([name]));
      setMenu({ x: r.left + r.width / 2, y: r.top + r.height / 2, icon: name });
    }
  };

  // ---- Empty area: clear selection and rubber-band select ----
  const onAreaPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 || e.target !== e.currentTarget) return;
    const additive = e.ctrlKey || e.metaKey;
    const base = additive ? new Set(selected) : new Set<string>();
    setSelected(base);
    if (e.pointerType !== 'mouse' || !showIcons) return;
    const start = toLocal(e.clientX, e.clientY);
    stopTracking.current?.();
    stopTracking.current = trackPointer(e, {
      onMove: (dx, dy) => {
        const box = boxFromPoints(start, { x: start.x + dx, y: start.y + dy });
        setMarquee(box);
        const next = new Set(base);
        for (const [n, p] of positions) if (iconIntersects(box, p)) next.add(n);
        setSelected(next);
      },
      onEnd: () => {
        stopTracking.current = null;
        setMarquee(null);
      },
    });
  };

  const onContextMenu = (e: MouseEvent, icon: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    if (icon && !selected.has(icon)) setSelected(new Set([icon]));
    setMenu({ x: e.clientX, y: e.clientY, icon });
  };

  const closeMenu = useCallback(() => setMenu(null), []);

  const menuItems = (m: Menu): MenuItem[] => {
    if (m.icon) {
      const name = m.icon;
      return [
        { label: 'Abrir', icon: ExternalLink, hint: 'Enter', action: () => openIcon(name) },
        {
          label: 'Posição automática',
          icon: RotateCcw,
          disabled: !prefs.iconPositions[name],
          action: () =>
            update((p) => {
              const iconPositions = { ...p.iconPositions };
              delete iconPositions[name];
              return { ...p, iconPositions };
            }),
        },
      ];
    }
    return [
      { label: 'Abrir terminal', icon: SquareTerminal, hint: 'Alt+Enter', action: () => wm.openApp('terminal') },
      { label: 'Abrir arquivos', icon: FolderOpen, hint: 'Alt+E', action: () => wm.openApp('files') },
      { label: 'Lançador', icon: Command, hint: 'Alt+Espaço', action: () => setLauncherOpen(true) },
      'separator',
      {
        label: 'Organizar ícones',
        icon: LayoutGrid,
        action: () => {
          update((p) => ({ ...p, iconPositions: {} }));
          notify('Ícones reorganizados', 'success');
        },
      },
      {
        label: prefs.wallpaper === 'image' ? 'Papel de parede sólido' : 'Papel de parede original',
        icon: Image,
        action: () => update((p) => ({ ...p, wallpaper: p.wallpaper === 'image' ? 'solid' : 'image' })),
      },
      'separator',
      { label: 'Atalhos de teclado', icon: Keyboard, hint: 'Alt+H', action: () => wm.openApp('keys') },
      { label: 'Visão simples', icon: LayoutList, action: () => setSimpleView(true) },
    ];
  };

  return (
    <div
      ref={areaRef}
      className={styles.desktop}
      onPointerDown={onAreaPointerDown}
      onContextMenu={(e) => onContextMenu(e, null)}
      role="group"
      aria-label="Área de trabalho"
    >
      {showIcons &&
        desktopEntries.map((node, index) => {
          const Icon = nodeIcon(node);
          const base = positions.get(node.name)!;
          const pos = drag?.names.has(node.name) ? clampIcon({ x: base.x + drag.dx, y: base.y + drag.dy }, bounds) : base;
          const isSelected = selected.has(node.name);
          return (
            <button
              key={node.name}
              data-icon
              className={[styles.icon, isSelected ? styles.selected : '', drag?.names.has(node.name) ? styles.dragging : ''].join(' ')}
              style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
              onPointerDown={onIconPointerDown(node.name)}
              onDoubleClick={() => openIcon(node.name)}
              onKeyDown={onIconKeyDown(node.name, index)}
              onFocus={(e) => e.currentTarget.matches(':focus-visible') && setSelected(new Set([node.name]))}
              onContextMenu={(e) => onContextMenu(e, node.name)}
              aria-pressed={isSelected}
              title={node.description}
            >
              <span className={styles.glyph}>
                <Icon size={30} strokeWidth={1.75} aria-hidden />
              </span>
              <span className={styles.label}>{node.name}</span>
            </button>
          );
        })}
      {marquee && (
        <div className={styles.marquee} style={{ left: marquee.x, top: marquee.y, width: marquee.w, height: marquee.h }} aria-hidden />
      )}
      {menu && (
        <ContextMenu
          label={menu.icon ? `Ações de ${menu.icon}` : 'Ações da área de trabalho'}
          x={menu.x}
          y={menu.y}
          items={menuItems(menu)}
          onClose={closeMenu}
        />
      )}
    </div>
  );
}
