import { useEffect, useState } from 'react';
import {
  Clock3,
  Disc3,
  Heart,
  House,
  Library,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';
import styles from './FalsefyApp.module.css';

/*
 * A fake music player in the shape of Spotify with the "Rice / Vermelho"
 * Spicetify colors from the real desktop. Nothing is streamed or played:
 * the progress bar just counts seconds.
 */

interface Track {
  title: string;
  seconds: number;
}

const ARTIST = 'BLACKPINK';
const ALBUM = 'BORN PINK';
const YEAR = 2022;
const TRACKS: Track[] = [
  { title: 'Pink Venom', seconds: 187 },
  { title: 'Shut Down', seconds: 175 },
  { title: 'Typa Girl', seconds: 179 },
  { title: 'Yeah Yeah Yeah', seconds: 178 },
  { title: 'Hard to Love', seconds: 162 },
  { title: 'The Happiest Girl', seconds: 222 },
  { title: 'Tally', seconds: 184 },
  { title: 'Ready for Love', seconds: 184 },
];
const PLAYLISTS = ['Músicas Curtidas', ALBUM, 'THE ALBUM', 'Rice vermelho', 'Para correr'];

const time = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const totalMinutes = Math.round(TRACKS.reduce((sum, t) => sum + t.seconds, 0) / 60);

function Cover({ size }: { size: 'small' | 'large' }) {
  return (
    <div className={`${styles.cover} ${size === 'large' ? styles.coverLarge : styles.coverSmall}`} aria-hidden>
      <span>{ALBUM}</span>
    </div>
  );
}

function Equalizer({ playing }: { playing: boolean }) {
  return (
    <span className={`${styles.eq} ${playing ? '' : styles.eqPaused}`} aria-hidden>
      <span />
      <span />
      <span />
    </span>
  );
}

export default function FalsefyApp() {
  const [current, setCurrent] = useState(1);
  const [position, setPosition] = useState(42);
  const [playing, setPlaying] = useState(true);
  const [liked, setLiked] = useState(true);
  const track = TRACKS[current];

  const go = (index: number) => {
    setCurrent((index + TRACKS.length) % TRACKS.length);
    setPosition(0);
  };

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setPosition((p) => p + 1), 1000);
    return () => window.clearInterval(timer);
  }, [playing]);

  // End of the "song": move on to the next one, like a real player would.
  useEffect(() => {
    if (position >= track.seconds) go(current + 1);
  }, [position, track.seconds, current]);

  const progress = Math.min(position / track.seconds, 1);

  return (
    <div className={styles.app}>
      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <nav className={styles.card} aria-label="Navegação do Falsefy">
            <span className={`${styles.navItem} ${styles.navActive}`}>
              <House size={20} aria-hidden /> Início
            </span>
            <span className={styles.navItem}>
              <Search size={20} aria-hidden /> Buscar
            </span>
          </nav>
          <div className={`${styles.card} ${styles.library}`}>
            <div className={styles.navItem}>
              <Library size={20} aria-hidden /> Sua Biblioteca
            </div>
            <ul className={styles.playlists}>
              {PLAYLISTS.map((name) => (
                <li key={name} className={name === ALBUM ? styles.playlistActive : undefined}>
                  <span className={styles.playlistIcon}>
                    {name === ALBUM ? <Cover size="small" /> : name === 'Músicas Curtidas' ? <Heart size={16} /> : <ListMusic size={16} />}
                  </span>
                  <span>
                    <span className={styles.playlistName}>{name}</span>
                    <span className={styles.muted}>{name === ALBUM || name === 'THE ALBUM' ? `Álbum • ${ARTIST}` : 'Playlist • luscamasfei'}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className={`${styles.card} ${styles.main}`}>
          <header className={styles.hero}>
            <Cover size="large" />
            <div className={styles.heroText}>
              <span className={styles.kicker}>Álbum</span>
              <h2 className={styles.albumTitle}>{ALBUM}</h2>
              <span className={styles.muted}>
                <b className={styles.artist}>{ARTIST}</b> • {YEAR} • {TRACKS.length} músicas, {totalMinutes} min
              </span>
            </div>
          </header>

          <div className={styles.actions}>
            <button className={styles.bigPlay} onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pausar' : 'Tocar'}>
              {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
            </button>
            <Shuffle size={22} className={styles.muted} aria-hidden />
            <button className={styles.iconButton} onClick={() => setLiked((l) => !l)} aria-pressed={liked} aria-label="Curtir álbum">
              <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
            </button>
          </div>

          <ol className={styles.tracks}>
            <li className={`${styles.trackRow} ${styles.trackHead}`} aria-hidden>
              <span>#</span>
              <span>Título</span>
              <Clock3 size={14} />
            </li>
            {TRACKS.map((t, i) => {
              const active = i === current;
              return (
                <li key={t.title}>
                  <button
                    className={`${styles.trackRow} ${active ? styles.trackActive : ''}`}
                    onClick={() => {
                      if (active) setPlaying((p) => !p);
                      else {
                        go(i);
                        setPlaying(true);
                      }
                    }}
                    aria-current={active ? 'true' : undefined}
                  >
                    <span className={styles.trackNumber}>{active ? <Equalizer playing={playing} /> : i + 1}</span>
                    <span className={styles.trackTitle}>
                      <span>{t.title}</span>
                      <span className={styles.muted}>{ARTIST}</span>
                    </span>
                    <span className={styles.muted}>{time(t.seconds)}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </main>
      </div>

      <footer className={styles.player} aria-label="Tocando agora">
        <div className={styles.nowPlaying}>
          <Cover size="small" />
          <span className={styles.nowText}>
            <span className={styles.nowTitle}>{track.title}</span>
            <span className={styles.muted}>{ARTIST}</span>
          </span>
          <Heart size={16} className={styles.accent} fill="currentColor" aria-hidden />
        </div>

        <div className={styles.controls}>
          <div className={styles.buttons}>
            <Shuffle size={16} className={styles.accent} aria-hidden />
            <button className={styles.iconButton} onClick={() => go(position > 3 ? current : current - 1)} aria-label="Anterior">
              <SkipBack size={18} fill="currentColor" />
            </button>
            <button className={styles.playButton} onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pausar' : 'Tocar'}>
              {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            </button>
            <button className={styles.iconButton} onClick={() => go(current + 1)} aria-label="Próxima">
              <SkipForward size={18} fill="currentColor" />
            </button>
            <Repeat size={16} className={styles.muted} aria-hidden />
          </div>
          <div className={styles.progressRow}>
            <span className={styles.time}>{time(position)}</span>
            <div
              className={styles.bar}
              role="slider"
              aria-label="Posição da música"
              aria-valuemin={0}
              aria-valuemax={track.seconds}
              aria-valuenow={position}
              aria-valuetext={`${time(position)} de ${time(track.seconds)}`}
              tabIndex={0}
              onPointerDown={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setPosition(Math.floor(((e.clientX - r.left) / r.width) * track.seconds));
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') setPosition((p) => Math.min(p + 5, track.seconds - 1));
                if (e.key === 'ArrowLeft') setPosition((p) => Math.max(p - 5, 0));
              }}
            >
              <div className={styles.barFill} style={{ width: `${progress * 100}%` }} />
            </div>
            <span className={styles.time}>{time(track.seconds)}</span>
          </div>
        </div>

        <div className={styles.extra}>
          <Disc3 size={16} className={styles.muted} aria-hidden />
          <Volume2 size={16} className={styles.muted} aria-hidden />
          <div className={styles.volume} aria-hidden>
            <div className={styles.barFill} style={{ width: '70%' }} />
          </div>
        </div>
      </footer>
    </div>
  );
}
