/** Simplified Arch Linux mark, standing in for the Nerd Font glyph used in the Starship prompt. */
export function ArchLogo({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 1.5c-.9 2.3-1.5 3.8-2.5 5.9.6.6 1.4 1.4 2.6 2.2-1.3-.5-2.2-1.1-2.9-1.7C7.8 10.6 5.8 14.5 1.5 22.5c3.3-1.9 5.9-3.1 8.3-3.5-.1-.4-.2-.9-.2-1.4v-.1c.1-2.1 1.2-3.7 2.4-3.6 1.3.1 2.2 1.9 2.2 4 0 .4-.1.8-.2 1.1 2.4.5 5 1.7 8.3 3.5-.7-1.2-1.3-2.3-1.8-3.4-.9-.7-1.8-1.6-3.7-2.5 1.3.3 2.2.7 3 1.1C16.6 13.1 14.9 9 12 1.5Z" />
    </svg>
  );
}
