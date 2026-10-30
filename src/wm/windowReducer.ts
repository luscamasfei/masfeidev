import type { AppId, AppProps } from '../apps/ids';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Size {
  w: number;
  h: number;
}

export interface WindowState {
  id: string;
  app: AppId;
  props: AppProps;
  /** Windows sharing a key are the same instance (e.g. one viewer per project). */
  key: string | null;
  title: string;
  rect: Rect;
  minimized: boolean;
  maximized: boolean;
  workspace: number;
}

export interface WMState {
  windows: Record<string, WindowState>;
  /** Stacking order, bottom to top. The z-index is the position in this list. */
  stack: string[];
  focusedId: string | null;
  workspace: number;
  /** Size of the area below the top bar where windows live. */
  bounds: Size;
  seq: number;
}

export type WMAction =
  | {
      type: 'open';
      app: AppId;
      props: AppProps;
      key: string | null;
      title: string;
      size: Size;
      /** Target workspace; defaults to the current one. Opening elsewhere does not steal focus. */
      workspace?: number;
      maximized?: boolean;
    }
  | { type: 'close'; id: string }
  | { type: 'focus'; id: string }
  | { type: 'minimize'; id: string }
  | { type: 'restore'; id: string }
  | { type: 'toggleMaximize'; id: string }
  | { type: 'setRect'; id: string; rect: Rect }
  | { type: 'setTitle'; id: string; title: string }
  | { type: 'switchWorkspace'; workspace: number }
  | { type: 'moveToWorkspace'; id: string; workspace: number }
  | { type: 'cycleFocus'; direction: 1 | -1 }
  | { type: 'setBounds'; bounds: Size }
  | { type: 'closeAll' };

export const GAP = 5;
export const MIN_SIZE: Size = { w: 300, h: 180 };
/** Part of the title bar that must stay on screen so a window can always be grabbed. */
const GRAB_MARGIN = 80;
const TITLE_HEIGHT = 30;
const CASCADE_STEP = 28;

export function initialState(bounds: Size): WMState {
  return { windows: {}, stack: [], focusedId: null, workspace: 1, bounds, seq: 0 };
}

/** Keeps a window resizable and reachable: size within limits and title bar on screen. */
export function clampRect(rect: Rect, bounds: Size): Rect {
  const maxW = Math.max(MIN_SIZE.w, bounds.w - GAP * 2);
  const maxH = Math.max(MIN_SIZE.h, bounds.h - GAP * 2);
  const w = Math.round(Math.min(Math.max(rect.w, MIN_SIZE.w), maxW));
  const h = Math.round(Math.min(Math.max(rect.h, MIN_SIZE.h), maxH));
  const x = Math.round(Math.min(Math.max(rect.x, GRAB_MARGIN - w), bounds.w - GRAB_MARGIN));
  const y = Math.round(Math.min(Math.max(rect.y, 0), bounds.h - TITLE_HEIGHT));
  return { x, y, w, h };
}

export function isVisible(win: WindowState, workspace: number): boolean {
  return win.workspace === workspace && !win.minimized;
}

/** Top-most visible window of a workspace, used to hand focus over after a change. */
function topVisible(state: WMState, workspace: number, exclude?: string): string | null {
  for (let i = state.stack.length - 1; i >= 0; i--) {
    const id = state.stack[i];
    if (id !== exclude && isVisible(state.windows[id], workspace)) return id;
  }
  return null;
}

function raise(stack: string[], id: string): string[] {
  return [...stack.filter((s) => s !== id), id];
}

function patch(state: WMState, id: string, changes: Partial<WindowState>): WMState {
  return { ...state, windows: { ...state.windows, [id]: { ...state.windows[id], ...changes } } };
}

function focusWindow(state: WMState, id: string): WMState {
  const win = state.windows[id];
  return {
    ...patch(state, id, { minimized: false }),
    stack: raise(state.stack, id),
    focusedId: id,
    workspace: win.workspace,
  };
}

export function windowReducer(state: WMState, action: WMAction): WMState {
  if ('id' in action && !state.windows[action.id]) return state;

  switch (action.type) {
    case 'open': {
      const existing = action.key
        ? Object.values(state.windows).find((w) => w.key === action.key)
        : undefined;
      if (existing) return focusWindow(state, existing.id);

      const seq = state.seq + 1;
      const id = `win-${seq}`;
      const workspace = action.workspace ?? state.workspace;
      const inWorkspace = Object.values(state.windows).filter((w) => w.workspace === workspace).length;
      const offset = (inWorkspace % 6) * CASCADE_STEP;
      const w = Math.min(action.size.w, state.bounds.w - GAP * 2);
      const h = Math.min(action.size.h, state.bounds.h - GAP * 2);
      const rect = clampRect(
        {
          x: (state.bounds.w - w) / 2 + offset - CASCADE_STEP,
          y: Math.max(GAP, (state.bounds.h - h) / 2 - 40) + offset,
          w,
          h,
        },
        state.bounds,
      );
      const win: WindowState = {
        id,
        app: action.app,
        props: action.props,
        key: action.key,
        title: action.title,
        rect,
        minimized: false,
        maximized: action.maximized ?? false,
        workspace,
      };
      return {
        ...state,
        seq,
        windows: { ...state.windows, [id]: win },
        stack: [...state.stack, id],
        focusedId: workspace === state.workspace ? id : state.focusedId,
      };
    }

    case 'close': {
      const windows = { ...state.windows };
      delete windows[action.id];
      const next = { ...state, windows, stack: state.stack.filter((s) => s !== action.id) };
      return state.focusedId === action.id ? { ...next, focusedId: topVisible(next, state.workspace) } : next;
    }

    case 'focus':
    case 'restore':
      return focusWindow(state, action.id);

    case 'minimize': {
      const next = patch(state, action.id, { minimized: true });
      return { ...next, focusedId: topVisible(next, state.workspace) };
    }

    case 'toggleMaximize':
      return focusWindow(patch(state, action.id, { maximized: !state.windows[action.id].maximized }), action.id);

    case 'setRect':
      return patch(state, action.id, { rect: clampRect(action.rect, state.bounds), maximized: false });

    case 'setTitle':
      return patch(state, action.id, { title: action.title });

    case 'switchWorkspace':
      if (action.workspace === state.workspace) return state;
      return { ...state, workspace: action.workspace, focusedId: topVisible(state, action.workspace) };

    case 'moveToWorkspace': {
      if (state.windows[action.id].workspace === action.workspace) return state;
      const next = patch(state, action.id, { workspace: action.workspace });
      return state.focusedId === action.id ? { ...next, focusedId: topVisible(next, state.workspace) } : next;
    }

    case 'cycleFocus': {
      // Includes minimized windows of the workspace so they can be reached by keyboard.
      const ids = state.stack
        .filter((id) => state.windows[id].workspace === state.workspace)
        .sort((a, b) => Number(a.slice(4)) - Number(b.slice(4)));
      if (ids.length === 0) return state;
      const current = state.focusedId ? ids.indexOf(state.focusedId) : -1;
      const nextIndex = (current + action.direction + ids.length) % ids.length;
      return focusWindow(state, ids[nextIndex]);
    }

    case 'setBounds': {
      const windows: Record<string, WindowState> = {};
      for (const [id, win] of Object.entries(state.windows)) {
        windows[id] = { ...win, rect: clampRect(win.rect, action.bounds) };
      }
      return { ...state, bounds: action.bounds, windows };
    }

    case 'closeAll':
      return { ...state, windows: {}, stack: [], focusedId: null };
  }
}
