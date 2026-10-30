import { TopBar } from './bar/TopBar';
import { Desktop } from './desktop/Desktop';
import { Wallpaper } from './desktop/Wallpaper';
import { Launcher } from './launcher/Launcher';
import { PrefsProvider } from './prefs/PrefsContext';
import { ShellProvider, useShell } from './shell/ShellContext';
import { SimpleView } from './simple/SimpleView';
import { ErrorBoundary } from './ui/ErrorBoundary';
import { useGlobalShortcuts } from './wm/useGlobalShortcuts';
import { WindowLayer } from './wm/WindowLayer';
import { WindowManagerProvider } from './wm/WindowManager';
import { WorkspaceStage } from './wm/WorkspaceStage';
import styles from './App.module.css';

function Shell() {
  const { simpleView, setSimpleView, launcherOpen } = useShell();
  useGlobalShortcuts(!simpleView);

  if (simpleView) return <SimpleView />;

  return (
    <div className={styles.screen}>
      <button className={styles.skipToSimple} onClick={() => setSimpleView(true)}>
        Ir para a versão em página simples
      </button>
      <Wallpaper />
      <TopBar />
      <main className={styles.workspace} aria-label="Desktop">
        <WorkspaceStage>
          <Desktop />
          <WindowLayer />
        </WorkspaceStage>
      </main>
      {launcherOpen && <Launcher />}
    </div>
  );
}

function Crash() {
  return (
    <div className={styles.crash} role="alert">
      <p>Algo deu errado ao carregar o desktop.</p>
      <p>
        <a href="?view=simple">Abrir a versão simples</a> ou <a href="./">recarregar</a>.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary fallback={() => <Crash />}>
      <PrefsProvider>
        <ShellProvider>
          <WindowManagerProvider>
            <Shell />
          </WindowManagerProvider>
        </ShellProvider>
      </PrefsProvider>
    </ErrorBoundary>
  );
}
