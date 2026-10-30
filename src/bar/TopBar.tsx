import { BatteryFull, BatteryLow, BatteryMedium, Bluetooth, Box, Command, EthernetPort, Headphones, MessageSquare, Unplug } from 'lucide-react';
import { useWM } from '../wm/WindowManager';
import { useShell } from '../shell/ShellContext';
import { useBattery, useOnline } from './useSystemStatus';
import { Clock } from './Clock';
import { PowerMenu } from './PowerMenu';
import { Tasks } from './Tasks';
import { Workspaces } from './Workspaces';
import styles from './TopBar.module.css';

/**
 * Recreates the Waybar layout from ~/.config/waybar/config:
 * left  = custom/power + hyprland/workspaces
 * right = tray, bluetooth, network, battery, pulseaudio, clock
 * The window list in the middle is a web addition so minimized windows can be restored.
 */
export function TopBar() {
  const { openApp } = useWM();
  const { setLauncherOpen, setSimpleView } = useShell();
  const online = useOnline();
  const battery = useBattery();
  const BatteryIcon = battery >= 60 ? BatteryFull : battery >= 30 ? BatteryMedium : BatteryLow;

  return (
    <header className={styles.bar} role="banner">
      <nav className={styles.left} aria-label="Sistema">
        <PowerMenu />
        <Workspaces />
      </nav>

      <Tasks />

      <div className={styles.right}>
        <div className={styles.tray} role="toolbar" aria-label="Bandeja">
          <button className={styles.trayItem} onClick={() => openApp('keys')} title="Atalhos de teclado (Alt+H)" aria-label="Abrir atalhos de teclado">
            <MessageSquare size={14} />
          </button>
          <button className={styles.trayItem} onClick={() => setLauncherOpen(true)} title="Lançador (Alt+Espaço)" aria-label="Abrir lançador">
            <Command size={14} />
          </button>
          <button className={styles.trayItem} onClick={() => setSimpleView(true)} title="Visão simples" aria-label="Mudar para a visão simples">
            <Box size={14} />
          </button>
        </div>
        <span className={`${styles.module} ${styles.status} ${styles.accent}`} title="Bluetooth">
          <Bluetooth size={14} aria-label="Bluetooth" />
        </span>
        <span className={`${styles.module} ${styles.status}`} title="Rede">
          {online ? <EthernetPort size={14} className={styles.accent} aria-hidden /> : <Unplug size={14} className={styles.accent} aria-hidden />}
          {online ? 'Ethernet' : 'Disconnected'}
        </span>
        <span className={`${styles.module} ${styles.status}`} title="Bateria">
          <BatteryIcon size={15} className={styles.accent} aria-hidden />
          {battery}%
        </span>
        <span className={`${styles.module} ${styles.status}`} title="Volume">
          <Headphones size={14} className={styles.accent} aria-hidden />
          100%
        </span>
        <Clock />
      </div>
    </header>
  );
}
