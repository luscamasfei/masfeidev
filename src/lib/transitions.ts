import type { TransitionDirectionalAnimations } from 'astro';

/*
 * Troca de página Glitch Noir: a página atual sai em ~110 ms com faixas de
 * interferência; a nova entra logo depois com um fade curto que estabiliza.
 * As keyframes ficam em src/styles/global.css (page-glitch-out e -in).
 */
const swap = {
  old: [{ name: 'page-glitch-out', duration: '110ms', easing: 'linear', fillMode: 'both' }],
  new: [{ name: 'page-glitch-in', duration: '300ms', delay: '90ms', easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fillMode: 'both' }],
};

export const glitchPage: TransitionDirectionalAnimations = { forwards: swap, backwards: swap };
