import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, postHref } from '@/lib/blog';
import { site } from '@/data/site';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `Blog · ${site.name}`,
    description: 'Pensamentos, aprendizados e registros da minha jornada.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      categories: post.data.tags,
      link: postHref(post),
    })),
    customData: '<language>pt-br</language>',
  });
}
