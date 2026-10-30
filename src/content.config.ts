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
  }),
});

export const collections = { projetos };
