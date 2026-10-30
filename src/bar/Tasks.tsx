import { apps } from '../apps/registry';
import { useWM, useWMState } from '../wm/WindowManager';
import styles from './TopBar.module.css';

/** Windows of the current workspace. Click focuses, minimizes, or restores a minimized one. */
export function Tasks() {
  const { windows, workspace, focusedId } = useWMState();
  const wm = useWM();
  const list = Object.values(windows).filter((w) => w.workspace === workspace);

  return (
    <nav className={styles.tasks} aria-label="Janelas abertas">
      {list.map((win) => {
        const Icon = apps[win.app].icon;
        const focused = win.id === focusedId;
        return (
          <button
            key={win.id}
            className={[styles.task, focused ? styles.taskFocused : '', win.minimized ? styles.taskMinimized : ''].join(' ')}
            onClick={() => (focused ? wm.minimize(win.id) : wm.restore(win.id))}
            aria-pressed={focused}
            title={win.minimized ? `${win.title} (minimizada)` : win.title}
          >
            <Icon size={13} aria-hidden />
            <span className={styles.taskLabel}>{win.title}</span>
          </button>
        );
      })}
    </nav>
  );
}
