/**
 * Keyboard shortcuts, listed once so the help window, the `atalhos.txt` file and
 * the key handler stay in sync. Hyprland uses Super, which browsers rarely receive,
 * so Alt plays that role here (Super is also accepted where the browser allows it).
 */
export interface ShortcutInfo {
  keys: string;
  action: string;
}

export const shortcuts: ShortcutInfo[] = [
  { keys: 'Alt + Espaço', action: 'Abrir o lançador de aplicativos' },
  { keys: 'Alt + Enter', action: 'Abrir um terminal' },
  { keys: 'Alt + E', action: 'Abrir o gerenciador de arquivos' },
  { keys: 'Alt + Q', action: 'Fechar a janela em foco' },
  { keys: 'Alt + F', action: 'Maximizar ou restaurar a janela em foco' },
  { keys: 'Alt + M', action: 'Minimizar a janela em foco' },
  { keys: 'Alt + J ou K', action: 'Alternar entre as janelas abertas' },
  { keys: 'Alt + H', action: 'Mostrar esta lista de atalhos' },
  { keys: 'Ctrl + Alt + 1…4', action: 'Ir para a área de trabalho 1 a 4' },
  { keys: 'Ctrl + Alt + Shift + 1…4', action: 'Mover a janela em foco para outra área' },
  { keys: 'Alt + arrastar', action: 'Mover uma janela segurando em qualquer ponto' },
  { keys: 'Esc', action: 'Fechar menus e o lançador' },
];

export const WORKSPACES = [1, 2, 3, 4] as const;
