import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { apps } from '../apps/registry';
import type { AppId, AppProps } from '../apps/ids';
import { initialState, windowReducer, type Rect, type WMAction, type WMState } from './windowReducer';

export interface WMActions {
  openApp: (app: AppId, props?: AppProps) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  restore: (id: string) => void;
  toggleMaximize: (id: string) => void;
  setRect: (id: string, rect: Rect) => void;
  setTitle: (id: string, title: string) => void;
  switchWorkspace: (workspace: number) => void;
  moveToWorkspace: (id: string, workspace: number) => void;
  cycleFocus: (direction: 1 | -1) => void;
  closeAll: () => void;
}

// State and actions live in separate contexts: apps only need the (stable)
// actions, so moving or focusing a window does not re-render their content.
const StateContext = createContext<WMState | null>(null);
const ActionsContext = createContext<WMActions | null>(null);

/** Height of the top bar; must match --bar-height in tokens.css. */
export const BAR_HEIGHT = 26;

function viewportBounds() {
  return { w: window.innerWidth, h: window.innerHeight - BAR_HEIGHT };
}

function openAction(app: AppId, props: AppProps = {}, extra?: { workspace: number; maximized: boolean }): WMAction {
  const def = apps[app];
  return { type: 'open', app, props, key: def.instanceKey(props), title: def.title(props), size: def.size, ...extra };
}

/** Windows already running when the desktop starts, like apps autostarted on other workspaces. */
const STARTUP: { app: AppId; workspace: number }[] = [
  { app: 'falsefy', workspace: 2 },
  { app: 'claude', workspace: 3 },
];

function startupState(): WMState {
  return STARTUP.reduce(
    (state, { app, workspace }) => windowReducer(state, openAction(app, {}, { workspace, maximized: true })),
    initialState(viewportBounds()),
  );
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowReducer, undefined, startupState);

  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => dispatch({ type: 'setBounds', bounds: viewportBounds() }));
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const actions = useMemo<WMActions>(
    () => ({
      openApp: (app, props = {}) => dispatch(openAction(app, props)),
      close: (id) => dispatch({ type: 'close', id }),
      focus: (id) => dispatch({ type: 'focus', id }),
      minimize: (id) => dispatch({ type: 'minimize', id }),
      restore: (id) => dispatch({ type: 'restore', id }),
      toggleMaximize: (id) => dispatch({ type: 'toggleMaximize', id }),
      setRect: (id, rect) => dispatch({ type: 'setRect', id, rect }),
      setTitle: (id, title) => dispatch({ type: 'setTitle', id, title }),
      switchWorkspace: (workspace) => dispatch({ type: 'switchWorkspace', workspace }),
      moveToWorkspace: (id, workspace) => dispatch({ type: 'moveToWorkspace', id, workspace }),
      cycleFocus: (direction) => dispatch({ type: 'cycleFocus', direction }),
      closeAll: () => dispatch({ type: 'closeAll' }),
    }),
    [],
  );

  return (
    <ActionsContext.Provider value={actions}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </ActionsContext.Provider>
  );
}

export function useWMState(): WMState {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error('useWMState must be used inside WindowManagerProvider');
  return ctx;
}

export function useWM(): WMActions {
  const ctx = useContext(ActionsContext);
  if (!ctx) throw new Error('useWM must be used inside WindowManagerProvider');
  return ctx;
}
