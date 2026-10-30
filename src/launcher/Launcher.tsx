import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import { apps } from '../apps/registry';
import { useOpener } from '../apps/useOpener';
import { displayPath } from '../fs/path';
import { allFiles, getNode } from '../fs/vfs';
import { usePrefs } from '../prefs/PrefsContext';
import { useShell } from '../shell/ShellContext';
import { nodeIcon } from '../ui/nodeIcon';
import { useWM } from '../wm/WindowManager';
import styles from './Launcher.module.css';

interface Entry {
  id: string;
  label: string;
  detail: string;
  icon: LucideIcon;
  run: () => string | null | void;
}

/** Application/file launcher modelled on the Rofi theme in ~/.config/rofi/config.rasi. */
export function Launcher() {
  const { setLauncherOpen, notify } = useShell();
  const { openApp } = useWM();
  const open = useOpener();
  const { prefs } = usePrefs();
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const returnFocus = useRef<Element | null>(document.activeElement);

  const entries = useMemo<Entry[]>(() => {
    const appEntries = Object.values(apps)
      .filter((a) => a.launchable)
      .map((a) => ({ id: `app:${a.id}`, label: a.name, detail: a.description, icon: a.icon, run: () => openApp(a.id) }));
    const fileEntries = allFiles()
      .filter(({ node }) => node.target.kind !== 'app')
      .map(({ path, node }) => ({
        id: `file:${path}`,
        label: node.name,
        detail: displayPath(path),
        icon: nodeIcon(node),
        run: () => open(path),
      }));
    return [...appEntries, ...fileEntries];
  }, [openApp, open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const recent = prefs.recent
        .filter((p) => getNode(p))
        .map((p) => entries.find((e) => e.id === `file:${p}`))
        .filter((e): e is Entry => Boolean(e));
      return [...recent, ...entries.filter((e) => !recent.includes(e))];
    }
    return entries.filter((e) => `${e.label} ${e.detail}`.toLowerCase().includes(q));
  }, [query, entries, prefs.recent]);

  useEffect(() => {
    inputRef.current?.focus();
    const previous = returnFocus.current;
    return () => {
      if (previous instanceof HTMLElement && document.contains(previous)) previous.focus();
    };
  }, []);

  useEffect(() => setIndex(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  const close = () => setLauncherOpen(false);

  const activate = (entry: Entry | undefined) => {
    if (!entry) return;
    returnFocus.current = null;
    close();
    const error = entry.run();
    if (typeof error === 'string') notify(error, 'error');
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      activate(results[index]);
    }
  };

  const activeId = results[index] ? `launcher-${index}` : undefined;

  return (
    <div className={styles.backdrop} onPointerDown={(e) => e.target === e.currentTarget && close()}>
      <div className={styles.window} role="dialog" aria-modal="true" aria-label="Lançador" onKeyDown={onKeyDown}>
        <div className={styles.inputbar}>
          <span className={styles.prompt}>Open</span>
          <span className={styles.colon}>&gt;</span>
          <input
            ref={inputRef}
            className={styles.entry}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls="launcher-list"
            aria-activedescendant={activeId}
            aria-label="Buscar aplicativos e arquivos"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <ul id="launcher-list" ref={listRef} className={styles.list} role="listbox">
          {results.length === 0 && <li className={styles.empty}>Nenhum resultado</li>}
          {results.map((entry, i) => (
            <li
              key={entry.id}
              id={`launcher-${i}`}
              data-index={i}
              role="option"
              aria-selected={i === index}
              className={i === index ? `${styles.item} ${styles.selected}` : styles.item}
              onPointerMove={() => setIndex(i)}
              onClick={() => activate(entry)}
            >
              <entry.icon size={22} className={styles.icon} aria-hidden />
              <span className={styles.name}>{entry.label}</span>
              <span className={styles.detail}>{entry.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
