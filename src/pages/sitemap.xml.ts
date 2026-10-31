import type { APIContext } from 'astro';
import { getPosts, getTags, postHref, tagHref } from '@/lib/blog';
import { getProjects, projectHref } from '@/lib/projects';

// Sitemap gerado no build com as páginas fixas, projetos, posts publicados e tags.
export async function GET(context: APIContext) {
  const posts = await getPosts();
  const projects = await getProjects();
  const paths = [
    '/',
    '/roadmap/',
    '/projetos/',
    ...projects.map(projectHref),
    '/blog/',
    ...posts.map(postHref),
    ...getTags(posts).map(({ name }) => tagHref(name)),
    '/sobre/',
  ];
  const urls = paths.map((path) => `  <url><loc>${new URL(path, context.site)}</loc></url>`).join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
}
