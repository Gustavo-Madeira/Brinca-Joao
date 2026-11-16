import { describe, expect, it } from 'vitest';
import type { Difficulty } from '@/types';
import { createRng } from '@/utils/random';
import { COLORS, getColor } from './colors';
import { COLOR_LEVELS, createColorRound } from './logic';
import { OBJECTS, describeObject, getObject } from './objects';

const LEVELS: Difficulty[] = ['facil', 'medio', 'desafio'];

describe('rodadas do Mundo das Cores', () => {
  it.each(LEVELS)('nível %s: sempre existe exatamente uma opção com a cor do modelo', (level) => {
    for (let seed = 0; seed < 300; seed += 1) {
      const round = createColorRound(level, createRng(seed));
      const matching = round.options.filter((option) => option.colorId === round.target.colorId);
      expect(matching).toHaveLength(1);
      expect(matching[0]?.id).toBe(round.correctOptionId);
    }
  });

  it.each(LEVELS)('nível %s: as opções têm cores diferentes e a quantidade certa', (level) => {
    const config = COLOR_LEVELS[level];
    for (let seed = 0; seed < 300; seed += 1) {
      const round = createColorRound(level, createRng(seed));
      const colors = round.options.map((option) => option.colorId);
      expect(round.options).toHaveLength(config.optionCount);
      expect(new Set(colors).size).toBe(colors.length);
      colors.forEach((color) => expect(config.palette).toContain(color));
      expect(new Set(round.options.map((option) => option.id)).size).toBe(round.options.length);
    }
  });

  it('no nível fácil, todas as opções são a mesma figura do modelo', () => {
    for (let seed = 0; seed < 100; seed += 1) {
      const round = createColorRound('facil', createRng(seed));
      round.options.forEach((option) => expect(option.objectId).toBe(round.target.objectId));
    }
  });

  it('nos outros níveis, as figuras das opções são diferentes entre si e do modelo', () => {
    for (const level of ['medio', 'desafio'] as const) {
      for (let seed = 0; seed < 100; seed += 1) {
        const round = createColorRound(level, createRng(seed));
        const objects = round.options.map((option) => option.objectId);
        expect(new Set(objects).size).toBe(objects.length);
        expect(objects).not.toContain(round.target.objectId);
      }
    }
  });

  it('não repete a cor-modelo da rodada anterior', () => {
    for (let seed = 0; seed < 300; seed += 1) {
      expect(createColorRound('facil', createRng(seed), 'azul').target.colorId).not.toBe('azul');
    }
  });
});

describe('cores e figuras', () => {
  it('cada cor tem um símbolo só dela', () => {
    const symbols = COLORS.map((color) => color.symbol);
    expect(new Set(symbols).size).toBe(COLORS.length);
  });

  it('há figuras suficientes para o nível com mais opções', () => {
    expect(OBJECTS.length - 1).toBeGreaterThanOrEqual(COLOR_LEVELS.desafio.optionCount);
  });

  it('descreve a figura com a cor concordando com a palavra', () => {
    expect(describeObject(getObject('balao'), getColor('amarelo'))).toBe('Balão amarelo');
    expect(describeObject(getObject('flor'), getColor('amarelo'))).toBe('Flor amarela');
    expect(describeObject(getObject('camiseta'), getColor('azul'))).toBe('Camiseta azul');
  });
});
