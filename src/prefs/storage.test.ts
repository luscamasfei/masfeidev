import { describe, expect, it } from 'vitest';
import { defaultPrefs, MAX_RECENT, sanitizePrefs } from './storage';

describe('sanitizePrefs', () => {
  it('returns defaults for missing or malformed data', () => {
    expect(sanitizePrefs(null)).toEqual(defaultPrefs);
    expect(sanitizePrefs('garbage')).toEqual(defaultPrefs);
    expect(sanitizePrefs([1, 2])).toEqual(defaultPrefs);
  });

  it('keeps valid fields and drops invalid ones', () => {
    const prefs = sanitizePrefs({
      version: 0,
      iconPositions: { a: { x: 10, y: 20 }, b: { x: 'no', y: 1 }, c: { x: Infinity, y: 0 }, d: null },
      wallpaper: 'neon',
      recent: ['/home/visitante/x', 42, 'relative', ...Array(20).fill('/p')],
      fileView: 'list',
      unknown: 'ignored',
    });
    expect(prefs.iconPositions).toEqual({ a: { x: 10, y: 20 } });
    expect(prefs.wallpaper).toBe('image');
    expect(prefs.recent[0]).toBe('/home/visitante/x');
    expect(prefs.recent).toHaveLength(MAX_RECENT);
    expect(prefs.fileView).toBe('list');
    expect(prefs).not.toHaveProperty('unknown');
  });
});
