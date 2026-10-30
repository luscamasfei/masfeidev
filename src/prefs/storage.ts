/**
 * Local preferences. Everything here is optional: invalid, outdated or missing data
 * falls back to defaults, and a blocked localStorage only disables persistence.
 * No personal data about the visitor is stored.
 */
export interface Point {
  x: number;
  y: number;
}

export interface Prefs {
  version: 1;
  /** Desktop icon positions keyed by file name; absent means "automatic". */
  iconPositions: Record<string, Point>;
  wallpaper: 'image' | 'solid';
  /** Recently opened paths, most recent first. */
  recent: string[];
  fileView: 'list' | 'grid';
}

const KEY = 'portfolio-desktop:prefs';
export const MAX_RECENT = 8;

export const defaultPrefs: Prefs = {
  version: 1,
  iconPositions: {},
  wallpaper: 'image',
  recent: [],
  fileView: 'grid',
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isCoord = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && Math.abs(v) < 100_000;

/** Keeps only the fields that pass validation; works for any older or foreign shape. */
export function sanitizePrefs(raw: unknown): Prefs {
  const prefs: Prefs = { ...defaultPrefs, iconPositions: {}, recent: [] };
  if (!isRecord(raw)) return prefs;

  if (isRecord(raw.iconPositions)) {
    for (const [name, pos] of Object.entries(raw.iconPositions)) {
      if (isRecord(pos) && isCoord(pos.x) && isCoord(pos.y)) prefs.iconPositions[name] = { x: pos.x, y: pos.y };
    }
  }
  if (raw.wallpaper === 'image' || raw.wallpaper === 'solid') prefs.wallpaper = raw.wallpaper;
  if (Array.isArray(raw.recent)) {
    prefs.recent = raw.recent
      .filter((p): p is string => typeof p === 'string' && p.startsWith('/') && p.length < 256)
      .slice(0, MAX_RECENT);
  }
  if (raw.fileView === 'list' || raw.fileView === 'grid') prefs.fileView = raw.fileView;
  return prefs;
}

export function loadPrefs(): Prefs {
  try {
    const stored = window.localStorage.getItem(KEY);
    return stored ? sanitizePrefs(JSON.parse(stored)) : sanitizePrefs(null);
  } catch {
    return sanitizePrefs(null);
  }
}

export function savePrefs(prefs: Prefs): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    // Storage unavailable (private mode, quota, disabled): keep working without it.
  }
}

export function clearPrefs(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}
