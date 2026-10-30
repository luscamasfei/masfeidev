import { WORKSPACES } from '../wm/shortcuts';
import { useWM, useWMState } from '../wm/WindowManager';
import styles from './TopBar.module.css';

export function Workspaces() {
  const { workspace, windows } = useWMState();
  const { switchWorkspace } = useWM();

  return (
    <div className={styles.workspaces}>
      {WORKSPACES.map((n) => {
        const count = Object.values(windows).filter((w) => w.workspace === n).length;
        const active = n === workspace;
        return (
          <button
            key={n}
            className={[styles.workspace, active ? styles.wsActive : '', count === 0 && !active ? styles.wsEmpty : ''].join(' ')}
            onClick={() => switchWorkspace(n)}
            aria-current={active ? 'true' : undefined}
            aria-label={`Área de trabalho ${n}, ${count} ${count === 1 ? 'janela' : 'janelas'}`}
            title={`Área de trabalho ${n} (Ctrl+Alt+${n})`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
