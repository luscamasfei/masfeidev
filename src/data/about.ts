/*
 * Página Sobre. Os textos vêm do README do perfil do GitHub
 * (github.com/luscamasfei); não acrescentar formação, metas ou contatos que
 * não estejam lá.
 */
export const about = {
  eyebrow: 'Sobre',
  title: 'Sobre',
  description: 'Estudante de Sistemas de Informação na UNISUL e desenvolvedor em formação.',
  intro: [
    'Olá! Sou Lucas Maffei, estudante de Sistemas de Informação na UNISUL e desenvolvedor em formação.',
    'Atualmente estudo Java e tenho interesse em desenvolvimento de software, Linux e jogos. Busco aprender continuamente e transformar esse aprendizado em prática.',
    'Fora dos estudos, gosto de anime, osu! e correr ao ar livre.',
  ],
  now: [
    { label: 'Estudos', text: 'Java e fundamentos de desenvolvimento de software.' },
    { label: 'Interesses', text: 'Linux, jogos e novas possibilidades com tecnologia.' },
    { label: 'Objetivo', text: 'Consolidar minha base em programação para desenvolver meus próprios projetos.' },
  ],
  technologies: {
    note: 'Java é meu foco atual de estudos. Python também faz parte das tecnologias com que tenho contato. Esta seleção não representa domínio avançado.',
    groups: [
      { label: 'Linguagens', items: ['Java', 'Python'] },
      { label: 'Ferramentas e sistemas', items: ['Git', 'GitHub', 'Linux', 'Arch Linux', 'VS Code'] },
    ],
  },
  quote: 'Pequenos progressos constantes resultam em grandes mudanças.',
} as const;
