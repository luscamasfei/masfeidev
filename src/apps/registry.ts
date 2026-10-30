import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import {
  Asterisk,
  Disc3,
  FileText,
  FolderOpen,
  Keyboard,
  Mail,
  Package,
  SquareTerminal,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { findProject } from '../content/projects';
import { basename } from '../fs/path';
import type { Size } from '../wm/windowReducer';
import type { AppId, AppProps } from './ids';

export interface AppComponentProps {
  windowId: string;
  props: AppProps;
}

export interface AppDefinition {
  id: AppId;
  name: string;
  description: string;
  icon: LucideIcon;
  size: Size;
  /** Apps are code-split: each one is downloaded the first time it opens. */
  component: LazyExoticComponent<ComponentType<AppComponentProps>>;
  title: (props: AppProps) => string;
  /**
   * Returns a key when opening the same props should focus the existing window
   * instead of creating a new one. `null` allows multiple instances.
   */
  instanceKey: (props: AppProps) => string | null;
  /** Shown in the launcher. Viewers that need a file are opened from elsewhere. */
  launchable: boolean;
}

const single = (id: AppId) => () => id;

export const apps: Record<AppId, AppDefinition> = {
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    description: 'Terminal',
    icon: SquareTerminal,
    size: { w: 720, h: 440 },
    component: lazy(() => import('./terminal/TerminalApp')),
    title: () => 'visitante@portfolio: ~',
    instanceKey: () => null,
    launchable: true,
  },
  files: {
    id: 'files',
    name: 'Arquivos',
    description: 'Gerenciador de arquivos',
    icon: FolderOpen,
    size: { w: 780, h: 480 },
    component: lazy(() => import('./files/FilesApp')),
    title: () => 'Arquivos',
    instanceKey: () => null,
    launchable: true,
  },
  about: {
    id: 'about',
    name: 'Sobre mim',
    description: 'Apresentação pessoal',
    icon: UserRound,
    size: { w: 620, h: 480 },
    component: lazy(() => import('./about/AboutApp')),
    title: () => 'Sobre mim',
    instanceKey: single('about'),
    launchable: true,
  },
  contact: {
    id: 'contact',
    name: 'Contato',
    description: 'Canais de contato',
    icon: Mail,
    size: { w: 480, h: 320 },
    component: lazy(() => import('./contact/ContactApp')),
    title: () => 'Contato',
    instanceKey: single('contact'),
    launchable: true,
  },
  keys: {
    id: 'keys',
    name: 'Atalhos',
    description: 'Atalhos de teclado',
    icon: Keyboard,
    size: { w: 560, h: 460 },
    component: lazy(() => import('./keys/KeysApp')),
    title: () => 'Atalhos de teclado',
    instanceKey: single('keys'),
    launchable: true,
  },
  falsefy: {
    id: 'falsefy',
    name: 'Falsefy',
    description: 'Tocador de música (de mentira)',
    icon: Disc3,
    size: { w: 1000, h: 640 },
    component: lazy(() => import('./falsefy/FalsefyApp')),
    title: () => 'Falsefy',
    instanceKey: single('falsefy'),
    launchable: true,
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    description: 'Conversa com o Claude no terminal',
    icon: Asterisk,
    size: { w: 900, h: 620 },
    component: lazy(() => import('./claude/ClaudeApp')),
    title: () => 'claude: ~/projetos/aleatorio',
    instanceKey: single('claude'),
    launchable: true,
  },
  project: {
    id: 'project',
    name: 'Projeto',
    description: 'Visualizador de projetos',
    icon: Package,
    size: { w: 760, h: 560 },
    component: lazy(() => import('./project/ProjectApp')),
    title: (p) => findProject(p.slug ?? '')?.name ?? 'Projeto',
    instanceKey: (p) => `project:${p.slug}`,
    launchable: false,
  },
  text: {
    id: 'text',
    name: 'Texto',
    description: 'Visualizador de texto',
    icon: FileText,
    size: { w: 620, h: 420 },
    component: lazy(() => import('./text/TextApp')),
    title: (p) => basename(p.path ?? ''),
    instanceKey: (p) => `text:${p.path}`,
    launchable: false,
  },
};
