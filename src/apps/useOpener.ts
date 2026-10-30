import { useCallback } from 'react';
import type { VFile } from '../fs/types';
import { getNode } from '../fs/vfs';
import { openExternal } from '../lib/links';
import { usePrefs } from '../prefs/PrefsContext';
import { useShell } from '../shell/ShellContext';
import { useWM } from '../wm/WindowManager';

/**
 * Opens a virtual path, or a desktop item that lives outside the tree, with the
 * right app. Used by the desktop, the file manager and the launcher.
 * Returns an error message, or null on success.
 */
export function useOpener() {
  const { openApp } = useWM();
  const { addRecent } = usePrefs();
  const { notify } = useShell();

  return useCallback(
    (target: string | VFile): string | null => {
      const node = typeof target === 'string' ? getNode(target) : target;
      if (!node) return `${target}: arquivo ou diretório não encontrado`;

      if (node.type === 'dir') {
        openApp('files', { path: target as string });
        return null;
      }

      if (typeof target === 'string') addRecent(target);
      const file = node.target;
      switch (file.kind) {
        case 'text':
          // Text files are only reachable through the tree, so `target` is a path.
          openApp('text', { path: target as string });
          break;
        case 'project':
          openApp('project', { slug: file.slug });
          break;
        case 'app':
          openApp(file.app);
          break;
        case 'url':
          if (!openExternal(file.url)) return `${node.name}: link inválido`;
          notify('Link aberto em uma nova aba');
          break;
      }
      return null;
    },
    [openApp, addRecent, notify],
  );
}
