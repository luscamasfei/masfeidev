export interface Completion {
  /** New input line (unchanged when nothing could be completed). */
  line: string;
  /** Candidates to show when the completion is ambiguous. */
  options: string[];
}

function commonPrefix(words: string[]): string {
  let prefix = words[0] ?? '';
  for (const w of words) while (!w.startsWith(prefix)) prefix = prefix.slice(0, -1);
  return prefix;
}

/** Tab completion of the command name (the first word). */
export function complete(line: string, commandNames: string[]): Completion {
  const word = line.trimStart();
  if (/\s/.test(word)) return { line, options: [] };
  const matches = commandNames.filter((c) => c.startsWith(word)).sort();
  if (matches.length === 0) return { line, options: [] };
  if (matches.length === 1) return { line: matches[0] + ' ', options: [] };
  return { line: commonPrefix(matches), options: matches };
}
