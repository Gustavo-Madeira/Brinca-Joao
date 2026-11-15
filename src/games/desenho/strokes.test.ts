import { describe, expect, it } from 'vitest';
import { BRUSH_SIZES, PALETTE, clamp01, parseDrawing, serializeDrawing } from './strokes';
import type { Drawing } from './strokes';

describe('desenho salvo', () => {
  it('guarda e recupera os traços (com precisão de sobra para a tela)', () => {
    const drawing: Drawing = {
      aspect: 1,
      strokes: [
        { color: '#e5484d', size: 0.02, points: [0.1, 0.2, 0.33333, 0.87654] },
        { color: '#ffffff', size: 0.036, points: [0.5, 0.5] },
      ],
    };
    const text = serializeDrawing(drawing);
    expect(text).not.toBeNull();

    const restored = parseDrawing(JSON.parse(text ?? 'null'));
    expect(restored?.aspect).toBe(1);
    expect(restored?.strokes).toHaveLength(2);
    expect(restored?.strokes[0]?.color).toBe('#e5484d');
    expect(restored?.strokes[0]?.size).toBe(0.02);
    restored?.strokes[0]?.points.forEach((value, index) => {
      expect(value).toBeCloseTo(drawing.strokes[0]?.points[index] ?? -1, 3);
    });
  });

  it('não salva desenhos grandes demais (devolve null)', () => {
    const points = Array.from({ length: 400_000 }, (_, index) => (index % 100) / 100);
    expect(serializeDrawing({ aspect: 1, strokes: [{ color: '#000000', size: 0.02, points }] })).toBeNull();
  });

  it('recusa conteúdo que não é um desenho', () => {
    expect(parseDrawing(null)).toBeNull();
    expect(parseDrawing('rabisco')).toBeNull();
    expect(parseDrawing({ v: 2, strokes: [] })).toBeNull();
    expect(parseDrawing({ v: 1, strokes: 'muitos' })).toBeNull();
  });

  it('descarta traços estranhos e mantém os bons', () => {
    const result = parseDrawing({
      v: 1,
      aspect: 1.3333,
      strokes: [
        { c: '#2f80ed', s: 0.02, p: [1000, 2000, 3000, 4000] },
        { c: 'vermelho', s: 0.02, p: [1, 2] },
        { c: '#2f80ed', s: 5, p: [1, 2] },
        { c: '#2f80ed', s: 0.02, p: [1, 2, 3] },
        { c: '#2f80ed', s: 0.02, p: [1, 'dois'] },
        'não é um traço',
      ],
    });
    expect(result?.strokes).toHaveLength(1);
    expect(result?.strokes[0]?.points).toEqual([0.1, 0.2, 0.3, 0.4]);
  });

  it('mantém os pontos dentro do papel e a proporção dentro do razoável', () => {
    const result = parseDrawing({
      v: 1,
      aspect: 99,
      strokes: [{ c: '#2f80ed', s: 0.02, p: [-500, 20000] }],
    });
    expect(result?.aspect).toBe(1);
    expect(result?.strokes[0]?.points).toEqual([0, 1]);
  });
});

describe('ferramentas de desenho', () => {
  it('clamp01 mantém valores entre 0 e 1', () => {
    expect(clamp01(-3)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(7)).toBe(1);
    expect(clamp01(Number.NaN)).toBe(0);
  });

  it('a paleta tem cores com nome (para leitores de tela) e sem repetição', () => {
    expect(PALETTE.length).toBeGreaterThanOrEqual(8);
    expect(new Set(PALETTE.map((color) => color.value)).size).toBe(PALETTE.length);
    PALETTE.forEach((color) => {
      expect(color.name.length).toBeGreaterThan(0);
      expect(color.value).toMatch(/^#[0-9a-f]{6}$/);
    });
  });

  it('os pincéis vão do mais fino ao mais grosso', () => {
    const sizes = BRUSH_SIZES.map((size) => size.value);
    expect(sizes).toEqual(sizes.slice().sort((a, b) => a - b));
    expect(sizes).toHaveLength(3);
  });
});
