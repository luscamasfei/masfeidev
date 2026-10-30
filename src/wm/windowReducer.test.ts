import { describe, expect, it } from 'vitest';
import { clampRect, initialState, MIN_SIZE, windowReducer, type WMAction, type WMState } from './windowReducer';

const bounds = { w: 1280, h: 720 };
const size = { w: 600, h: 400 };

function run(actions: WMAction[], state: WMState = initialState(bounds)): WMState {
  return actions.reduce(windowReducer, state);
}

const open = (key: string | null = null): WMAction => ({ type: 'open', app: 'terminal', props: {}, key, title: 't', size });

describe('windowReducer', () => {
  it('opens windows on top and focuses them', () => {
    const s = run([open(), open()]);
    expect(s.stack).toEqual(['win-1', 'win-2']);
    expect(s.focusedId).toBe('win-2');
  });

  it('reuses windows with the same key', () => {
    const s = run([open('about'), open(), open('about')]);
    expect(Object.keys(s.windows)).toHaveLength(2);
    expect(s.focusedId).toBe('win-1');
    expect(s.stack.at(-1)).toBe('win-1');
  });

  it('focus raises a window; close hands focus to the next visible one', () => {
    let s = run([open(), open(), open(), { type: 'focus', id: 'win-1' }]);
    expect(s.stack.at(-1)).toBe('win-1');
    s = windowReducer(s, { type: 'close', id: 'win-1' });
    expect(s.focusedId).toBe('win-3');
    expect(s.windows['win-1']).toBeUndefined();
  });

  it('minimize and restore', () => {
    let s = run([open(), open(), { type: 'minimize', id: 'win-2' }]);
    expect(s.windows['win-2'].minimized).toBe(true);
    expect(s.focusedId).toBe('win-1');
    s = windowReducer(s, { type: 'restore', id: 'win-2' });
    expect(s.windows['win-2'].minimized).toBe(false);
    expect(s.focusedId).toBe('win-2');
  });

  it('workspaces separate windows and restoring switches to the right one', () => {
    let s = run([open(), { type: 'switchWorkspace', workspace: 2 }]);
    expect(s.focusedId).toBeNull();
    s = run([open(), { type: 'moveToWorkspace', id: 'win-2', workspace: 3 }], s);
    expect(s.windows['win-2'].workspace).toBe(3);
    s = windowReducer(s, { type: 'restore', id: 'win-2' });
    expect(s.workspace).toBe(3);
  });

  it('toggles maximize and setRect leaves maximized mode', () => {
    let s = run([open(), { type: 'toggleMaximize', id: 'win-1' }]);
    expect(s.windows['win-1'].maximized).toBe(true);
    s = windowReducer(s, { type: 'setRect', id: 'win-1', rect: { x: 10, y: 10, w: 500, h: 300 } });
    expect(s.windows['win-1'].maximized).toBe(false);
  });

  it('cycles focus through the workspace', () => {
    let s = run([open(), open(), open()]);
    s = windowReducer(s, { type: 'cycleFocus', direction: 1 });
    expect(s.focusedId).toBe('win-1');
    s = windowReducer(s, { type: 'cycleFocus', direction: -1 });
    expect(s.focusedId).toBe('win-3');
  });

  it('can open a maximized window on another workspace without taking focus', () => {
    const s = run([open(), { ...open(), workspace: 3, maximized: true } as WMAction]);
    expect(s.windows['win-2']).toMatchObject({ workspace: 3, maximized: true });
    expect(s.workspace).toBe(1);
    expect(s.focusedId).toBe('win-1');
  });

  it('ignores actions for unknown windows', () => {
    const s = run([open()]);
    expect(windowReducer(s, { type: 'close', id: 'nope' })).toBe(s);
  });

  it('keeps windows reachable after the viewport shrinks', () => {
    let s = run([open(), { type: 'setRect', id: 'win-1', rect: { x: 1200, y: 650, w: 600, h: 400 } }]);
    s = windowReducer(s, { type: 'setBounds', bounds: { w: 400, h: 300 } });
    const r = s.windows['win-1'].rect;
    expect(r.x).toBeLessThanOrEqual(400 - 80);
    expect(r.y).toBeLessThanOrEqual(300 - 30);
    expect(r.w).toBeLessThanOrEqual(400);
  });
});

describe('clampRect', () => {
  it('enforces minimum size and keeps the title bar on screen', () => {
    const r = clampRect({ x: -5000, y: -50, w: 10, h: 10 }, bounds);
    expect(r.w).toBe(MIN_SIZE.w);
    expect(r.h).toBe(MIN_SIZE.h);
    expect(r.x + r.w).toBeGreaterThanOrEqual(80);
    expect(r.y).toBe(0);
  });
});
