import { PICTURES } from '@/illustrations/catalog';
import type { Difficulty } from '@/types';
import { pickMany, shuffle } from '@/utils/random';
import type { Rng } from '@/utils/random';

export interface MemoryCard {
  /** Identificador único da carta (cada figura tem duas cartas). */
  id: string;
  pictureId: string;
}

export interface MemoryState {
  cards: MemoryCard[];
  /**
   * Cartas viradas para cima que ainda não formaram par (no máximo duas).
   * Com duas cartas aqui, elas são diferentes e esperam o próximo toque.
   */
  open: string[];
  /** Figuras cujo par já foi encontrado. */
  matched: string[];
  /** Figura do par encontrado na última jogada (para a mensagem de parabéns). */
  lastMatch: string | null;
}

/** Quantos pares em cada nível. */
export const PAIRS_BY_LEVEL: Record<Difficulty, number> = {
  facil: 3,
  medio: 6,
  desafio: 8,
};

/** Monta o baralho: sorteia as figuras, duplica cada uma e embaralha. */
export function createDeck(
  pairCount: number,
  rng: Rng = Math.random,
  pictureIds: readonly string[] = PICTURES.map((picture) => picture.id),
): MemoryCard[] {
  const chosen = pickMany(pictureIds, pairCount, rng);
  const cards = chosen.flatMap((pictureId) => [
    { id: `${pictureId}-a`, pictureId },
    { id: `${pictureId}-b`, pictureId },
  ]);
  return shuffle(cards, rng);
}

export function createMemoryState(level: Difficulty, rng: Rng = Math.random): MemoryState {
  return {
    cards: createDeck(PAIRS_BY_LEVEL[level], rng),
    open: [],
    matched: [],
    lastMatch: null,
  };
}

/** Duas cartas diferentes estão abertas, esperando o próximo toque? */
export function hasMismatch(state: MemoryState): boolean {
  return state.open.length === 2;
}

export function isComplete(state: MemoryState): boolean {
  return state.matched.length * 2 === state.cards.length;
}

export function isFaceUp(state: MemoryState, card: MemoryCard): boolean {
  return state.open.includes(card.id) || state.matched.includes(card.pictureId);
}

/**
 * Regras de um toque em uma carta (função pura: devolve o novo estado).
 *
 * - Par igual: as duas ficam abertas para sempre.
 * - Par diferente: as duas ficam abertas, sem pressa, até o próximo toque.
 *   Esse toque fecha as duas; se foi em outra carta, ela já abre.
 * - Não existe limite de tempo nem de tentativas.
 */
export function flipCard(state: MemoryState, cardId: string): MemoryState {
  const card = state.cards.find((item) => item.id === cardId);
  if (!card || state.matched.includes(card.pictureId)) return state;

  if (state.open.length === 2) {
    const reopen = state.open.includes(cardId) ? [] : [cardId];
    return { ...state, open: reopen, lastMatch: null };
  }

  if (state.open.includes(cardId)) return state;

  const firstId = state.open[0];
  if (firstId === undefined) {
    return { ...state, open: [cardId], lastMatch: null };
  }

  const first = state.cards.find((item) => item.id === firstId);
  if (first && first.pictureId === card.pictureId) {
    return {
      ...state,
      open: [],
      matched: [...state.matched, card.pictureId],
      lastMatch: card.pictureId,
    };
  }

  return { ...state, open: [firstId, cardId], lastMatch: null };
}
