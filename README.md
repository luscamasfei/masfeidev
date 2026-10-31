# masfeidev

Portfólio pessoal e registro de desenvolvimento de Lucas Maffei, estudante de Sistemas de Informação que documenta sua jornada no desenvolvimento de software.

Construído com Astro, TypeScript e Tailwind CSS. O site é gerado estaticamente.

## Desenvolvimento

Requisitos: Node.js 22.12 ou mais recente e pnpm.

```bash
pnpm install
pnpm dev       # servidor de desenvolvimento local
pnpm build     # verifica os tipos e gera o site estático em dist/
pnpm preview   # serve o build de produção
```

A documentação completa será adicionada conforme o projeto evolui.

## Roadmap

O roadmap aparece em dois lugares, com os mesmos dados em `src/data/roadmap.ts`:

- **Página inicial** (`src/components/roadmap/Roadmap.astro`): mini-roadmap com as cinco primeiras fases.
- **Página `/roadmap`** (`src/components/roadmap-page/`): a mesma estrada ampliada em serpentina, com 20 fases em quatro fileiras. Abaixo de 1024 px, ela segue em três colunas.

Para editar o roadmap:

- **Fases da home:** são definidas em `roadmapNodes`. Uma fase com `details` vira um botão que abre o painel de detalhes (`src/components/roadmap/RoadmapPanel.astro`), compartilhado pelas duas páginas.
- **Fases da página `/roadmap`:** são as fases da home, seguidas de fases ainda não definidas, que aparecem com cadeado e o estado "em construção". A quantidade e a posição dos nós vêm de `roadmapPagePositions`, em pixels de uma referência de 1672 × 941. A curvatura de cada trecho fica em `BENDS`, em `RoadmapTrack.astro`.
- **Títulos animados:** "Lucas Maffei" e "Roadmap" são GIFs em `public/images/`, com um quadro estático (`.png`) exibido quando o sistema pede movimento reduzido.

## Uso de Inteligência Artificial

Este projeto foi desenvolvido por Lucas Maffei com o auxílio do OpenAI Codex durante etapas de implementação, revisão e aprimoramento do código. As decisões sobre identidade visual, funcionalidades e direcionamento do projeto foram conduzidas pelo autor.
