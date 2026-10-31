/*
 * Página Sobre. Os textos vêm do README do perfil do GitHub
 * (github.com/luscamasfei); não acrescentar formação, metas ou contatos que
 * não estejam lá.
 */
import { site } from '@/data/site';

export interface Experience {
  /** Área ou cargo, por exemplo "Atendimento ao cliente". */
  title: string;
  /** Período livre, por exemplo "2023 – 2024". */
  period?: string;
  /** Competências desenvolvidas, mostradas em uma linha. */
  skills: string[];
  description: string;
  /** Link opcional; só então o cartão mostra a seta. */
  href?: string;
}

export interface ContactLink {
  label: string;
  icon: 'github' | 'linkedin' | 'mail';
  /** Texto exibido no cartão; `null` mostra "em breve". */
  handle: string | null;
  /** Sem endereço, o cartão aparece sem link. */
  href: string | null;
}

/* E-mail público do perfil do GitHub. LinkedIn ainda sem endereço, por decisão do autor. */
const contacts: ContactLink[] = [
  { label: 'GitHub', icon: 'github', handle: 'github.com/luscamasfei', href: site.github },
  { label: 'LinkedIn', icon: 'linkedin', handle: null, href: null },
  { label: 'E-mail', icon: 'mail', handle: 'luscamasfei@gmail.com', href: 'mailto:luscamasfei@gmail.com' },
];

/*
 * Experiências de trabalho reais, informadas pelo autor; não preencher com
 * suposições. Uma experiência só ocupa a largura toda da seção.
 */
const experiences: Experience[] = [
  {
    title: 'Em busca da primeira oportunidade',
    period: 'Atualmente',
    skills: [],
    description:
      'Estou em busca da minha primeira oportunidade na área de desenvolvimento. Enquanto isso, sigo estudando e construindo projetos pessoais.',
    href: '#contato',
  },
];

export const about = {
  eyebrow: 'Sobre',
  title: 'Sobre',
  description: 'Estudante de Sistemas de Informação na UNISUL e desenvolvedor em formação.',
  intro:
    'Olá! Sou Lucas Maffei, estudante de Sistemas de Informação na UNISUL e desenvolvedor em formação. Atualmente estudo Java e tenho interesse em desenvolvimento de software, Linux e jogos. Busco aprender continuamente e transformar esse aprendizado em prática.',
  /** Palavras do detalhe decorativo ao lado da apresentação. */
  keywords: ['Tecnologia', 'Estudo', 'Projetos', 'Evolução'],
  experiences,
  /*
   * Tecnologias separadas por uso, sem nível de domínio. Fonte: README do
   * perfil do GitHub; HTML, CSS e JavaScript ficam de fora por decisão do autor.
   */
  stacks: [
    {
      title: 'Em uso',
      description: 'Tecnologias que já utilizo em estudos, projetos e no dia a dia.',
      items: ['Java', 'Git', 'GitHub', 'Linux'],
    },
    {
      title: 'Em estudo',
      description: 'Tecnologias que estou aprofundando para evoluir na área.',
      items: ['Python'],
    },
  ],
  contact: {
    title: 'Contato',
    description: 'Vamos conversar? Você pode me encontrar nas plataformas abaixo ou entrar em contato diretamente por e-mail.',
    links: contacts,
  },
} as const;
