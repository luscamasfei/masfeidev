import { useCallback, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { commandNames, execute } from '../../terminal/commands';
import { complete } from '../../terminal/complete';
import { tokenize } from '../../terminal/parser';
import { ArchLogo } from '../../ui/ArchLogo';
import styles from './TerminalApp.module.css';

interface Entry {
  id: number;
  /** Echo of a typed command, with the prompt color as it was at that moment. */
  command?: { ok: boolean; text: string };
  output?: ReactNode;
  error?: boolean;
}

const MAX_ENTRIES = 300;
const MAX_HISTORY = 100;

/** Starship prompt from ~/.config/starship.toml: Arch glyph, directory, then ❯. */
function Prompt({ ok }: { ok: boolean }) {
  return (
    <span className={styles.prompt} aria-hidden>
      <ArchLogo size={12} />
      <span className={styles.path}> ~ </span>
      {/* Starship's "❯"; drawn as SVG because the web font subset has no such glyph. */}
      <svg className={ok ? styles.charOk : styles.charErr} width="9" height="11" viewBox="0 0 9 11" aria-hidden>
        <path d="M1.5 1.5 6.5 5.5 1.5 9.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    </span>
  );
}

export default function TerminalApp() {
  const [entries, setEntries] = useState<Entry[]>(() => [
    {
      id: 0,
      output: (
        <span className={styles.muted}>
          Digite <b className={styles.hl}>help</b> para ver os comandos disponíveis.
        </span>
      ),
    },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [lastOk, setLastOk] = useState(true);
  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  const push = useCallback((entry: Omit<Entry, 'id'>) => {
    setEntries((list) => [...list, { ...entry, id: nextId.current++ }].slice(-MAX_ENTRIES));
  }, []);

  const run = (line: string) => {
    const text = line.trim();
    const echo = { ok: lastOk, text: line };
    setInput('');
    setHistoryIndex(null);
    if (!text) {
      push({ command: echo });
      return;
    }
    setHistory((h) => [...h.filter((x) => x !== text), text].slice(-MAX_HISTORY));

    const parsed = tokenize(text);
    if (!parsed.ok) {
      push({ command: echo, output: `erro de sintaxe: ${parsed.error}`, error: true });
      setLastOk(false);
      return;
    }
    push({ command: echo });
    let result;
    try {
      result = execute(parsed.tokens);
    } catch (err) {
      result = { output: `erro interno: ${(err as Error).message}`, error: true };
    }
    if (result?.output !== undefined) push({ output: result.output, error: result.error });
    setLastOk(!result?.error);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      run(input);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length === 0) return;
      const index =
        e.key === 'ArrowUp'
          ? Math.max(0, (historyIndex ?? history.length) - 1)
          : historyIndex === null
            ? null
            : historyIndex + 1;
      if (index === null || index >= history.length) {
        setHistoryIndex(null);
        setInput('');
      } else {
        setHistoryIndex(index);
        setInput(history[index]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const result = complete(input, commandNames);
      setInput(result.line);
      if (result.options.length) push({ command: { ok: lastOk, text: input }, output: result.options.join('  ') });
    } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setEntries([]);
    } else if (e.ctrlKey && e.key.toLowerCase() === 'c' && !window.getSelection()?.toString()) {
      e.preventDefault();
      push({ command: { ok: lastOk, text: `${input}^C` } });
      setInput('');
      setHistoryIndex(null);
    }
  };

  // Clicking anywhere focuses the prompt, unless the visitor is selecting text.
  const focusInput = () => {
    if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className={styles.terminal} ref={scrollRef} onMouseUp={focusInput}>
      <div role="log" aria-live="polite" aria-label="Saída do terminal">
        {entries.map((entry) => (
          <div key={entry.id} className={styles.entry}>
            {entry.command && (
              <div>
                <Prompt ok={entry.command.ok} />
                <span className="visually-hidden">$ </span>
                <span>{entry.command.text}</span>
              </div>
            )}
            {entry.output !== undefined && <div className={entry.error ? styles.error : undefined}>{entry.output}</div>}
          </div>
        ))}
      </div>
      <div className={styles.inputLine}>
        <Prompt ok={lastOk} />
        <input
          ref={inputRef}
          data-autofocus
          className={styles.input}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setHistoryIndex(null);
          }}
          onKeyDown={onKeyDown}
          aria-label="Comando"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={300}
          autoFocus
        />
      </div>
    </div>
  );
}
