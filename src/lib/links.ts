/** Returns the URL only when it uses an allowed protocol; otherwise null. */
export function safeExternalUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'mailto:' ? parsed.href : null;
  } catch {
    return null;
  }
}

/** Opens an external link in a new tab without giving it access to this page. */
export function openExternal(url: string): boolean {
  const safe = safeExternalUrl(url);
  if (!safe) return false;
  window.open(safe, '_blank', 'noopener,noreferrer');
  return true;
}

/** Props for <a> elements pointing outside the portfolio. */
export const externalLinkProps = { target: '_blank', rel: 'noopener noreferrer' } as const;
