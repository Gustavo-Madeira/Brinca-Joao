/**
 * Modelo de dados do Desenho Livre.
 *
 * O desenho é guardado como uma lista de traços, com pontos em coordenadas
 * relativas (0 a 1). Vantagens: dá para desfazer, redesenhar em qualquer
 * tamanho de tela sem borrar e exportar a imagem em alta resolução.
 */

export interface Stroke {
  color: string;
  /** Espessura relativa à largura do papel (0,02 = 2% da largura). */
  size: number;
  /** Pontos em sequência: [x0, y0, x1, y1, ...], cada valor entre 0 e 1. */
  points: number[];
}

export interface Drawing {
  /** Proporção do papel (largura ÷ altura). */
  aspect: number;
  strokes: Stroke[];
}

export const PAPER_COLOR = '#ffffff';
export const DRAWING_KEY = 'desenho';

/** Limites de segurança para o que é salvo no navegador. */
const MAX_SAVED_CHARS = 1_500_000;
const MAX_STROKES = 4000;
const PRECISION = 10_000;

export interface PaletteColor {
  id: string;
  name: string;
  value: string;
  /** Cor do "✓" que marca a cor escolhida (clara ou escura, o que contrastar). */
  check: string;
}

export const PALETTE: readonly PaletteColor[] = [
  { id: 'preto', name: 'Preto', value: '#2b2f45', check: '#ffffff' },
  { id: 'vermelho', name: 'Vermelho', value: '#e5484d', check: '#ffffff' },
  { id: 'laranja', name: 'Laranja', value: '#ff8a3d', check: '#1f2b4d' },
  { id: 'amarelo', name: 'Amarelo', value: '#ffcb2e', check: '#1f2b4d' },
  { id: 'verde-claro', name: 'Verde-claro', value: '#8fd65a', check: '#1f2b4d' },
  { id: 'verde', name: 'Verde', value: '#2f9e5b', check: '#ffffff' },
  { id: 'azul-claro', name: 'Azul-claro', value: '#62c3f5', check: '#1f2b4d' },
  { id: 'azul', name: 'Azul', value: '#2f80ed', check: '#ffffff' },
  { id: 'roxo', name: 'Roxo', value: '#8b5cf6', check: '#ffffff' },
  { id: 'rosa', name: 'Rosa', value: '#f472b6', check: '#1f2b4d' },
  { id: 'marrom', name: 'Marrom', value: '#9a6b4a', check: '#ffffff' },
  { id: 'cinza', name: 'Cinza', value: '#9aa3b2', check: '#1f2b4d' },
];

export type BrushSizeId = 'fino' | 'medio' | 'grosso';

export interface BrushSize {
  id: BrushSizeId;
  name: string;
  /** Espessura relativa à largura do papel. */
  value: number;
}

export const BRUSH_SIZES: readonly BrushSize[] = [
  { id: 'fino', name: 'Fino', value: 0.008 },
  { id: 'medio', name: 'Médio', value: 0.02 },
  { id: 'grosso', name: 'Grosso', value: 0.045 },
];

/** A borracha é um pouco mais larga que o pincel do mesmo tamanho. */
export const ERASER_SCALE = 1.8;

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/** Desenha um traço completo, com curvas suaves entre os pontos. */
export function drawStroke(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  width: number,
  height: number,
): void {
  const { points } = stroke;
  const count = points.length / 2;
  if (count < 1) return;

  const lineWidth = Math.max(1, stroke.size * width);
  const px = (index: number) => (points[index * 2] ?? 0) * width;
  const py = (index: number) => (points[index * 2 + 1] ?? 0) * height;

  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (count === 1) {
    ctx.beginPath();
    ctx.arc(px(0), py(0), lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(px(0), py(0));
  for (let i = 1; i < count - 1; i += 1) {
    const midX = (px(i) + px(i + 1)) / 2;
    const midY = (py(i) + py(i + 1)) / 2;
    ctx.quadraticCurveTo(px(i), py(i), midX, midY);
  }
  ctx.lineTo(px(count - 1), py(count - 1));
  ctx.stroke();
}

/** Desenha só o último trecho de um traço em andamento (rápido, enquanto o dedo se move). */
export function drawLastSegment(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  width: number,
  height: number,
): void {
  const { points } = stroke;
  const count = points.length / 2;
  if (count < 2) {
    drawStroke(ctx, stroke, width, height);
    return;
  }
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = Math.max(1, stroke.size * width);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo((points[points.length - 4] ?? 0) * width, (points[points.length - 3] ?? 0) * height);
  ctx.lineTo((points[points.length - 2] ?? 0) * width, (points[points.length - 1] ?? 0) * height);
  ctx.stroke();
}

/** Limpa o papel e redesenha todos os traços. */
export function drawAll(
  ctx: CanvasRenderingContext2D,
  strokes: readonly Stroke[],
  width: number,
  height: number,
): void {
  ctx.fillStyle = PAPER_COLOR;
  ctx.fillRect(0, 0, width, height);
  for (const stroke of strokes) drawStroke(ctx, stroke, width, height);
}

/**
 * Transforma o desenho em texto para guardar no navegador. Os pontos viram
 * números inteiros (ocupam menos espaço). Devolve `null` se o desenho for
 * grande demais para ser salvo com segurança.
 */
export function serializeDrawing(drawing: Drawing): string | null {
  const compact = {
    v: 1,
    aspect: drawing.aspect,
    strokes: drawing.strokes.map((stroke) => ({
      c: stroke.color,
      s: stroke.size,
      p: stroke.points.map((value) => Math.round(clamp01(value) * PRECISION)),
    })),
  };
  const text = JSON.stringify(compact);
  return text.length > MAX_SAVED_CHARS ? null : text;
}

function isColor(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
}

/** Lê um desenho salvo, descartando qualquer coisa fora do formato esperado. */
export function parseDrawing(raw: unknown): Drawing | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const data = raw as Record<string, unknown>;
  if (data.v !== 1 || !Array.isArray(data.strokes)) return null;

  const aspect =
    typeof data.aspect === 'number' && data.aspect >= 0.5 && data.aspect <= 2 ? data.aspect : 1;

  const strokes: Stroke[] = [];
  for (const item of data.strokes.slice(0, MAX_STROKES)) {
    if (typeof item !== 'object' || item === null) continue;
    const entry = item as Record<string, unknown>;
    if (!isColor(entry.c) || typeof entry.s !== 'number' || !Array.isArray(entry.p)) continue;
    if (!(entry.s > 0 && entry.s <= 0.2)) continue;
    if (entry.p.length < 2 || entry.p.length % 2 !== 0) continue;
    if (!entry.p.every((value) => typeof value === 'number' && Number.isFinite(value))) continue;
    strokes.push({
      color: entry.c,
      size: entry.s,
      points: (entry.p as number[]).map((value) => clamp01(value / PRECISION)),
    });
  }

  return { aspect, strokes };
}
