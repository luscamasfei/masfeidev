import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Asterisk } from 'lucide-react';
import styles from './ClaudeApp.module.css';

/*
 * A staged Claude Code session for workspace 3. Nothing is sent anywhere:
 * the conversation is fixed text. The last answer is "typed" the first time
 * the window becomes visible, so it is not over before anyone looks.
 */

const FILE = 'distribuir.ts';

const CODE = [
  'export function distribuirTarefas(tarefas: number[], workers: number): number[] {',
  '  const carga = Array(workers).fill(0);',
  '',
  '  [...tarefas]',
  '    .sort((a, b) => b - a)',
  '    .forEach((tarefa) => {',
  '      const livre = carga.indexOf(Math.min(...carga));',
  '      carga[livre] += tarefa;',
  '    });',
  '',
  '  return carga;',
  '}',
];

const SUMMARY =
  'Esse arquivo tem uma função, `distribuirTarefas`, que divide uma lista de tarefas entre vários ' +
  '`workers` tentando deixar todo mundo com a mesma carga. Ela ordena as tarefas da maior para a ' +
  'menor e entrega cada uma ao worker menos ocupado naquele momento.';

const QUESTION = 'Me explique como se eu fosse um jumento';

const ANSWER = `Beleza, versão jumento:

Imagina uma pilha de fardos de capim (as \`tarefas\`), cada um com um peso, e alguns jumentos para carregar (os \`workers\`).

1. Primeiro você organiza os fardos do mais pesado para o mais leve (o \`sort\`).
2. Depois pega um fardo de cada vez e coloca no lombo do jumento que está carregando menos naquele momento (o \`indexOf(Math.min(...))\`).
3. No final, a função diz quanto peso ficou em cada jumento (o \`return carga\`).

Por que começar pelos pesados? Se eles ficassem para o fim, um jumento azarado podia receber um fardão por último e ficar sobrecarregado. Começando por eles, os leves vão completando os espaços e a carga fica equilibrada.

Resumindo: nenhum jumento sobrecarregado, nenhum jumento de folga.`;

const THINK_MS = 1400;
const CHARS_PER_TICK = 3;
const TICK_MS = 18;

const KEYWORDS = new Set(['export', 'function', 'const', 'return', 'number']);

/** Tiny highlighter for the sample code; produces text nodes only. */
function highlight(line: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\b[A-Za-z_]\w*\b|\d+|[^\w]+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const tok = m[0];
    const next = line[m.index + tok.length];
    const cls = KEYWORDS.has(tok)
      ? styles.kw
      : /^\d+$/.test(tok)
        ? styles.num
        : /^[A-Za-z_]/.test(tok) && next === '('
          ? styles.fn
          : undefined;
    parts.push(cls ? <span key={m.index} className={cls}>{tok}</span> : tok);
  }
  return parts;
}

/** Renders `inline code` spans inside plain text. */
function withInlineCode(text: string): ReactNode[] {
  return text.split(/(`[^`]*`?)/).map((part, i) =>
    part.startsWith('`') ? (
      <code key={i} className={styles.inline}>
        {part.replace(/`/g, '')}
      </code>
    ) : (
      part
    ),
  );
}

function Message({ children }: { children: ReactNode }) {
  return (
    <div className={styles.message}>
      <span className={styles.bullet} aria-hidden>
        ●
      </span>
      <div className={styles.messageBody}>{children}</div>
    </div>
  );
}

function UserPrompt({ text }: { text: string }) {
  return (
    <div className={styles.user}>
      <span className={styles.userMark}>&gt;</span> {text}
    </div>
  );
}

export default function ClaudeApp() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [phase, setPhase] = useState<'waiting' | 'thinking' | 'typing' | 'done'>(reduced ? 'done' : 'waiting');
  const [typed, setTyped] = useState(reduced ? ANSWER.length : 0);

  // Start the reply only once the window is actually on screen.
  useEffect(() => {
    if (phase !== 'waiting' || !rootRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setPhase('thinking');
        observer.disconnect();
      }
    });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [phase]);

  useEffect(() => {
    if (phase === 'thinking') {
      const t = window.setTimeout(() => setPhase('typing'), THINK_MS);
      return () => window.clearTimeout(t);
    }
    if (phase === 'typing') {
      const t = window.setInterval(() => setTyped((n) => Math.min(n + CHARS_PER_TICK, ANSWER.length)), TICK_MS);
      return () => window.clearInterval(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'typing' && typed === ANSWER.length) setPhase('done');
  }, [phase, typed]);

  // Keep the newest text in view while it is being typed.
  useEffect(() => {
    const el = rootRef.current;
    if (el && phase !== 'waiting') el.scrollTop = el.scrollHeight;
  }, [typed, phase]);

  return (
    <div className={styles.claude} ref={rootRef}>
      <div className={styles.welcome}>
        <div>
          <Asterisk size={14} className={styles.orange} aria-hidden /> Welcome to <b>Claude Code</b>!
        </div>
        <div className={styles.dim}>/help for help, /status for your current setup</div>
        <div className={styles.dim}>cwd: /home/visitante/projetos/aleatorio</div>
      </div>

      <UserPrompt text={`leia o ${FILE}`} />

      <Message>
        <b>Read</b>({FILE})
        <div className={styles.dim}>└ Read {CODE.length} lines</div>
      </Message>
      <pre className={styles.code} aria-label={`Conteúdo de ${FILE}`}>
        {CODE.map((line, i) => (
          <div key={i} className={styles.codeLine}>
            <span className={styles.lineNo}>{i + 1}</span>
            <span>{highlight(line)}</span>
          </div>
        ))}
      </pre>

      <Message>{withInlineCode(SUMMARY)}</Message>

      <UserPrompt text={QUESTION} />

      {phase === 'thinking' && (
        <div className={styles.thinking} role="status">
          <Asterisk size={14} className={styles.spin} aria-hidden /> Ruminando…
        </div>
      )}
      {typed > 0 && (
        <Message>
          <div className={styles.answer}>
            {withInlineCode(ANSWER.slice(0, typed))}
            {phase === 'typing' && <span className={styles.caret} aria-hidden />}
          </div>
        </Message>
      )}

      <div className={styles.inputBox} aria-hidden>
        <span className={styles.userMark}>&gt;</span>
        <span className={styles.cursor} />
      </div>
      <div className={styles.dim}>? for shortcuts</div>
    </div>
  );
}
