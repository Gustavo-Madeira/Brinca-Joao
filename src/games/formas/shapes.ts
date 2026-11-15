export type ShapeId =
  | 'circulo'
  | 'quadrado'
  | 'triangulo'
  | 'estrela'
  | 'coracao'
  | 'retangulo'
  | 'losango'
  | 'hexagono'
  | 'oval'
  | 'pentagono'
  | 'lua'
  | 'cruz';

export interface ShapeDef {
  id: ShapeId;
  name: string;
  /** Artigo do nome, para as frases: "o círculo", "a estrela". */
  article: 'o' | 'a';
}

/**
 * As formas do jogo. O desenho de cada uma está em `ShapeFigure.tsx`;
 * os níveis (quais formas aparecem em cada um) estão em `logic.ts`.
 */
export const SHAPES: readonly ShapeDef[] = [
  { id: 'circulo', name: 'círculo', article: 'o' },
  { id: 'quadrado', name: 'quadrado', article: 'o' },
  { id: 'triangulo', name: 'triângulo', article: 'o' },
  { id: 'estrela', name: 'estrela', article: 'a' },
  { id: 'coracao', name: 'coração', article: 'o' },
  { id: 'retangulo', name: 'retângulo', article: 'o' },
  { id: 'losango', name: 'losango', article: 'o' },
  { id: 'hexagono', name: 'hexágono', article: 'o' },
  { id: 'oval', name: 'oval', article: 'o' },
  { id: 'pentagono', name: 'pentágono', article: 'o' },
  { id: 'lua', name: 'lua', article: 'a' },
  { id: 'cruz', name: 'cruz', article: 'a' },
];

export function getShape(id: ShapeId): ShapeDef {
  const shape = SHAPES.find((item) => item.id === id);
  if (!shape) throw new Error(`Forma desconhecida: ${id}`);
  return shape;
}

/** Cores das peças: preenchimento claro e contorno mais escuro do mesmo tom. */
export interface PieceColor {
  id: string;
  fill: string;
  stroke: string;
}

export const PIECE_COLORS: readonly PieceColor[] = [
  { id: 'azul', fill: '#62aef5', stroke: '#2670d3' },
  { id: 'amarelo', fill: '#ffcf33', stroke: '#c48f00' },
  { id: 'verde', fill: '#5fcb8e', stroke: '#2f9a66' },
  { id: 'lilas', fill: '#ac92f5', stroke: '#6d4fd1' },
  { id: 'rosa', fill: '#ff8fb0', stroke: '#d1517a' },
  { id: 'laranja', fill: '#ffa662', stroke: '#d9722b' },
];
