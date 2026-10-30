import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Folder, House, LayoutGrid, List } from 'lucide-react';
import { dirname, displayPath, HOME, joinPath, splitPath } from '../../fs/path';
import type { VNode } from '../../fs/types';
import { getNode, listDir, typeLabel } from '../../fs/vfs';
import { usePrefs } from '../../prefs/PrefsContext';
import { useShell } from '../../shell/ShellContext';
import { nodeIcon } from '../../ui/nodeIcon';
import { useWM } from '../../wm/WindowManager';
import type { AppComponentProps } from '../registry';
import { useOpener } from '../useOpener';
import styles from './FilesApp.module.css';

const PLACES = [
  { label: 'Pasta pessoal', path: HOME, icon: House },
  ...['Projetos', 'Repositorios', 'Sobre-mim', 'Documentos', 'Contato'].map((name) => ({
    label: name,
    path: `${HOME}/${name}`,
    icon: Folder,
  })),
];

interface History {
  stack: string[];
  index: number;
}

function initialPath(path: string | undefined): string {
  const node = path ? getNode(path) : null;
  return node?.type === 'dir' ? path! : HOME;
}

export default function FilesApp({ windowId, props }: AppComponentProps) {
  const wm = useWM();
  const open = useOpener();
  const { notify } = useShell();
  const { prefs, update } = usePrefs();
  const [history, setHistory] = useState<History>(() => ({ stack: [initialPath(props.path)], index: 0 }));
  const [selected, setSelected] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const path = history.stack[history.index];
  const dir = getNode(path);
  const items = useMemo(() => (dir?.type === 'dir' ? listDir(dir) : []), [dir]);
  const view = prefs.fileView;
  const selectedNode = items.find((n) => n.name === selected) ?? null;

  useEffect(() => {
    wm.setTitle(windowId, `Arquivos: ${displayPath(path)}`);
    setSelected(null);
  }, [path, windowId, wm]);

  const navigate = (target: string) => {
    if (target === path) return;
    setHistory((h) => ({ stack: [...h.stack.slice(0, h.index + 1), target], index: h.index + 1 }));
  };
  const go = (delta: -1 | 1) =>
    setHistory((h) => ({ ...h, index: Math.min(Math.max(h.index + delta, 0), h.stack.length - 1) }));

  const activate = (node: VNode) => {
    const full = joinPath(path, node.name);
    if (node.type === 'dir') return navigate(full);
    const error = open(full);
    if (error) notify(error, 'error');
  };

  const focusItem = (index: number) => {
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[data-item]');
    if (!buttons?.length) return;
    const clamped = Math.min(Math.max(index, 0), buttons.length - 1);
    buttons[clamped].focus();
    setSelected(items[clamped].name);
  };

  const onItemKeyDown = (index: number, node: VNode) => (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        return activate(node);
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        return focusItem(index + 1);
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        return focusItem(index - 1);
      case 'Home':
        e.preventDefault();
        return focusItem(0);
      case 'End':
        e.preventDefault();
        return focusItem(items.length - 1);
      case 'Backspace':
        e.preventDefault();
        if (path !== '/') navigate(dirname(path));
    }
  };

  const crumbs = splitPath(path);

  return (
    <div className={styles.files}>
      <div className={styles.toolbar} role="toolbar" aria-label="Navegação">
        <button className={styles.tool} onClick={() => go(-1)} disabled={history.index === 0} aria-label="Voltar" title="Voltar">
          <ArrowLeft size={15} />
        </button>
        <button
          className={styles.tool}
          onClick={() => go(1)}
          disabled={history.index >= history.stack.length - 1}
          aria-label="Avançar"
          title="Avançar"
        >
          <ArrowRight size={15} />
        </button>
        <button className={styles.tool} onClick={() => navigate(dirname(path))} disabled={path === '/'} aria-label="Pasta acima" title="Pasta acima (Backspace)">
          <ArrowUp size={15} />
        </button>
        <nav className={styles.crumbs} aria-label="Caminho">
          <button className={styles.crumb} onClick={() => navigate('/')}>
            /
          </button>
          {crumbs.map((part, i) => {
            const target = '/' + crumbs.slice(0, i + 1).join('/');
            return (
              <span key={target} className={styles.crumbPart}>
                <button className={styles.crumb} onClick={() => navigate(target)} aria-current={i === crumbs.length - 1 ? 'location' : undefined}>
                  {part}
                </button>
                {i < crumbs.length - 1 && <span className={styles.sep}>/</span>}
              </span>
            );
          })}
        </nav>
        <div className={styles.viewToggle} role="group" aria-label="Modo de exibição">
          <button
            className={styles.tool}
            aria-pressed={view === 'grid'}
            onClick={() => update((p) => ({ ...p, fileView: 'grid' }))}
            aria-label="Grade"
            title="Grade"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            className={styles.tool}
            aria-pressed={view === 'list'}
            onClick={() => update((p) => ({ ...p, fileView: 'list' }))}
            aria-label="Lista"
            title="Lista"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      <div className={styles.main}>
        <nav className={styles.sidebar} aria-label="Locais">
          {PLACES.map((place) => (
            <button
              key={place.path}
              className={place.path === path ? `${styles.place} ${styles.placeActive}` : styles.place}
              onClick={() => navigate(place.path)}
              aria-current={place.path === path ? 'location' : undefined}
            >
              <place.icon size={14} aria-hidden />
              <span>{place.label}</span>
            </button>
          ))}
        </nav>

        <div
          ref={listRef}
          className={view === 'grid' ? styles.grid : styles.list}
          onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}
          aria-label={`Conteúdo de ${displayPath(path)}`}
          role="group"
        >
          {view === 'list' && items.length > 0 && (
            <div className={styles.listHeader} aria-hidden>
              <span>Nome</span>
              <span>Tipo</span>
              <span>Descrição</span>
            </div>
          )}
          {items.length === 0 && <p className={styles.empty}>Pasta vazia</p>}
          {items.map((node, index) => {
            const Icon = nodeIcon(node);
            const isSelected = node.name === selected;
            return (
              <button
                key={node.name}
                data-item
                className={`${view === 'grid' ? styles.tile : styles.row} ${isSelected ? styles.selected : ''}`}
                onClick={(e) => {
                  setSelected(node.name);
                  // Touch devices have no double click: a tap on a selected item opens it.
                  if (e.detail === 0 || (e.nativeEvent as PointerEvent).pointerType === 'touch') activate(node);
                }}
                onDoubleClick={() => activate(node)}
                onKeyDown={onItemKeyDown(index, node)}
                onFocus={() => setSelected(node.name)}
                aria-pressed={isSelected}
                title={node.description}
              >
                <Icon size={view === 'grid' ? 30 : 15} strokeWidth={view === 'grid' ? 1.6 : 2} className={styles.itemIcon} aria-hidden />
                <span className={styles.name}>{node.name}</span>
                {view === 'list' && (
                  <>
                    <span className={styles.meta}>{typeLabel(node)}</span>
                    <span className={styles.meta}>{node.description ?? ''}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.status} aria-live="polite">
        {selectedNode ? (
          <>
            <b>{selectedNode.name}</b> · {typeLabel(selectedNode)}
            {selectedNode.description && <> · {selectedNode.description}</>}
          </>
        ) : (
          <>
            {items.length} {items.length === 1 ? 'item' : 'itens'}
            {dir?.description && <> · {dir.description}</>}
          </>
        )}
      </div>
    </div>
  );
}
