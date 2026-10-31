/*
 * Página Sobre. Os textos vêm do README do perfil do GitHub
 * (github.com/luscamasfei); não acrescentar formação, metas ou contatos que
 * não estejam lá.
 */
export interface Experience {
  /** Área ou cargo, por exemplo "Atendimento ao cliente". */
  title: string | null;
  /** Período livre, por exemplo "2023 – 2024". */
  period: string | null;
  /** Competências desenvolvidas, mostradas em uma linha. */
  skills: string[];
  description: string | null;
  /** Link opcional (empresa, certificado); só então o cartão mostra a seta. */
  href?: string;
}

/*
 * Experiências de trabalho reais, preenchidas pelo autor. Campo `null`
 * aparece na página como "a confirmar"; não preencher com suposições.
 */
const experiences: Experience[] = [
  { title: null, period: null, skills: [], description: null },
  { title: null, period: null, skills: [], description: null },
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
} as const;
