/**
 * Guarda em `--anchor-x` a distância entre a borda do contêiner do painel e o
 * lado direito do nó que o abriu. Na home a estrada rola por baixo do painel,
 * então o CSS usa esse valor para manter o painel junto do nó.
 */
export function anchorPanel(panel: HTMLElement, trigger: HTMLElement) {
  const parent = panel.offsetParent;
  if (!parent) return;
  const node = trigger.getBoundingClientRect();
  const box = parent.getBoundingClientRect();
  panel.style.setProperty('--anchor-x', `${node.right - box.left}px`);
}
