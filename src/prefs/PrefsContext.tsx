import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { clearPrefs, defaultPrefs, loadPrefs, MAX_RECENT, savePrefs, type Prefs } from './storage';

interface PrefsApi {
  prefs: Prefs;
  update: (fn: (prev: Prefs) => Prefs) => void;
  addRecent: (path: string) => void;
  reset: () => void;
}

const PrefsContext = createContext<PrefsApi | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);

  // Debounced so dragging icons does not write to storage on every frame.
  useEffect(() => {
    const t = window.setTimeout(() => savePrefs(prefs), 300);
    return () => window.clearTimeout(t);
  }, [prefs]);

  const update = useCallback((fn: (prev: Prefs) => Prefs) => setPrefs(fn), []);

  const addRecent = useCallback((path: string) => {
    setPrefs((p) => ({ ...p, recent: [path, ...p.recent.filter((r) => r !== path)].slice(0, MAX_RECENT) }));
  }, []);

  const reset = useCallback(() => {
    clearPrefs();
    setPrefs(defaultPrefs);
  }, []);

  const api = useMemo(() => ({ prefs, update, addRecent, reset }), [prefs, update, addRecent, reset]);
  return <PrefsContext.Provider value={api}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): PrefsApi {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used inside PrefsProvider');
  return ctx;
}
