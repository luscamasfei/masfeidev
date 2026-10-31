import { projectsIntro } from '@/data/home';

/** Textos da página /projetos. A descrição é a mesma da seção da home. */
export const projectsPage = {
  eyebrow: projectsIntro.eyebrow,
  title: projectsIntro.title,
  description: projectsIntro.description,
  archiveLabel: 'Project archive',
  /** Cartão que fecha o arquivo, reservado para o próximo projeto. */
  nextProject: {
    title: 'Próximo projeto',
    status: 'Em construção',
    description: 'Um novo projeto está em desenvolvimento. Em breve, mais detalhes por aqui.',
    tag: 'Em breve',
  },
} as const;
