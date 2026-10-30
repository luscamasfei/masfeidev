import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projetos'>;

export const projectStatusLabel: Record<Project['data']['status'], string> = {
  'em-desenvolvimento': 'Em desenvolvimento',
  'no-ar': 'No ar',
  concluido: 'Concluído',
};

export const projectHref = (project: Project) => `/projetos/${project.id}/`;

export const projectNumber = (index: number) => String(index + 1).padStart(2, '0');

export async function getProjects() {
  const projects = await getCollection('projetos');
  return projects.sort((a, b) => a.data.order - b.data.order);
}
