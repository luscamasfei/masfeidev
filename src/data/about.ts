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
  technologies: {
    note: 'Java é meu foco atual de estudos. Python também faz parte das tecnologias com que tenho contato. Esta seleção não representa domínio avançado.',
    groups: [
      { label: 'Linguagens', items: ['Java', 'Python'] },
      { label: 'Ferramentas e sistemas', items: ['Git', 'GitHub', 'Linux', 'Arch Linux', 'VS Code'] },
    ],
  },
} as const;
