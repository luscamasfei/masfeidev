import { useEffect, useState } from 'react';

export function useOnline(): boolean {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return online;
}

interface BatteryManager extends EventTarget {
  level: number;
}

/** Real battery level where the Battery Status API exists (Chromium); 100% otherwise. */
export function useBattery(): number {
  const [level, setLevel] = useState(100);
  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> };
    if (!nav.getBattery) return;
    let battery: BatteryManager | null = null;
    let active = true;
    const update = () => battery && setLevel(Math.round(battery.level * 100));
    nav
      .getBattery()
      .then((b) => {
        if (!active) return;
        battery = b;
        update();
        b.addEventListener('levelchange', update);
      })
      .catch(() => undefined);
    return () => {
      active = false;
      battery?.removeEventListener('levelchange', update);
    };
  }, []);
  return level;
}
