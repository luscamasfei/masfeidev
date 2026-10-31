/*
 * Fases da jornada, na ordem da estrada. A home e a página /roadmap leem esta
 * mesma lista; cada uma gera a geometria da própria estrada a partir da
 * quantidade de fases. Para acrescentar uma fase, basta incluí-la aqui.
 */

export type RoadmapStatus = 'in-progress' | 'building';

/** `lock` marca fases ainda não definidas. */
export type RoadmapIcon = 'java' | 'code' | 'database' | 'cube' | 'brain' | 'lock';

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
  /** Conteúdo do painel; só fases com detalhes podem ser abertas. */
  details?: RoadmapDetails;
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
  { id: 'fase-02', status: 'building', icon: 'code' },
  { id: 'fase-03', status: 'building', icon: 'database' },
  { id: 'fase-04', status: 'building', icon: 'cube' },
  { id: 'fase-05', status: 'building', icon: 'brain' },
  // Fases 06–20: ainda não definidas, apenas marcadores "em construção".
  ...Array.from({ length: 15 }, (_, i): RoadmapNode => ({
    id: `fase-${String(i + 6).padStart(2, '0')}`,
    status: 'building',
    icon: 'lock',
  })),
];

/*
 * Página /roadmap: as mesmas fases numa serpentina de fileiras de cinco.
 * Centros na referência de 1672 × 941 px. As quatro primeiras fileiras foram
 * ajustadas à arte (a fase 08 fica à direita da personagem sentada); fases
 * além da 20 repetem o desenho das fileiras 3 e 4, mais abaixo.
 */
export type RoadmapPageNode = RoadmapNode & { position: { x: number; y: number } };

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

const pagePosition = (i: number) => {
  if (i < roadmapPagePositions.length) return roadmapPagePositions[i];
  const extra = i - roadmapPagePositions.length;
  const base = roadmapPagePositions[10 + (extra % 10)];
  return { x: base.x, y: base.y + 388 * (Math.floor(extra / 10) + 1) };
};

export const roadmapPageNodes: RoadmapPageNode[] = roadmapNodes.map((node, i) => ({ ...node, position: pagePosition(i) }));

export const roadmapPage = {
  title: 'Roadmap',
  subtitle: 'Meu caminho como desenvolvedor',
  description:
    'Este roadmap representa a minha evolução como desenvolvedor. Aqui organizo meus estudos, projetos e objetivos de forma visual, para manter o foco e acompanhar o progresso em direção aos meus objetivos na área de tecnologia.',
  verbs: ['Planejar', 'Estudar', 'Construir', 'Evoluir'],
  note: ['Um passo de cada vez', 'também é progresso.'],
} as const;
