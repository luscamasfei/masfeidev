import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import type { LucideIcon } from 'lucide-react';
import styles from './ContextMenu.module.css';

export type MenuItem =
  | { label: string; icon?: LucideIcon; action: () => void; disabled?: boolean; hint?: string }
  | 'separator';

interface Props {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
  label: string;
  /** The button that opened the menu; pressing it again is left to its own toggle. */
  anchorRef?: RefObject<HTMLElement | null>;
}

/** Popup menu used for right-click menus and the power menu. Keyboard: arrows, Enter, Esc. */
export function ContextMenu({ x, y, items, onClose, label, anchorRef }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });

  // Keep the menu inside the viewport once its real size is known.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setPos({
      x: Math.max(4, Math.min(x, window.innerWidth - width - 4)),
      y: Math.max(4, Math.min(y, window.innerHeight - height - 4)),
    });
  }, [x, y]);

  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!ref.current?.contains(target) && !anchorRef?.current?.contains(target)) onClose();
    };
    const onBlur = () => onClose();
    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('blur', onBlur);
    window.addEventListener('resize', onBlur);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('resize', onBlur);
    };
  }, [onClose, anchorRef]);

  const onKeyDown = (e: KeyboardEvent) => {
    const buttons = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      buttons[(index + step + buttons.length) % buttons.length]?.focus();
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      buttons[e.key === 'Home' ? 0 : buttons.length - 1]?.focus();
    }
  };

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={label}
      className={styles.menu}
      style={{ left: pos.x, top: pos.y }}
      onKeyDown={onKeyDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, i) =>
        item === 'separator' ? (
          <div key={`sep-${i}`} role="separator" className={styles.separator} />
        ) : (
          <button
            key={item.label}
            role="menuitem"
            className={styles.item}
            disabled={item.disabled}
            onClick={() => {
              onClose();
              item.action();
            }}
          >
            {item.icon ? <item.icon size={14} aria-hidden /> : <span className={styles.iconSpace} />}
            <span className={styles.label}>{item.label}</span>
            {item.hint && <span className={styles.hint}>{item.hint}</span>}
          </button>
        ),
      )}
    </div>
  );
}
