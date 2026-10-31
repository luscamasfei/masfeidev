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


/*
 * Página /roadmap: o mesmo mapa da home em formato ampliado. As cinco fases da
 * home seguem na mesma ordem e a estrada continua em serpentina com fases
 * ainda não definidas, todas "em construção".
 */
export type RoadmapPageNode = Omit<RoadmapNode, 'position' | 'icon'> & {
  icon: RoadmapIcon | 'lock';
  /** Centro do nó na referência de 1672 × 941 px. */
  position: { x: number; y: number };
};

/**
 * Centros dos nós, em quatro fileiras de cinco: a estrada alterna o sentido a
 * cada fileira e contorna pelas laterais, em serpentina. A fase 08 fica à
 * direita da personagem sentada da arte, para a estrada não cobrir a figura.
 */
const roadmapPagePositions = [
  { x: 190, y: 418 },
  { x: 485, y: 452 },
  { x: 790, y: 428 },
  { x: 1095, y: 462 },
  { x: 1395, y: 434 },
  { x: 1425, y: 618 },
  { x: 1140, y: 646 },
  { x: 915, y: 598 },
  { x: 560, y: 646 },
  { x: 245, y: 612 },
  { x: 215, y: 806 },
  { x: 520, y: 840 },
  { x: 830, y: 802 },
  { x: 1120, y: 838 },
  { x: 1410, y: 808 },
  { x: 1440, y: 992 },
  { x: 1150, y: 1022 },
  { x: 850, y: 988 },
  { x: 545, y: 1022 },
  { x: 240, y: 994 },
];

const futurePhases = roadmapPagePositions.length - roadmapNodes.length;

export const roadmapPageNodes: RoadmapPageNode[] = [
  ...roadmapNodes.map(({ position: _, ...node }): Omit<RoadmapPageNode, 'position'> => node),
  ...Array.from({ length: futurePhases }, (_, i): Omit<RoadmapPageNode, 'position'> => ({
    id: `fase-${String(roadmapNodes.length + i + 1).padStart(2, '0')}`,
    status: 'building',
    icon: 'lock',
  })),
].map((node, i) => ({ ...node, position: roadmapPagePositions[i] }));

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
