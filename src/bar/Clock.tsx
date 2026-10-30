import { useEffect, useRef, useState } from 'react';
import styles from './TopBar.module.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const pad = (n: number) => String(n).padStart(2, '0');

/** Same pattern as Waybar's `{:%a %d/%m/%Y ~ %H:%M}`. */
export function formatClock(d: Date): string {
  return `${WEEKDAYS[d.getDay()]} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ~ ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function useNow(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer = 0;
    // Wake up exactly at the next minute instead of polling every second.
    const schedule = () => {
      const current = new Date();
      timer = window.setTimeout(() => {
        setNow(new Date());
        schedule();
      }, 60_000 - current.getSeconds() * 1000 - current.getMilliseconds() + 20);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);
  return now;
}

export function Clock() {
  const now = useNow();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('pointerdown', close, true);
    window.addEventListener('keydown', close);
    return () => {
      window.removeEventListener('pointerdown', close, true);
      window.removeEventListener('keydown', close);
    };
  }, [open]);

  return (
    <div className={styles.clockWrap} ref={ref}>
      <button
        className={`${styles.module} ${styles.clock}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Relógio: ${now.toLocaleString('pt-BR')}. Abrir calendário`}
      >
        <time dateTime={now.toISOString()}>{formatClock(now)}</time>
      </button>
      {open && <Calendar today={now} />}
    </div>
  );
}

function Calendar({ today }: { today: Date }) {
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className={styles.calendar} role="dialog" aria-label="Calendário">
      <div className={styles.calMonth}>
        {MONTHS[month]} {year}
      </div>
      <div className={styles.calGrid}>
        {WEEKDAYS.map((d) => (
          <span key={d} className={styles.calWeekday}>
            {d.slice(0, 2)}
          </span>
        ))}
        {cells.map((day, i) => (
          <span key={i} className={day === today.getDate() ? styles.calToday : styles.calDay} aria-current={day === today.getDate() ? 'date' : undefined}>
            {day ?? ''}
          </span>
        ))}
      </div>
    </div>
  );
}
