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
      // Preencher com os conteúdos estudados, os projetos (Etapa 4) e os logs (Etapa 5).
      topics: [],
      projects: [],
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
