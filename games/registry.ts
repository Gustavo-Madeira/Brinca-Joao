import { lazy } from 'react';
import type { GameMeta } from '@/types';
import {
  AnimalsThumb,
  ColorsThumb,
  DrawingThumb,
  MemoryThumb,
  PuzzleThumb,
  ShapesThumb,
} from './thumbs';

/**
 * Catálogo de jogos do Brinca João.
 *
 * Para criar um jogo novo:
 * 1. crie uma pasta em `src/games/<nome>/` com um componente que tenha
 *    `export default` e receba `GameProps`;
 * 2. acrescente o identificador em `GameId` (src/types) e em `GAME_IDS`
 *    (src/context/progress-context.ts);
 * 3. adicione uma ficha aqui embaixo.
 *
 * A página de jogos, a página inicial e as rotas leem tudo desta lista.
 * O código de cada jogo só é baixado quando a criança abre o jogo.
 */
function defineGame(meta: Omit<GameMeta, 'Component'>): GameMeta {
  return { ...meta, Component: lazy(meta.load) };
}

export const GAMES: readonly GameMeta[] = [
  defineGame({
    id: 'cores',
    slug: 'cores',
    title: 'Mundo das Cores',
    description: 'Encontre as cores iguais.',
    emoji: '🎨',
    theme: 'lilac',
    hasLevels: true,
    Thumb: ColorsThumb,
    load: () => import('./cores/ColorsGame'),
  }),
  defineGame({
    id: 'formas',
    slug: 'formas',
    title: 'Encaixe as Formas',
    description: 'Coloque cada forma no seu lugar.',
    emoji: '🔷',
    theme: 'sky',
    hasLevels: true,
    Thumb: ShapesThumb,
    load: () => import('./formas/ShapesGame'),
  }),
  defineGame({
    id: 'memoria',
    slug: 'memoria',
    title: 'Jogo da Memória',
    description: 'Ache os pares de figuras.',
    emoji: '🧠',
    theme: 'sun',
    hasLevels: true,
    Thumb: MemoryThumb,
    load: () => import('./memoria/MemoryGame'),
  }),
  defineGame({
    id: 'quebra-cabeca',
    slug: 'quebra-cabeca',
    title: 'Quebra-Cabeça do João',
    description: 'Monte figuras divertidas.',
    emoji: '🧩',
    theme: 'leaf',
    hasLevels: true,
    Thumb: PuzzleThumb,
    load: () => import('./quebra-cabeca/PuzzleGame'),
  }),
  defineGame({
    id: 'animais',
    slug: 'animais',
    title: 'Descubra os Animais',
    description: 'Toque e conheça os bichinhos.',
    emoji: '🐶',
    theme: 'peach',
    hasLevels: false,
    Thumb: AnimalsThumb,
    load: () => import('./animais/AnimalsGame'),
  }),
  defineGame({
    id: 'desenho',
    slug: 'desenho',
    title: 'Desenho Livre',
    description: 'Desenhe e pinte como quiser.',
    emoji: '🖍️',
    theme: 'rose',
    hasLevels: false,
    Thumb: DrawingThumb,
    load: () => import('./desenho/DrawingGame'),
  }),
];

export function getGameBySlug(slug: string): GameMeta | undefined {
  return GAMES.find((game) => game.slug === slug);
}
