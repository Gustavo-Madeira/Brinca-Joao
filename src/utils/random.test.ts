import { describe, expect, it } from 'vitest';
import { createRng, pickMany, pickOne, randomInt, shuffle, shuffleDifferent } from './random';

describe('createRng', () => {
  it('repete a mesma sequência para a mesma semente', () => {
    const a = createRng(42);
    const b = createRng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('gera valores entre 0 (inclusive) e 1 (exclusive)', () => {
    const rng = createRng(7);
    for (let i = 0; i < 500; i += 1) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('muda a sequência quando a semente muda', () => {
    expect(createRng(1)()).not.toBe(createRng(2)());
  });
});

describe('shuffle', () => {
  it('mantém os mesmos itens e não altera a lista original', () => {
    const original = [1, 2, 3, 4, 5, 6];
    const copy = original.slice();
    const result = shuffle(original, createRng(3));
    expect(original).toEqual(copy);
    expect(result.slice().sort()).toEqual(copy);
  });
});

describe('shuffleDifferent', () => {
  it('nunca devolve a ordem original', () => {
    const items = ['a', 'b', 'c'];
    for (let seed = 0; seed < 200; seed += 1) {
      expect(shuffleDifferent(items, createRng(seed))).not.toEqual(items);
    }
  });

  it('funciona mesmo quando o sorteio insiste na mesma ordem', () => {
    // Um "sorteio" que sempre devolve o último índice mantém a lista igual.
    const stubborn = () => 0.999999;
    expect(shuffleDifferent([1, 2, 3], stubborn)).toEqual([2, 3, 1]);
  });

  it('aceita listas com menos de dois itens', () => {
    expect(shuffleDifferent([], createRng(1))).toEqual([]);
    expect(shuffleDifferent(['só'], createRng(1))).toEqual(['só']);
  });
});

describe('pickOne e pickMany', () => {
  it('pickOne escolhe um item da lista', () => {
    const items = ['x', 'y', 'z'];
    expect(items).toContain(pickOne(items, createRng(9)));
  });

  it('pickOne avisa quando a lista está vazia', () => {
    expect(() => pickOne([])).toThrow();
  });

  it('pickMany devolve itens diferentes, na quantidade pedida', () => {
    const result = pickMany([1, 2, 3, 4, 5], 3, createRng(11));
    expect(result).toHaveLength(3);
    expect(new Set(result).size).toBe(3);
  });

  it('pickMany devolve tudo quando pedem mais do que existe', () => {
    expect(pickMany([1, 2], 5, createRng(1)).slice().sort()).toEqual([1, 2]);
  });
});

describe('randomInt', () => {
  it('fica dentro do intervalo, incluindo as pontas', () => {
    const rng = createRng(5);
    const seen = new Set<number>();
    for (let i = 0; i < 300; i += 1) seen.add(randomInt(1, 3, rng));
    expect([...seen].sort()).toEqual([1, 2, 3]);
  });
});
