import type { ReactNode } from 'react';
import t from './terminal.module.css';

export interface CommandResult {
  output?: ReactNode;
  error?: boolean;
}

/**
 * A terminal command. To add one, create an entry in `commands` below: it is
 * listed by `help` and picked up by Tab completion automatically. Commands only
 * return output to print; nothing typed by the visitor is ever evaluated.
 */
export interface Command {
  usage: string;
  summary: string;
  run: (args: string[]) => CommandResult | void;
}

export const commands: Record<string, Command> = {
  help: {
    usage: 'help',
    summary: 'mostra os comandos disponíveis',
    run: () => ({
      output: (
        <div>
          <div>Comandos disponíveis:</div>
          <div className={t.table}>
            {Object.entries(commands).map(([name, c]) => (
              <div key={name} className={t.row}>
                <span className={t.accent}>{c.usage}</span>
                <span className={t.muted}>{c.summary}</span>
              </div>
            ))}
          </div>
          <div className={t.muted}>Mais comandos em breve.</div>
        </div>
      ),
    }),
  },
};

export const commandNames = Object.keys(commands);

/** Runs one already-tokenized command line. */
export function execute(tokens: string[]): CommandResult | void {
  const [name, ...args] = tokens;
  const command = Object.hasOwn(commands, name) ? commands[name] : undefined;
  if (command) return command.run(args);
  return { output: `${name}: comando não encontrado. Digite "help" para ver os comandos disponíveis.`, error: true };
}
