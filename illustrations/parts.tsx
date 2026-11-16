/** Pecinhas de rosto compartilhadas: mantêm todos os personagens com o mesmo jeitinho. */

export const INK = '#2b2f45';
export const BLUSH = '#ff9eb5';

interface EyeProps {
  cx: number;
  cy: number;
  r?: number;
}

/** Olho oval com um brilho branco. */
export function Eye({ cx, cy, r = 5 }: EyeProps) {
  return (
    <>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 1.15} fill={INK} />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.4} r={r * 0.36} fill="#ffffff" />
    </>
  );
}

interface PairProps {
  y: number;
  x1: number;
  x2: number;
  r?: number;
}

export function Eyes({ y, x1, x2, r = 5 }: PairProps) {
  return (
    <>
      <Eye cx={x1} cy={y} r={r} />
      <Eye cx={x2} cy={y} r={r} />
    </>
  );
}

/** Bochechas rosadas. */
export function Cheeks({ y, x1, x2, r = 7, color = BLUSH }: PairProps & { color?: string }) {
  return (
    <>
      <circle cx={x1} cy={y} r={r} fill={color} opacity="0.6" />
      <circle cx={x2} cy={y} r={r} fill={color} opacity="0.6" />
    </>
  );
}

/** Boquinha de bicho: um tracinho para baixo e dois arcos (como um "w" macio). */
export function Muzzle({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  const s = size;
  return (
    <path
      d={`M${x} ${y}v${3 * s}m0 0q${-5 * s} ${5 * s} ${-10 * s} ${1 * s}m${10 * s} ${-1 * s}q${5 * s} ${5 * s} ${10 * s} ${1 * s}`}
      fill="none"
      stroke={INK}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
