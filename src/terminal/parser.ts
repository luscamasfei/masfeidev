export type ParseResult = { ok: true; tokens: string[] } | { ok: false; error: string };

export const MAX_INPUT = 300;

/**
 * Splits a command line into words. Supports single and double quotes and
 * backslash escapes. Nothing is ever evaluated: the first word is looked up
 * in a fixed command table and the rest are plain strings.
 */
export function tokenize(line: string): ParseResult {
  if (line.length > MAX_INPUT) return { ok: false, error: `linha muito longa (máximo ${MAX_INPUT} caracteres)` };

  const tokens: string[] = [];
  let current = '';
  let inToken = false;
  let quote: '"' | "'" | null = null;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === quote) quote = null;
      else if (ch === '\\' && quote === '"' && i + 1 < line.length) current += line[++i];
      else current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      inToken = true;
    } else if (ch === '\\' && i + 1 < line.length) {
      current += line[++i];
      inToken = true;
    } else if (/\s/.test(ch)) {
      if (inToken) tokens.push(current);
      current = '';
      inToken = false;
    } else {
      current += ch;
      inToken = true;
    }
  }

  if (quote) return { ok: false, error: `aspas ${quote} não fechadas` };
  if (inToken) tokens.push(current);
  return { ok: true, tokens };
}
