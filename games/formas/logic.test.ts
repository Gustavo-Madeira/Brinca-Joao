import { describe, expect, it } from 'vitest';
import type { Difficulty } from '@/types';
import { createRng } from '@/utils/random';
import { SHAPE_LEVELS, createShapesRound, fits } from './logic';
import { SHAPES } from './shapes';

const LEVELS: Difficulty[] = ['facil', 'medio', 'desafio'];

describe('rodadas do Encaixe as Formas', () => {
  it.each(LEVELS)('nível %s: cada peça tem exatamente um lugar', (level) => {
    const config = SHAPE_LEVELS[level];
    for (let seed = 0; seed < 200; seed += 1) {
      const round = createShapesRound(level, createRng(seed));
      const pieceShapes = round.pieces.map((piece) => piece.shape);

      expect(round.pieces).toHaveLength(config.count);
      expect(new Set(pieceShapes).size).toBe(config.count);
      expect(round.slots.slice().sort()).toEqual(pieceShapes.slice().sort());
      pieceShapes.forEach((shape) => expect(config.pool).toContain(shape));
    }
  });

  it.each(LEVELS)('nível %s: os lugares aparecem em ordem diferente das peças', (level) => {
    for (let seed = 0; seed < 200; seed += 1) {
      const round = createShapesRound(level, createRng(seed));
      expect(round.slots).not.toEqual(round.pieces.map((piece) => piece.shape));
    }
  });

  it('cada peça de uma rodada tem uma cor diferente', () => {
    for (let seed = 0; seed < 100; seed += 1) {
      const round = createShapesRound('desafio', createRng(seed));
      const colors = round.pieces.map((piece) => piece.color.id);
      expect(new Set(colors).size).toBe(colors.length);
    }
  });

  it('só o nível fácil mostra a sombra da cor nos lugares', () => {
    expect(createShapesRound('facil', createRng(1)).colorHints).toBe(true);
    expect(createShapesRound('medio', createRng(1)).colorHints).toBe(false);
    expect(createShapesRound('desafio', createRng(1)).colorHints).toBe(false);
  });

  it('uma peça só se encaixa no lugar da mesma forma', () => {
    const round = createShapesRound('facil', createRng(4));
    const piece = round.pieces[0];
    if (!piece) throw new Error('rodada sem peças');
    const other = round.slots.find((slot) => slot !== piece.shape);
    expect(fits(piece, piece.shape)).toBe(true);
    expect(other && fits(piece, other)).toBe(false);
  });

  it('todas as formas dos níveis existem no catálogo, com nome', () => {
    const known = SHAPES.map((shape) => shape.id);
    for (const level of LEVELS) {
      SHAPE_LEVELS[level].pool.forEach((shape) => expect(known).toContain(shape));
    }
    SHAPES.forEach((shape) => expect(shape.name.length).toBeGreaterThan(0));
  });
});
