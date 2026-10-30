import { Window } from './Window';
import { useWMState } from './WindowManager';
import styles from './WindowLayer.module.css';

const COMPACT_WIDTH = 720;
const BASE_Z = 10;

export function WindowLayer() {
  const state = useWMState();
  const compact = state.bounds.w < COMPACT_WIDTH;

  // DOM order stays stable (creation order) so windows are never re-mounted;
  // stacking is controlled only through z-index derived from `state.stack`.
  return (
    <div className={styles.layer}>
      {Object.values(state.windows).map((win) => (
        <Window
          key={win.id}
          win={win}
          focused={state.focusedId === win.id}
          visible={win.workspace === state.workspace && !win.minimized}
          compact={compact}
          bounds={state.bounds}
          zIndex={BASE_Z + state.stack.indexOf(win.id)}
        />
      ))}
    </div>
  );
}
