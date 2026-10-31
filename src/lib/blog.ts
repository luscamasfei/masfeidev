import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

// Rascunhos aparecem em `astro dev` ou num build com SHOW_DRAFTS=true, para pré-visualização.
const showDrafts = import.meta.env.DEV || import.meta.env.SHOW_DRAFTS === 'true';

/** Publicados, do mais recente ao mais antigo. */
export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => showDrafts || !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const postHref = (post: Post) => `/blog/${post.id}/`;

export const tagSlug = (tag: string) =>
  tag
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const tagHref = (tag: string) => `/blog/tags/${tagSlug(tag)}/`;

export function getTags(posts: Post[]) {
  const counts = new Map<string, number>();
  for (const post of posts) for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR')).map(([name, count]) => ({ name, count }));
}

const dateParts = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).formatToParts(date);

/** "12 MAR 2025", como nos registros da referência. */
export function shortDate(date: Date) {
  const part = (type: string) => dateParts(date).find((p) => p.type === type)?.value ?? '';
  return `${part('day')} ${part('month').replace('.', '').toUpperCase()} ${part('year')}`;
}

export const longDate = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export function readingMinutes(body = '') {
  const words = body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
