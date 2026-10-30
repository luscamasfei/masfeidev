---
title: Liriane Wagner · Arquitetura
summary: Portfólio digital de uma arquiteta, com os projetos contados como capítulos.
order: 2
status: no-ar
context: Site para cliente · Passo Fundo (RS)
technologies: [HTML, CSS, JavaScript, Node.js, Cloudflare]
repository: https://github.com/luscamasfei/lirianewagner
demo: https://lirianewagner.com.br
art: corridor
---

## Objetivo

Trocar uma página de links por um portfólio com cara de estúdio de arquitetura, que apresente os projetos da arquiteta e leve o visitante a pedir orçamento pelo WhatsApp.

## Contexto

Site da arquiteta e urbanista Liriane Wagner, de Passo Fundo (RS). As informações foram validadas com a cliente antes da publicação, e o site está no ar em [lirianewagner.com.br](https://lirianewagner.com.br).

## Desafios

- Apresentar projetos acadêmicos e profissionais sem confundir o visitante.
- Manter o site leve, mesmo com muitas imagens de renders e desenhos técnicos.
- Receber pedidos de orçamento sem guardar dados no site.
- Garantir acessibilidade e boa presença no Google.

## Solução implementada

- Site estático, sem framework e sem dependências instaladas via npm. Scripts em Node.js geram o HTML a partir de arquivos de dados.
- Uma página por projeto, com ficha técnica, conceito, desafio, soluções, materiais, galeria e desenhos técnicos. Cada projeto informa se é acadêmico ou profissional.
- Contato pelo WhatsApp com mensagens prontas. Um formulário opcional de pré-orçamento organiza as respostas em uma mensagem, sem guardar dados.
- Imagens responsivas em WebP e JPEG, carregamento sob demanda e fontes hospedadas no próprio site.
- Navegação por teclado, foco visível e respeito à preferência por menos animação.
- Títulos e descrições por página, dados estruturados (schema.org), sitemap e imagens de compartilhamento.
- Um script de verificação confere links, imagens e textos alternativos antes de cada publicação, e o site é hospedado no Cloudflare.
