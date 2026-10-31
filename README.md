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
- **Opcionais:** `repository`, `demo`, `team` e `pending`.

O texto abaixo do cabeçalho vira a página do projeto. A página inicial mostra os três primeiros pela ordem de `order`.

- **Página `/projetos`:** arquivo em três colunas de cartões, sempre encerrado pelo cartão "Próximo projeto". Os textos fixos da página ficam em `src/data/projects.ts`. O cenário da ponte espacial (`src/assets/projects/space-bridge.png`) fica preso ao pé da página e desce junto quando há mais projetos.
- **Página de cada projeto:** é um estudo de caso. O sumário lateral é gerado a partir dos títulos `##` do texto. Seções ainda não escritas entram em `pending` (por exemplo, `pending: [Aprendizados]`) e aparecem como "em documentação". Quando a seção for escrita, basta tirá-la da lista.

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

As fases ficam numa lista única em `src/data/roadmap.ts` (`roadmapNodes`), na ordem da estrada. A home e a página `/roadmap` leem a mesma lista, e cada uma calcula a geometria da própria estrada pela quantidade de fases. Para acrescentar uma fase, basta incluí-la na lista, sem mexer nos componentes.

- **Fases:** Java está em andamento. As fases 02 a 05 têm ícone, e as 06 a 20 são marcadores ainda não definidos, com cadeado e o estado "em construção". Uma fase com `details` vira um botão que abre o painel de detalhes (`src/components/roadmap/RoadmapPanel.astro`), compartilhado pelas duas páginas.
- **Página inicial** (`src/components/roadmap/Roadmap.astro`):
  - **Estrada:** horizontal e contínua. Começa mostrando as cinco primeiras fases e segue para a direita. A altura e a curva de cada trecho seguem um ciclo de dez, definido em `WAVE_Y` e `WAVE_BEND`.
  - **Navegação:** pelo mouse (arrastando), pelo toque, pelas setas e pelas teclas Home e End do teclado, ou pelos dois botões ‹ ›. As bordas esmaecem enquanto houver estrada escondida daquele lado.
  - **Arraste e painel:** um arraste não abre fases. O painel acompanha o nó enquanto a estrada rola.
- **Página `/roadmap`** (`src/components/roadmap-page/`):
  - **Estrada:** ampliada em serpentina, em fileiras de cinco. As quatro primeiras fileiras têm posições ajustadas à arte, em `roadmapPagePositions`. Se a lista passar de 20 fases, novas fileiras são criadas automaticamente.
  - **Telas menores:** abaixo de 1024 px, a estrada segue em três colunas.
- **Títulos animados:** "Lucas Maffei", "Roadmap" e "Projetos" são GIFs em `public/images/`, com um quadro estático (`.png`) exibido quando o sistema pede movimento reduzido. Os títulos de página usam o componente `src/components/ui/GlitchWordmark.astro`.

## Transições entre páginas

A navegação usa o `ClientRouter` do Astro (`astro:transitions`). Só o conteúdo anima: o cabeçalho fica parado e o grão do fundo continua de uma página para a outra.

- **Efeito:** a página atual sai em cerca de 110 ms, com faixas de interferência e um leve deslize horizontal. A nova entra com um fade curto. A animação fica em `src/lib/transitions.ts`, e os quadros-chave em `src/styles/global.css`.
- **Movimento reduzido:** com `prefers-reduced-motion`, a troca vira um fade simples, sem deslize.
- **Scripts:** como a página não recarrega, os scripts interativos se religam no evento `astro:page-load` e descartam os eventos da página anterior com um `AbortController`. Componentes novos com script devem seguir o mesmo padrão.
- **Links que não são páginas:** links para arquivos, como o RSS, levam `data-astro-reload` para abrir com recarga completa.

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
