export const site = {
  name: 'Lucas Maffei',
  title: 'Lucas Maffei · Portfólio',
  description:
    'Portfólio e logs de Lucas Maffei, estudante de Sistemas de Informação documentando a jornada no desenvolvimento de software.',
  locale: 'pt-BR',
  github: 'https://github.com/luscamasfei',
} as const;

export interface NavItem {
  label: string;
  href: string;
  /** Path prefix that marks the item as current; omit for exact matches. */
  match?: string;
}

export const nav: NavItem[] = [
  { label: 'Início', href: '/' },
  { label: 'Roadmap', href: '/#roadmap' },
  { label: 'Projetos', href: '/projetos/', match: '/projetos' },
  { label: 'Blog', href: '/blog/', match: '/blog' },
  { label: 'Sobre', href: '/sobre/', match: '/sobre' },
];
