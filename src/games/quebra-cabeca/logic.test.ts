import { describe, expect, it } from 'vitest';
import type { Difficulty } from '@/types';
import { createRng } from '@/utils/random';
import { createJigsaw, getPieceEdges, pieceViewBox } from './jigsaw';
import { PUZZLE_GRIDS, createPuzzle, describePosition, pieceFits } from './logic';
import { SCENES, getScene, nextSceneId } from './scenes';

const LEVELS: Difficulty[] = ['facil', 'medio', 'desafio'];

describe('formato das peças', () => {
  it('as bordas da imagem são sempre retas', () => {
    const rows = 3;
    const cols = 4;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const edges = getPieceEdges(row, col, rows, cols);
        if (row === 0) expect(edges.top).toBe(0);
        if (row === rows - 1) expect(edges.bottom).toBe(0);
        if (col === 0) expect(edges.left).toBe(0);
        if (col === cols - 1) expect(edges.right).toBe(0);
      }
    }
  });

  it('peças vizinhas se completam: saliência de uma, reentrância da outra', () => {
    const rows = 3;
    const cols = 3;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const edges = getPieceEdges(row, col, rows, cols);
        if (col < cols - 1) {
          const neighbor = getPieceEdges(row, col + 1, rows, cols);
          expect(edges.right).not.toBe(0);
          expect(edges.right + neighbor.left).toBe(0);
        }
        if (row < rows - 1) {
          const neighbor = getPieceEdges(row + 1, col, rows, cols);
          expect(edges.bottom).not.toBe(0);
          expect(edges.bottom + neighbor.top).toBe(0);
        }
      }
    }
  });

  it('cada peça tem um contorno fechado e um enquadramento com folga', () => {
    const layout = createJigsaw(2, 3, 300, 300);
    expect(layout.pieces).toHaveLength(6);
    expect(layout.cellWidth).toBe(100);
    expect(layout.cellHeight).toBe(150);
    for (const piece of layout.pieces) {
      expect(piece.path.startsWith('M')).toBe(true);
      expect(piece.path.endsWith('Z')).toBe(true);
      expect(piece.path).not.toMatch(/NaN|undefined/);
      const [x, y, width, height] = pieceViewBox(layout, piece).split(' ').map(Number);
      expect(x).toBeLessThan(piece.x);
      expect(y).toBeLessThan(piece.y);
      expect(width).toBeGreaterThan(layout.cellWidth);
      expect(height).toBeGreaterThan(layout.cellHeight);
    }
  });

  it('peças sem vizinhos (grade 1×1) são um retângulo simples', () => {
    const [piece] = createJigsaw(1, 1, 100, 100).pieces;
    expect(piece?.edges).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
    expect(piece?.path).toBe('M0 0L100 0L100 100L0 100L0 0Z');
  });
});

describe('montagem do quebra-cabeça', () => {
  it.each(LEVELS)('nível %s: a bandeja tem todas as peças, fora de ordem', (level) => {
    const { rows, cols } = PUZZLE_GRIDS[level];
    for (let seed = 0; seed < 100; seed += 1) {
      const { layout, tray } = createPuzzle(level, createRng(seed));
      const ids = layout.pieces.map((piece) => piece.id);
      expect(tray).toHaveLength(rows * cols);
      expect(tray.slice().sort()).toEqual(ids.slice().sort());
      expect(tray).not.toEqual(ids);
    }
  });

  it('começa com poucas peças e aumenta aos poucos', () => {
    const count = (level: Difficulty) => PUZZLE_GRIDS[level].rows * PUZZLE_GRIDS[level].cols;
    expect(count('facil')).toBe(4);
    expect(count('medio')).toBe(6);
    expect(count('desafio')).toBe(9);
  });

  it('uma peça só se encaixa no próprio lugar', () => {
    expect(pieceFits('0-1', '0-1')).toBe(true);
    expect(pieceFits('0-1', '1-0')).toBe(false);
  });

  it('descreve a posição em palavras', () => {
    expect(describePosition(0, 1)).toBe('linha 1, coluna 2');
  });
});

describe('imagens', () => {
  it('há imagens de animais, brinquedos e cenários, todas com nome', () => {
    expect(SCENES.length).toBeGreaterThanOrEqual(6);
    expect(new Set(SCENES.map((scene) => scene.id)).size).toBe(SCENES.length);
    SCENES.forEach((scene) => expect(scene.name.length).toBeGreaterThan(0));
  });

  it('a "próxima imagem" percorre todas e volta ao começo', () => {
    let id = SCENES[0]!.id;
    const visited = [id];
    for (let i = 0; i < SCENES.length; i += 1) {
      id = nextSceneId(id);
      visited.push(id);
    }
    expect(new Set(visited).size).toBe(SCENES.length);
    expect(visited[visited.length - 1]).toBe(SCENES[0]!.id);
    expect(getScene(id).id).toBe(id);
  });
});
