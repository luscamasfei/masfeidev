import { contacts, githubProfile } from '../content/contacts';
import { profile } from '../content/profile';
import { projects } from '../content/projects';
import { shortcuts } from '../wm/shortcuts';
import { joinPath, splitPath } from './path';
import type { FileTarget, VDir, VFile, VNode } from './types';

/*
 * The virtual file system is plain data generated from src/content.
 * Nothing here touches a real disk; editing the content files is enough to
 * update the tree, the desktop, the launcher and the file manager.
 */

const dir = (name: string, children: VNode[], description?: string): VDir => ({
  type: 'dir',
  name,
  children,
  description,
});

const file = (name: string, target: FileTarget, description?: string): VFile => ({
  type: 'file',
  name,
  target,
  description,
});

const text = (lines: string[]): FileTarget => ({ kind: 'text', content: lines.join('\n') + '\n' });

const aboutText = text([
  profile.name,
  profile.location,
  '',
  ...profile.bio,
  ...(profile.education?.length ? ['', 'Formação:', ...profile.education.map((e) => `  - ${e}`)] : []),
  ...(profile.goals?.length ? ['', 'Objetivos:', ...profile.goals.map((g) => `  - ${g}`)] : []),
]);

// Left empty on purpose until a real contact channel is chosen.
const contactText: FileTarget = { kind: 'text', content: '' };

/**
 * Items shown loose on the desktop: the main apps followed by every project.
 * They are not a folder of the tree, so the file manager does not list them.
 */
export const desktopEntries: VFile[] = [
  file('Terminal', { kind: 'app', app: 'terminal' }, 'Terminal'),
  file('Arquivos', { kind: 'app', app: 'files' }, 'Gerenciador de arquivos'),
  file('Sobre mim', { kind: 'app', app: 'about' }, `Sobre ${profile.name}`),
  ...projects.map((p) => file(p.name, { kind: 'project', slug: p.slug }, p.summary)),
];

const home: VDir = dir('visitante', [
  dir(
    'Projetos',
    projects.map((p) => file(`${p.slug}.proj`, { kind: 'project', slug: p.slug }, p.summary)),
    'Projetos do portfólio',
  ),
  dir(
    'Repositorios',
    [
      ...projects.map((p) =>
        p.repository.url
          ? file(`${p.slug}.url`, { kind: 'url', url: p.repository.url }, `Repositório de ${p.name}`)
          : file(
              `${p.slug}.txt`,
              text([`O repositório de ${p.name} é privado.`, '', `Detalhes do projeto: ~/Projetos/${p.slug}.proj`]),
              `Repositório de ${p.name} (privado)`,
            ),
      ),
      ...(githubProfile
        ? [file('github-perfil.url', { kind: 'url', url: githubProfile.url }, 'Perfil no GitHub')]
        : []),
    ],
    'Repositórios de código',
  ),
  dir(
    'Sobre-mim',
    [
      file('sobre.txt', aboutText, 'Apresentação'),
      file('tecnologias.txt', text(['Tecnologias que uso:', '', ...profile.technologies.map((t) => `  - ${t}`)]), 'Tecnologias'),
      file('hobbies.txt', text(['Hobbies:', '', ...profile.hobbies.map((h) => `  - ${h}`)]), 'Hobbies'),
    ],
    'Informações pessoais',
  ),
  dir(
    'Documentos',
    [
      file(
        'LEIA-ME.txt',
        text([
          'Este site simula o desktop Linux (Arch + Hyprland + Waybar) que eu uso no dia a dia.',
          '',
          '- Dê dois cliques nos ícones para abri-los (um toque em telas sensíveis ao toque).',
          '- Clique com o botão direito na área de trabalho para ver mais opções.',
          '- O terminal ainda está em construção; digite help para ver o que já existe.',
          '- Prefere uma página comum? Use o botão "Visão simples" no menu ⭘ da barra.',
        ]),
        'Como usar',
      ),
      file('atalhos.txt', text(shortcuts.map((s) => `${s.keys.padEnd(26)} ${s.action}`)), 'Atalhos de teclado'),
    ],
    'Documentos',
  ),
  dir(
    'Contato',
    [
      ...contacts.map((c) => file(`${c.id}.url`, { kind: 'url', url: c.url }, c.label)),
      file('contato.txt', contactText, 'Canais de contato'),
    ],
    'Canais de contato',
  ),
]);

export const root: VDir = dir('', [dir('home', [home])]);

export function getNode(path: string): VNode | null {
  let node: VNode = root;
  for (const part of splitPath(path)) {
    if (node.type !== 'dir') return null;
    const next: VNode | undefined = node.children.find((c) => c.name === part);
    if (!next) return null;
    node = next;
  }
  return node;
}

/** Directory listing with folders first, then files, alphabetically. */
export function listDir(d: VDir): VNode[] {
  return [...d.children].sort((a, b) =>
    a.type !== b.type ? (a.type === 'dir' ? -1 : 1) : a.name.localeCompare(b.name, 'pt-BR'),
  );
}

/** Every file in the tree, with its absolute path (used by the launcher). */
export function allFiles(d: VDir = root, base = '/'): { path: string; node: VFile }[] {
  return d.children.flatMap((child) => {
    const path = joinPath(base, child.name);
    return child.type === 'dir' ? allFiles(child, path) : [{ path, node: child }];
  });
}

export function typeLabel(node: VNode): string {
  if (node.type === 'dir') return 'Pasta';
  switch (node.target.kind) {
    case 'text':
      return 'Texto';
    case 'project':
      return 'Projeto';
    case 'app':
      return 'Aplicativo';
    case 'url':
      return 'Link externo';
  }
}
