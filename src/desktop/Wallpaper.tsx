import { usePrefs } from '../prefs/PrefsContext';
import styles from './Wallpaper.module.css';

const base = import.meta.env.BASE_URL;

/**
 * The real wallpaper (~/Pictures/Wallpapers/Haunted Eyes in the Dark.png), re-encoded to AVIF/WebP.
 * A <picture> lets the browser pick the format and size it supports; the solid
 * variant is a fallback built from the same palette.
 */
export function Wallpaper() {
  const { prefs } = usePrefs();
  if (prefs.wallpaper === 'solid') return <div className={`${styles.wallpaper} ${styles.solid}`} aria-hidden />;

  return (
    <picture className={styles.wallpaper} aria-hidden>
      <source type="image/avif" srcSet={`${base}wallpaper/wallpaper-full.avif`} media="(min-width: 1000px)" />
      <source type="image/webp" srcSet={`${base}wallpaper/wallpaper-full.webp`} media="(min-width: 1000px)" />
      <img src={`${base}wallpaper/wallpaper-1280.webp`} alt="" className={styles.image} decoding="async" fetchPriority="high" draggable={false} />
    </picture>
  );
}
