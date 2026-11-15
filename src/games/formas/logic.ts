import type { Difficulty } from '@/types';
import { pickMany, shuffle, shuffleDifferent } from '@/utils/random';
import type { Rng } from '@/utils/random';
import { PIECE_COLORS } from './shapes';
import type { PieceColor, ShapeId } from './shapes';

export interface ShapePiece {
  id: string;
  shape: ShapeId;
  color: PieceColor;
}

export interface ShapesRound {
  /** Peças na ordem em que aparecem na bandeja. */
  pieces: ShapePiece[];
  /** Lugares vazios, em uma ordem diferente da das peças. */
  slots: ShapeId[];
  /** Nível fácil: cada lugar mostra uma sombra da cor da sua peça. */
  colorHints: boolean;
}

interface LevelConfig {
  count: number;
  pool: readonly ShapeId[];
  colorHints: boolean;
}

/** Formas bem diferentes entre si. */
const EASY_POOL: readonly ShapeId[] = ['circulo', 'quadrado', 'triangulo', 'estrela', 'coracao'];
const MEDIUM_POOL: readonly ShapeId[] = [...EASY_POOL, 'retangulo', 'losango', 'lua'];
/** Inclui formas parecidas (círculo e oval, pentágono e hexágono...). */
const ALL_POOL: readonly ShapeId[] = [...MEDIUM_POOL, 'hexagono', 'oval', 'pentagono', 'cruz'];

export const SHAPE_LEVELS: Record<Difficulty, LevelConfig> = {
  facil: { count: 3, pool: EASY_POOL, colorHints: true },
  medio: { count: 4, pool: MEDIUM_POOL, colorHints: false },
  desafio: { count: 6, pool: ALL_POOL, colorHints: false },
};

/** Sorteia as formas, as cores e a ordem dos lugares de uma rodada. */
export function createShapesRound(level: Difficulty, rng: Rng = Math.random): ShapesRound {
  const config = SHAPE_LEVELS[level];
  const shapes = pickMany(config.pool, config.count, rng);
  const colors = shuffle(PIECE_COLORS, rng);

  const pieces = shapes.map((shape, index) => ({
    id: `peca-${shape}`,
    shape,
    color: colors[index % colors.length] as PieceColor,
  }));

  return {
    pieces,
    slots: shuffleDifferent(shapes, rng),
    colorHints: config.colorHints,
  };
}

/** Uma peça só se encaixa no lugar da mesma forma. */
export function fits(piece: ShapePiece, slot: ShapeId): boolean {
  return piece.shape === slot;
}
