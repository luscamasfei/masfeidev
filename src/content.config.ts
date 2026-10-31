import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projetos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projetos' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    /** Posição na listagem; menor aparece primeiro. */
    order: z.number(),
    status: z.enum(['em-desenvolvimento', 'no-ar', 'concluido']),
    context: z.string(),
    technologies: z.array(z.string()).min(1),
    repository: z.url().optional(),
    demo: z.url().optional(),
    /** Ilustração monocromática do cartão. */
    art: z.enum(['horizon', 'corridor']),
    team: z.array(z.object({ name: z.string(), github: z.url().optional() })).default([]),
    /** Seções do estudo de caso ainda sem conteúdo; aparecem como "em documentação". */
    pending: z.array(z.string()).default([]),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** Rascunhos aparecem só no servidor de desenvolvimento. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { projetos, blog };
