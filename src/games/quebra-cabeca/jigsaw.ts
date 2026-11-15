import { round1 } from '@/utils/geometry';

/**
 * Geometria das peças de quebra-cabeça.
 *
 * A imagem é cortada em uma grade de linhas × colunas. Cada lado de uma peça
 * pode ser reto (borda da imagem), ter uma saliência ("botãozinho" para fora)
 * ou uma reentrância (o encaixe para dentro). Peças vizinhas sempre combinam:
 * onde uma tem saliência, a outra tem reentrância.
 */

/** 0 = lado reto · 1 = saliência (para fora) · -1 = reentrância (para dentro). */
export type EdgeKind = -1 | 0 | 1;

export interface PieceEdges {
  top: EdgeKind;
  right: EdgeKind;
  bottom: EdgeKind;
  left: EdgeKind;
}

export interface PieceGeometry {
  /** Identificador "linha-coluna", por exemplo "0-1". */
  id: string;
  row: number;
  col: number;
  /** Canto superior esquerdo da célula, nas coordenadas da imagem. */
  x: number;
  y: number;
  edges: PieceEdges;
  /** Contorno da peça (atributo `d` de um <path>), nas coordenadas da imagem. */
  path: string;
}

export interface JigsawLayout {
  rows: number;
  cols: number;
  width: number;
  height: number;
  cellWidth: number;
  cellHeight: number;
  /** Folga em volta de cada célula para caber a saliência. */
  pad: number;
  pieces: PieceGeometry[];
}

/** Sentido da saliência na emenda vertical à direita da célula (linha, coluna). */
function verticalSeam(row: number, col: number): EdgeKind {
  return (row + col) % 2 === 0 ? 1 : -1;
}

/** Sentido da saliência na emenda horizontal abaixo da célula (linha, coluna). */
function horizontalSeam(row: number, col: number): EdgeKind {
  return (row + col) % 2 === 0 ? -1 : 1;
}

function opposite(kind: EdgeKind): EdgeKind {
  if (kind === 1) return -1;
  if (kind === -1) return 1;
  return 0;
}

/** Formato dos quatro lados de uma peça. As bordas da imagem são sempre retas. */
export function getPieceEdges(row: number, col: number, rows: number, cols: number): PieceEdges {
  return {
    top: row === 0 ? 0 : opposite(horizontalSeam(row - 1, col)),
    right: col === cols - 1 ? 0 : verticalSeam(row, col),
    bottom: row === rows - 1 ? 0 : horizontalSeam(row, col),
    left: col === 0 ? 0 : opposite(verticalSeam(row, col - 1)),
  };
}

type PointMapper = (along: number, outward: number) => [number, number];

/**
 * Desenha um lado da peça, do começo ao fim, no sistema local do lado:
 * `along` anda sobre o lado e `outward` aponta para fora da peça.
 */
function edgeSegment(length: number, kind: EdgeKind, unit: number, map: PointMapper): string {
  const point = (along: number, outward: number): string => {
    const [x, y] = map(along, outward * kind);
    return `${round1(x)} ${round1(y)}`;
  };

  if (kind === 0) return `L${point(length, 0)}`;

  const mid = length / 2;
  const t = unit;
  return [
    `C${point(mid - 3 * t, 0)} ${point(mid, -t)} ${point(mid - t, t)}`,
    `C${point(mid - 2 * t, 3 * t)} ${point(mid + 2 * t, 3 * t)} ${point(mid + t, t)}`,
    `C${point(mid, -t)} ${point(mid + 3 * t, 0)} ${point(length, 0)}`,
  ].join('');
}

function piecePath(
  x0: number,
  y0: number,
  width: number,
  height: number,
  edges: PieceEdges,
  unit: number,
): string {
  const x1 = x0 + width;
  const y1 = y0 + height;
  return [
    `M${round1(x0)} ${round1(y0)}`,
    // Sentido horário: cima → direita → baixo → esquerda.
    edgeSegment(width, edges.top, unit, (a, o) => [x0 + a, y0 - o]),
    edgeSegment(height, edges.right, unit, (a, o) => [x1 + o, y0 + a]),
    edgeSegment(width, edges.bottom, unit, (a, o) => [x1 - a, y1 + o]),
    edgeSegment(height, edges.left, unit, (a, o) => [x0 - o, y1 - a]),
    'Z',
  ].join('');
}

/** Calcula todas as peças de um quebra-cabeça de `rows` × `cols`. */
export function createJigsaw(rows: number, cols: number, width = 300, height = 300): JigsawLayout {
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  // O "botãozinho" tem o mesmo tamanho em todos os lados, mesmo em peças retangulares.
  const unit = Math.min(cellWidth, cellHeight) * 0.1;
  const pad = round1(unit * 2.6 + 2);

  const pieces: PieceGeometry[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = col * cellWidth;
      const y = row * cellHeight;
      const edges = getPieceEdges(row, col, rows, cols);
      pieces.push({
        id: `${row}-${col}`,
        row,
        col,
        x,
        y,
        edges,
        path: piecePath(x, y, cellWidth, cellHeight, edges, unit),
      });
    }
  }

  return { rows, cols, width, height, cellWidth, cellHeight, pad, pieces };
}

/** `viewBox` que enquadra uma peça com a folga das saliências. */
export function pieceViewBox(layout: JigsawLayout, piece: PieceGeometry): string {
  const { pad, cellWidth, cellHeight } = layout;
  return [
    round1(piece.x - pad),
    round1(piece.y - pad),
    round1(cellWidth + pad * 2),
    round1(cellHeight + pad * 2),
  ].join(' ');
}
