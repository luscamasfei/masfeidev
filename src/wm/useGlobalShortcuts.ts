import { useEffect, useRef } from 'react';
import { useShell } from '../shell/ShellContext';
import { WORKSPACES } from './shortcuts';
import { useWM, useWMState } from './WindowManager';

/** Global key bindings. The list shown to visitors lives in shortcuts.ts. */
export function useGlobalShortcuts(enabled: boolean) {
  const wm = useWM();
  const { focusedId } = useWMState();
  const { setLauncherOpen } = useShell();
  const focusedRef = useRef(focusedId);
  focusedRef.current = focusedId;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.altKey || e.metaKey;
      if (!mod) return;

      // Ctrl + Alt (+ Shift) + digit: workspaces. `code` ignores Shift turning 1 into "!".
      const digit = /^Digit([1-9])$/.exec(e.code);
      if (digit && e.ctrlKey) {
        const n = Number(digit[1]);
        if (!WORKSPACES.includes(n as (typeof WORKSPACES)[number])) return;
        e.preventDefault();
        if (e.shiftKey) {
          if (focusedRef.current) wm.moveToWorkspace(focusedRef.current, n);
        } else {
          wm.switchWorkspace(n);
        }
        return;
      }
      if (e.ctrlKey || e.shiftKey) return;

      const id = focusedRef.current;
      const run = (fn: () => void) => {
        e.preventDefault();
        fn();
      };
      switch (e.code) {
        case 'Space':
          return run(() => setLauncherOpen(true));
        case 'Enter':
          return run(() => wm.openApp('terminal'));
        case 'KeyE':
          return run(() => wm.openApp('files'));
        case 'KeyH':
          return run(() => wm.openApp('keys'));
        case 'KeyJ':
          return run(() => wm.cycleFocus(1));
        case 'KeyK':
          return run(() => wm.cycleFocus(-1));
        case 'KeyQ':
          return id && run(() => wm.close(id));
        case 'KeyF':
          return id && run(() => wm.toggleMaximize(id));
        case 'KeyM':
          return id && run(() => wm.minimize(id));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, wm, setLauncherOpen]);
}
