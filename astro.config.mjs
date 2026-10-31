// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://masfeidev.vercel.app',
  integrations: [mdx()],
  markdown: {
    // Cores do código definidas em global.css, para manter tudo monocromático.
    shikiConfig: { theme: 'css-variables' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
