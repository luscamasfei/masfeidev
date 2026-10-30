import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import styles from './Toasts.module.css';

/*
 * Desktop-wide services that are not windows: notifications (the swaync
 * equivalent), the launcher (Rofi) and switching to the simple view.
 */

export type ToastKind = 'info' | 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
}

export interface ShellApi {
  notify: (message: string, kind?: ToastKind) => void;
  launcherOpen: boolean;
  setLauncherOpen: (open: boolean) => void;
  simpleView: boolean;
  setSimpleView: (simple: boolean) => void;
}

const ShellContext = createContext<ShellApi | null>(null);
const TOAST_MS = 3500;

function readSimpleFromUrl(): boolean {
  return new URLSearchParams(window.location.search).get('view') === 'simple';
}

export function ShellProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [simpleView, setSimpleState] = useState(readSimpleFromUrl);
  const nextId = useRef(0);

  const notify = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = ++nextId.current;
    setToasts((t) => [...t.slice(-3), { id, message, kind }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), TOAST_MS);
  }, []);

  const setSimpleView = useCallback((simple: boolean) => {
    const url = new URL(window.location.href);
    if (simple) url.searchParams.set('view', 'simple');
    else url.searchParams.delete('view');
    window.history.replaceState(null, '', url);
    setSimpleState(simple);
  }, []);

  const api = useMemo(
    () => ({ notify, launcherOpen, setLauncherOpen, simpleView, setSimpleView }),
    [notify, launcherOpen, simpleView, setSimpleView],
  );

  return (
    <ShellContext.Provider value={api}>
      {children}
      <div className={styles.stack} role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`${styles.toast} ${styles[t.kind]}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ShellContext.Provider>
  );
}

export function useShell(): ShellApi {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error('useShell must be used inside ShellProvider');
  return ctx;
}
