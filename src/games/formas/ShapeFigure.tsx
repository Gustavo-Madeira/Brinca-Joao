import type { ReactElement, SVGProps } from 'react';
import { regularPolygonPoints, starPoints } from '@/utils/geometry';
import type { PieceColor, ShapeId } from './shapes';

const STAR = starPoints(50, 53, 44, 19);
const HEXAGON = regularPolygonPoints(50, 50, 43, 6, 30);
const PENTAGON = regularPolygonPoints(50, 53, 44, 5);

type Paint = Pick<
  SVGProps<SVGElement>,
  'fill' | 'stroke' | 'strokeWidth' | 'strokeDasharray' | 'opacity'
>;

/** Desenha uma forma dentro de uma área de 100×100. */
function shapeElement(id: ShapeId, paint: Paint): ReactElement {
  const common = { strokeLinejoin: 'round', strokeLinecap: 'round', ...paint } as const;
  switch (id) {
    case 'circulo':
      return <circle cx="50" cy="50" r="40" {...common} />;
    case 'quadrado':
      return <rect x="13" y="13" width="74" height="74" rx="9" {...common} />;
    case 'triangulo':
      return <path d="M50 14l40 70H10z" {...common} />;
    case 'estrela':
      return <polygon points={STAR} {...common} />;
    case 'coracao':
      return (
        <path
          d="M50 88C22 68 8 52 8 34a21 21 0 0 1 42-4 21 21 0 0 1 42 4c0 18-14 34-42 54z"
          {...common}
        />
      );
    case 'retangulo':
      return <rect x="6" y="27" width="88" height="46" rx="8" {...common} />;
    case 'losango':
      return <path d="M50 8l36 42-36 42-36-42z" {...common} />;
    case 'hexagono':
      return <polygon points={HEXAGON} {...common} />;
    case 'oval':
      return <ellipse cx="50" cy="50" rx="44" ry="27" {...common} />;
    case 'pentagono':
      return <polygon points={PENTAGON} {...common} />;
    case 'lua':
      return <path d="M66 12a40 40 0 1 0 22 54 30 30 0 0 1-22-54z" {...common} />;
    case 'cruz':
      return <path d="M37 10h26v27h27v26H63v27H37V63H10V37h27z" {...common} />;
  }
}

interface ShapeFigureProps {
  shape: ShapeId;
  /** Peça colorida ou só o contorno tracejado do lugar vazio. */
  variant: 'peca' | 'lugar';
  color?: PieceColor;
  /** No lugar vazio: mostra uma sombra da cor da peça (ajuda do nível fácil). */
  tintHint?: boolean;
  className?: string;
}

/** Forma pronta para a tela: peça colorida ou lugar vazio. */
export function ShapeFigure({ shape, variant, color, tintHint, className }: ShapeFigureProps) {
  let paint: Paint;
  if (variant === 'peca') {
    paint = { fill: color?.fill ?? '#62aef5', stroke: color?.stroke ?? '#2670d3', strokeWidth: 4 };
  } else if (tintHint && color) {
    paint = {
      fill: color.fill,
      opacity: 0.4,
      stroke: color.stroke,
      strokeWidth: 3.5,
      strokeDasharray: '7 7',
    };
  } else {
    paint = { fill: '#e3eaf5', stroke: '#7c8bae', strokeWidth: 3.5, strokeDasharray: '7 7' };
  }

  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {shapeElement(shape, paint)}
    </svg>
  );
}
