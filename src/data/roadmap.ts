/*
 * Roadmap da página inicial.
 *
 * Cada fase é um nó do mapa; `connections` liga os nós e aceita ramificações
 * (um nó pode ter várias saídas). As posições usam o plano do mapa desktop,
 * de 1017 × 204 unidades, medido na referência. No mobile o mapa vira um
 * caminho vertical que segue a ordem de `nodes`.
 */

export type RoadmapStatus = 'in-progress' | 'building';

export type RoadmapIcon = 'java' | 'code' | 'database' | 'cube' | 'brain';

export interface RoadmapLink {
  title: string;
  href: string;
}

export interface RoadmapDetails {
  description: string;
  topics: string[];
  projects: RoadmapLink[];
  articles: RoadmapLink[];
}

export interface RoadmapNode {
  id: string;
  /** Nome da fase. Fases ainda não definidas ficam sem nome. */
  title?: string;
  status: RoadmapStatus;
  icon: RoadmapIcon;
  position: { x: number; y: number };
  /** Conteúdo do painel; só fases com detalhes podem ser abertas. */
  details?: RoadmapDetails;
}

export interface RoadmapConnection {
  from: string;
  to: string;
  /** Curvatura vertical do trecho; negativo sobe, positivo desce. */
  bend?: number;
}

export const roadmapStatusLabel: Record<RoadmapStatus, string> = {
  'in-progress': 'Em andamento',
  building: 'Em construção',
};

export const roadmapIntro = {
  eyebrow: 'Roadmap',
  title: ['Minha', 'Jornada'],
  description:
    'Um mapa da minha evolução como desenvolvedor. Tecnologias, conceitos e projetos ao longo do tempo.',
} as const;

export const roadmapNodes: RoadmapNode[] = [
  {
    id: 'java',
    title: 'Java',
    status: 'in-progress',
    icon: 'java',
    position: { x: 60, y: 68 },
    details: {
      description: 'Primeira fase da jornada: os fundamentos da linguagem Java.',
      topics: [
        'Tipos primitivos',
        'Operadores',
        'Estruturas condicionais (if e switch)',
        'Estruturas de repetição (for)',
      ],
      projects: [
        { title: 'Sistema de Contas a Pagar', href: '/projetos/contas-a-pagar/' },
        { title: 'Maratona Java (estudos)', href: 'https://github.com/luscamasfei/maratona-java' },
      ],
      // Preencher com os logs na Etapa 5.
      articles: [],
    },
  },
  { id: 'fase-02', status: 'building', icon: 'code', position: { x: 278, y: 76 } },
  { id: 'fase-03', status: 'building', icon: 'database', position: { x: 498, y: 83 } },
  { id: 'fase-04', status: 'building', icon: 'cube', position: { x: 717, y: 91 } },
  { id: 'fase-05', status: 'building', icon: 'brain', position: { x: 936, y: 93 } },
];

export const roadmapConnections: RoadmapConnection[] = [
  { from: 'java', to: 'fase-02', bend: -34 },
  { from: 'fase-02', to: 'fase-03', bend: 4 },
  { from: 'fase-03', to: 'fase-04', bend: 2 },
  { from: 'fase-04', to: 'fase-05', bend: 16 },
];


/** Visualização expandida; não altera o conteúdo nem as posições do mini-roadmap. */
export interface RoadmapPageStage {
  id: string;
  number: string;
  title: string;
  status: RoadmapStatus;
  icon: RoadmapIcon | 'briefcase';
  summary: string;
  active: boolean;
  /** Centro do nó na referência de 1672 × 941 px. */
  position: { x: number; y: number };
}

export const roadmapPage = {
  title: 'Roadmap',
  subtitle: 'Meu caminho como desenvolvedor',
  description:
    'Este roadmap representa a minha evolução como desenvolvedor. Aqui organizo meus estudos, projetos e objetivos de forma visual, para manter o foco e acompanhar o progresso em direção aos meus objetivos na área de tecnologia.',
  quote: ['Disciplina hoje,', 'liberdade amanhã.'],
  verbs: ['Planejar', 'Estudar', 'Construir', 'Evoluir'],
  notes: [
    ['Mesmos lugares.', 'Pessoas diferentes.', 'Novos objetivos.'],
    ['Um passo de cada vez', 'também é progresso.'],
  ],
} as const;

export const roadmapPageStages: RoadmapPageStage[] = [
  {
    id: 'java', number: '01', title: 'Java', status: 'in-progress', icon: 'java', active: true,
    summary: 'Aprendendo os fundamentos do Java e desenvolvendo habilidades de programação sólida e orientada a objetos.',
    position: { x: 188, y: 411 },
  },
  {
    id: 'fundamentos', number: '02', title: 'Fundamentos', status: 'building', icon: 'code', active: false,
    summary: 'Aprofundando os conceitos de ciência da computação, estruturas de dados, lógica e boas práticas.',
    position: { x: 483, y: 438 },
  },
  {
    id: 'banco-de-dados', number: '03', title: 'Banco de Dados', status: 'building', icon: 'database', active: false,
    summary: 'Estudando modelagem de dados, SQL e bancos como PostgreSQL, aprendendo a projetar soluções reais.',
    position: { x: 820, y: 445 },
  },
  {
    id: 'projetos', number: '04', title: 'Projetos', status: 'building', icon: 'cube', active: false,
    summary: 'Desenvolvendo projetos práticos para aplicar os conhecimentos e construir um portfólio consistente.',
    position: { x: 1117, y: 491 },
  },
  {
    id: 'carreira', number: '05', title: 'Carreira', status: 'building', icon: 'briefcase', active: false,
    summary: 'Conquistando minha primeira oportunidade na área de TI e evoluindo continuamente na minha carreira.',
    position: { x: 1467, y: 456 },
  },
];
