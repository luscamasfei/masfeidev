export const HOME = '/home/visitante';

export function splitPath(path: string): string[] {
  return path.split('/').filter(Boolean);
}

export function joinPath(dir: string, name: string): string {
  return dir === '/' ? `/${name}` : `${dir}/${name}`;
}

export function dirname(path: string): string {
  const parts = splitPath(path);
  parts.pop();
  return '/' + parts.join('/');
}

export function basename(path: string): string {
  const parts = splitPath(path);
  return parts[parts.length - 1] ?? '/';
}

/** Replaces the home directory prefix with `~`, like a shell prompt. */
export function displayPath(path: string): string {
  if (path === HOME) return '~';
  if (path.startsWith(HOME + '/')) return '~' + path.slice(HOME.length);
  return path;
}
