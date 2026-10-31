/*
 * Página Sobre. Os textos vêm do README do perfil do GitHub
 * (github.com/luscamasfei); não acrescentar formação, metas ou contatos que
 * não estejam lá.
 */
export const about = {
  eyebrow: 'Sobre',
  title: 'Sobre',
  description: 'Estudante de Sistemas de Informação na UNISUL e desenvolvedor em formação.',
  intro:
    'Olá! Sou Lucas Maffei, estudante de Sistemas de Informação na UNISUL e desenvolvedor em formação. Atualmente estudo Java e tenho interesse em desenvolvimento de software, Linux e jogos. Busco aprender continuamente e transformar esse aprendizado em prática.',
  /** Palavras do detalhe decorativo ao lado da apresentação. */
  keywords: ['Tecnologia', 'Estudo', 'Projetos', 'Evolução'],
  technologies: {
    note: 'Java é meu foco atual de estudos. Python também faz parte das tecnologias com que tenho contato. Esta seleção não representa domínio avançado.',
    groups: [
      { label: 'Linguagens', items: ['Java', 'Python'] },
      { label: 'Ferramentas e sistemas', items: ['Git', 'GitHub', 'Linux', 'Arch Linux', 'VS Code'] },
    ],
  },
} as const;
