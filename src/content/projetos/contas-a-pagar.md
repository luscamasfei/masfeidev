---
title: Sistema de Contas a Pagar
summary: Trabalho A3 em Java para registrar e acompanhar contas a pagar.
order: 1
status: em-desenvolvimento
context: Trabalho A3 · Algoritmos e Programação
technologies: [Java, Maven]
repository: https://github.com/luscamasfei/A3_Algoritmo_e_programacao
art: horizon
team:
  - name: Patricia Lima da Silva
    github: https://github.com/Patricialima99
  - name: Adam Schneider de Andrade
    github: https://github.com/adamschneider34
  - name: Maria Eduarda Carriço de Vargas Ávila de Oliveira
    github: https://github.com/maria-eduarda-cdv
  - name: Luan Schultz Ceretta
    github: https://github.com/SupDan01
---

## Objetivo

Desenvolver um sistema de contas a pagar como trabalho A3 da disciplina Algoritmos e Programação.

## Contexto

É um trabalho em grupo, feito com mais quatro colegas. Criei o repositório, organizei a estrutura do projeto e escrevi a primeira versão do modelo de dados. Cada integrante fez o seu primeiro commit adicionando o próprio nome à classe principal.

## Desafios

- Colocar cinco pessoas para trabalhar no mesmo repositório Git.
- Organizar o projeto no padrão Maven, com um pacote próprio, desde o início.

## Solução implementada

O projeto ainda está em desenvolvimento. Até aqui:

- Projeto Maven com Java 21 e o pacote `contasapagar`.
- Classe `Conta` com documento, descrição, beneficiário, valor, saldo e vencimento (`LocalDate`), com métodos de acesso e de alteração.
- O saldo de uma conta nova começa igual ao valor dela.
