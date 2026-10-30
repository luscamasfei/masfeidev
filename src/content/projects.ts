/**
 * Portfolio projects. Each entry becomes a file in ~/Projetos and a page in the
 * project viewer. To add a project, append an object to `projects`; the virtual
 * file system, terminal (`projects`) and simple view pick it up automatically.
 *
 * Only describe what actually exists in the project. Optional fields that are
 * left out are simply not rendered.
 */
export type ProjectStatus = 'em-desenvolvimento' | 'concluido' | 'pausado';

export interface TechGroup {
  area: string;
  items: string[];
}

export interface Project {
  /** Used as file name (`<slug>.proj`) and terminal argument. Lowercase, no spaces. */
  slug: string;
  name: string;
  summary: string;
  goal?: string;
  status: ProjectStatus;
  statusNote?: string;
  technologies: TechGroup[];
  features: string[];
  /** Planned work that does not exist yet. */
  notYet?: string[];
  architecture?: string;
  /** Paths relative to /public, e.g. "projects/nyx/login.webp". */
  screenshots?: { src: string; alt: string }[];
  repository: { url?: string; private: boolean };
  demoUrl?: string;
}

export const statusLabel: Record<ProjectStatus, string> = {
  'em-desenvolvimento': 'Em desenvolvimento',
  concluido: 'Concluído',
  pausado: 'Pausado',
};

export const projects: Project[] = [
  {
    slug: 'nyx',
    name: 'Nyx',
    summary:
      'Aplicativo desktop de comunicação, nativo para Linux, com backend próprio. Combina contas, ' +
      'conexões entre pessoas e mensagens privadas em tempo real com um modelo de comunidades em ' +
      'que cada comunidade roda na infraestrutura de quem a administra, registrada e autorizada ' +
      'por um serviço central.',
    goal:
      'Oferecer um cliente de comunicação desktop nativo, sem navegador embutido, WebView ou ' +
      'Electron, para pessoas e grupos que preferem hospedar a própria comunidade em vez de ' +
      'depender de uma plataforma centralizada.',
    status: 'em-desenvolvimento',
    statusNote: 'Em desenvolvimento ativo; não deve ser considerado pronto para produção.',
    technologies: [
      {
        area: 'App',
        items: ['Flutter', 'Dart', 'GTK 3', 'http', 'stomp_dart_client', 'flutter_secure_storage', 'file_selector'],
      },
      {
        area: 'Backend',
        items: [
          'Java 25+',
          'Spring Boot 4.1',
          'Spring Security (JWT/Nimbus)',
          'Spring Data JPA / Hibernate',
          'WebSocket / STOMP',
          'Flyway',
          'Maven',
        ],
      },
      { area: 'Banco', items: ['PostgreSQL 18'] },
      {
        area: 'Testes',
        items: ['flutter_test', 'JUnit', 'Spring Boot Test', 'Mockito', 'embedded-postgres'],
      },
    ],
    features: [
      'Cadastro, login, sessões revogáveis e logout.',
      'Busca de pessoas e conexões (solicitar, aceitar, recusar, cancelar, remover).',
      'Mensagens privadas 1:1 com histórico persistido, entrega em tempo real (STOMP/WebSocket) e reenvio sem duplicação.',
      'Presença online/offline das conexões.',
      'Perfil com avatar e banner PNG/GIF validados pelo servidor, cores, biografia e módulos com visibilidade configurável.',
      'Configurações da conta, privacidade e bloqueios aplicados pelo backend, notificações do sistema e preferências locais de aparência, acessibilidade e áudio.',
      'Integração Steam opcional: vínculo por Steam OpenID, jogos, tempo de jogo e conquistas.',
      'Registro central de comunidades: criação com Key, dono e papéis, verificação do endereço e agente de referência.',
      'Nyx Control Center: cargos globais, denúncias, sanções, Keys, políticas e auditoria.',
    ],
    notYet: [
      'Servidor de comunidade (canais, mensagens de grupo, membros reais).',
      'Chamadas de voz e vídeo; anexos, reações e edição em mensagens privadas.',
      'Envio real de e-mail.',
      'Autenticação em dois fatores.',
      'Builds para Windows e macOS e empacotamento para distribuição.',
    ],
    architecture:
      'App Flutter (desktop) --REST + STOMP/WebSocket--> Backend Spring Boot --JDBC--> PostgreSQL\n' +
      'Agente de comunidade  --HTTPS (heartbeat)-------> Backend Spring Boot',
    repository: { private: true },
  },
];

export function findProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug.toLowerCase());
}
