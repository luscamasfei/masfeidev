# masfeidev

Portfólio pessoal e registro de desenvolvimento de Lucas Maffei, estudante de Sistemas de Informação que documenta sua jornada no desenvolvimento de software.

**Site:** https://masfeidev.vercel.app

## Tecnologias

- **Astro 7**, com saída estática e Content Collections para projetos e posts
- **TypeScript**
- **Tailwind CSS 4**, com tokens de design em `src/styles/global.css`
- **MDX** para posts que precisam de componentes
- **Hospedagem:** Vercel

## Desenvolvimento

Requisitos: Node.js 22.12 ou mais recente e pnpm.

```bash
pnpm install
pnpm dev       # servidor de desenvolvimento local (mostra também os rascunhos do blog)
pnpm check     # verificação de tipos
pnpm build     # verifica os tipos e gera o site estático em dist/
pnpm preview   # serve o build de produção
```

## Estrutura

```text
src/
  assets/        artes de fundo, otimizadas no build (AVIF e WebP)
  components/    componentes por área: home, roadmap, roadmap-page, projects, blog, layout, ui
  content/       projetos e posts em Markdown/MDX
  data/          textos fixos: site e menu, home, roadmap, página Sobre
  layouts/       layout base, com metadados, Open Graph e RSS
  lib/           funções de apoio para projetos e blog
  pages/         rotas do site, RSS (rss.xml) e sitemap (sitemap.xml)
  styles/        estilos globais e tokens da identidade visual
public/
  images/        títulos animados em GIF e seus quadros estáticos
  og.jpg         imagem de compartilhamento (1200 × 630)
```

## Conteúdo

### Projetos

Cada projeto é um arquivo Markdown em `src/content/projetos/`. Os campos do cabeçalho estão definidos em `src/content.config.ts`:

- **Obrigatórios:** `title`, `summary`, `order`, `status`, `context`, `technologies` e `art`.
- **Opcionais:** `repository`, `demo` e `team`.

O texto abaixo do cabeçalho vira a página do projeto. A página inicial mostra os três primeiros pela ordem de `order`.

### Blog

Cada post é um arquivo `.md` ou `.mdx` em `src/content/blog/`, com `title`, `summary`, `date`, `tags` e `draft`.

- Posts com `draft: true` aparecem só no `pnpm dev`. Para publicar um post, troque para `draft: false`.
- Para ver os rascunhos num build, rode `SHOW_DRAFTS=true pnpm build`.
- O RSS (`/rss.xml`) e o sitemap incluem apenas os posts publicados.

### Textos fixos

- **Página inicial:** `src/data/home.ts`
- **Página Sobre:** `src/data/about.ts`. Os textos vêm do README do perfil do GitHub.
- **Nome, descrição e menu do site:** `src/data/site.ts`

## Roadmap

O roadmap aparece em dois lugares, com os mesmos dados em `src/data/roadmap.ts`:

- **Página inicial** (`src/components/roadmap/Roadmap.astro`): mini-roadmap com as cinco primeiras fases.
- **Página `/roadmap`** (`src/components/roadmap-page/`): a mesma estrada ampliada em serpentina, com 20 fases em quatro fileiras. Abaixo de 1024 px, ela segue em três colunas.

Para editar o roadmap:

- **Fases da home:** são definidas em `roadmapNodes`. Uma fase com `details` vira um botão que abre o painel de detalhes (`src/components/roadmap/RoadmapPanel.astro`), compartilhado pelas duas páginas.
- **Fases da página `/roadmap`:** são as fases da home, seguidas de fases ainda não definidas, que aparecem com cadeado e o estado "em construção". A quantidade e a posição dos nós vêm de `roadmapPagePositions`, em pixels de uma referência de 1672 × 941. A curvatura de cada trecho fica em `BENDS`, em `RoadmapTrack.astro`.
- **Títulos animados:** "Lucas Maffei" e "Roadmap" são GIFs em `public/images/`, com um quadro estático (`.png`) exibido quando o sistema pede movimento reduzido.

## Identidade visual

A identidade **Glitch Noir** é monocromática, com estética cósmica, texturas de mangá, granulação e interferência digital.

- **Cores:** definidas como tokens em `src/styles/global.css`. `--color-smoke` é o cinza mais escuro permitido para texto, por garantir contraste de 4,5:1 sobre o fundo.
- **Fontes:** Source Serif 4 nos títulos e IBM Plex Mono no restante.
- **Movimento:** as animações respeitam `prefers-reduced-motion`.

## Publicação

O site é publicado na Vercel pela linha de comando:

```bash
npx vercel deploy --prod
```

## Uso de Inteligência Artificial

Este projeto foi desenvolvido por mim com a utilização do Claude Code e Codex da OpenAI.

As ferramentas foram usadas na implementação, na revisão e no aprimoramento do código, além dos testes visuais em diferentes tamanhos de tela. Cada etapa foi apresentada, revisada e aprovada por mim antes de ser publicada.

As decisões sobre identidade visual, funcionalidades e direcionamento do projeto são minhas. As informações sobre minha formação, meus projetos e meus estudos foram fornecidas por mim: nenhum projeto, habilidade ou experiência foi inventado.
