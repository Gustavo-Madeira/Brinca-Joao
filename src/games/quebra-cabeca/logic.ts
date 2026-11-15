import type { Difficulty } from '@/types';
import { shuffleDifferent } from '@/utils/random';
import type { Rng } from '@/utils/random';
import { createJigsaw } from './jigsaw';
import type { JigsawLayout } from './jigsaw';

/** Tamanho da grade em cada nível: 4, 6 e 9 peças. */
export const PUZZLE_GRIDS: Record<Difficulty, { rows: number; cols: number }> = {
  facil: { rows: 2, cols: 2 },
  medio: { rows: 2, cols: 3 },
  desafio: { rows: 3, cols: 3 },
};

/** Lado da imagem, em unidades do SVG. */
export const IMAGE_SIZE = 300;

export interface PuzzleSetup {
  layout: JigsawLayout;
  /** Ordem das peças na bandeja (embaralhada). */
  tray: string[];
}

export function createPuzzle(level: Difficulty, rng: Rng = Math.random): PuzzleSetup {
  const { rows, cols } = PUZZLE_GRIDS[level];
  const layout = createJigsaw(rows, cols, IMAGE_SIZE, IMAGE_SIZE);
  return {
    layout,
    tray: shuffleDifferent(
      layout.pieces.map((piece) => piece.id),
      rng,
    ),
  };
}

/** Cada peça tem um único lugar: o da própria linha e coluna. */
export function pieceFits(pieceId: string, slotId: string): boolean {
  return pieceId === slotId;
}

/** "linha 1, coluna 2" — descrição do lugar para leitores de tela. */
export function describePosition(row: number, col: number): string {
  return `linha ${row + 1}, coluna ${col + 1}`;
}
