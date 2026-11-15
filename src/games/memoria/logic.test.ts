import { describe, expect, it } from 'vitest';
import { createRng } from '@/utils/random';
import {
  PAIRS_BY_LEVEL,
  createDeck,
  createMemoryState,
  flipCard,
  hasMismatch,
  isComplete,
  isFaceUp,
} from './logic';
import type { MemoryState } from './logic';

/** Baralho fixo, para as regras ficarem fáceis de ler: A A B B. */
function fixedState(): MemoryState {
  return {
    cards: [
      { id: 'a1', pictureId: 'gato' },
      { id: 'a2', pictureId: 'gato' },
      { id: 'b1', pictureId: 'bola' },
      { id: 'b2', pictureId: 'bola' },
    ],
    open: [],
    matched: [],
    lastMatch: null,
  };
}

describe('baralho da memória', () => {
  it('tem duas cartas de cada figura', () => {
    const deck = createDeck(6, createRng(1));
    const counts = new Map<string, number>();
    deck.forEach((card) => counts.set(card.pictureId, (counts.get(card.pictureId) ?? 0) + 1));

    expect(deck).toHaveLength(12);
    expect(counts.size).toBe(6);
    expect([...counts.values()].every((count) => count === 2)).toBe(true);
    expect(new Set(deck.map((card) => card.id)).size).toBe(12);
  });

  it('usa a quantidade de pares de cada nível', () => {
    expect(createMemoryState('facil', createRng(1)).cards).toHaveLength(PAIRS_BY_LEVEL.facil * 2);
    expect(createMemoryState('medio', createRng(1)).cards).toHaveLength(PAIRS_BY_LEVEL.medio * 2);
    expect(createMemoryState('desafio', createRng(1)).cards).toHaveLength(
      PAIRS_BY_LEVEL.desafio * 2,
    );
  });
});

describe('regras de virar cartas', () => {
  it('a primeira carta fica aberta', () => {
    const state = flipCard(fixedState(), 'a1');
    expect(state.open).toEqual(['a1']);
    expect(isFaceUp(state, state.cards[0]!)).toBe(true);
  });

  it('duas cartas iguais formam um par e ficam abertas', () => {
    const state = flipCard(flipCard(fixedState(), 'a1'), 'a2');
    expect(state.matched).toEqual(['gato']);
    expect(state.lastMatch).toBe('gato');
    expect(state.open).toEqual([]);
    expect(hasMismatch(state)).toBe(false);
  });

  it('duas cartas diferentes ficam abertas, sem prazo, até o próximo toque', () => {
    const state = flipCard(flipCard(fixedState(), 'a1'), 'b1');
    expect(state.open).toEqual(['a1', 'b1']);
    expect(hasMismatch(state)).toBe(true);
    expect(state.matched).toEqual([]);
  });

  it('o toque seguinte fecha as diferentes e já abre a carta tocada', () => {
    const mismatch = flipCard(flipCard(fixedState(), 'a1'), 'b1');
    const state = flipCard(mismatch, 'a2');
    expect(state.open).toEqual(['a2']);
  });

  it('tocar em uma das cartas diferentes apenas fecha as duas', () => {
    const mismatch = flipCard(flipCard(fixedState(), 'a1'), 'b1');
    expect(flipCard(mismatch, 'b1').open).toEqual([]);
  });

  it('tocar de novo na mesma carta aberta não muda nada', () => {
    const first = flipCard(fixedState(), 'a1');
    expect(flipCard(first, 'a1')).toBe(first);
  });

  it('cartas de pares já encontrados e cartas inexistentes são ignoradas', () => {
    const paired = flipCard(flipCard(fixedState(), 'a1'), 'a2');
    expect(flipCard(paired, 'a1')).toBe(paired);
    expect(flipCard(paired, 'nao-existe')).toBe(paired);
  });

  it('o jogo termina quando todos os pares são encontrados', () => {
    let state = fixedState();
    expect(isComplete(state)).toBe(false);
    for (const id of ['a1', 'a2', 'b1', 'b2']) state = flipCard(state, id);
    expect(isComplete(state)).toBe(true);
    expect(state.matched).toEqual(['gato', 'bola']);
  });

  it('errar quantas vezes for não impede de terminar', () => {
    let state = fixedState();
    for (let i = 0; i < 20; i += 1) {
      state = flipCard(state, 'a1');
      state = flipCard(state, 'b1');
      state = flipCard(state, 'b1');
    }
    for (const id of ['a1', 'a2', 'b1', 'b2']) state = flipCard(state, id);
    expect(isComplete(state)).toBe(true);
  });
});
