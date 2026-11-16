import { Ball, Kite } from '@/illustrations/toys';
import { starPoints } from '@/utils/geometry';
import { PipoArt } from './Pipo';

const BLOCK_STAR = starPoints(0, 0, 13, 5.5);

function Flower({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 4v16" stroke="#3f9e52" strokeWidth="3" strokeLinecap="round" />
      <g fill={color}>
        <circle cx="0" cy="-6" r="5" />
        <circle cx="6" cy="-1" r="5" />
        <circle cx="4" cy="6" r="5" />
        <circle cx="-4" cy="6" r="5" />
        <circle cx="-6" cy="-1" r="5" />
      </g>
      <circle cx="0" cy="1" r="4" fill="#ffd95a" />
    </g>
  );
}

function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#ffffff">
      <ellipse cx="30" cy="30" rx="30" ry="18" />
      <ellipse cx="64" cy="20" rx="28" ry="22" />
      <ellipse cx="92" cy="32" rx="22" ry="15" />
      <rect x="14" y="30" width="86" height="18" rx="9" />
    </g>
  );
}

interface HeroSceneProps {
  className?: string;
  /** Classe aplicada só ao Pipo (para ele flutuar devagar). */
  pipoClassName?: string;
}

/**
 * Ilustração da página inicial: o Pipo flutuando sobre uma ilha no céu,
 * cheia de brinquedos. É um enfeite; o texto ao lado já diz tudo.
 */
export function HeroScene({ className, pipoClassName }: HeroSceneProps) {
  return (
    <svg className={className} viewBox="0 0 480 400" aria-hidden="true" focusable="false">
      {/* Sol */}
      <circle cx="398" cy="74" r="58" fill="#ffeba3" opacity="0.7" />
      <circle cx="398" cy="74" r="40" fill="#ffde6b" />

      <Cloud x={18} y={50} scale={1.05} />
      <Cloud x={318} y={168} scale={0.75} />

      {/* Ilha flutuante: a elipse de baixo dá a espessura */}
      <ellipse cx="240" cy="346" rx="236" ry="50" fill="#56b981" />
      <ellipse cx="240" cy="332" rx="236" ry="50" fill="#7dd6a0" />
      <ellipse cx="236" cy="326" rx="176" ry="30" fill="#a6e8c0" opacity="0.75" />

      <Flower x={62} y={318} color="#ffaecb" />
      <Flower x={204} y={346} color="#ffffff" />
      <Flower x={432} y={318} color="#c9b6ff" />

      {/* Pipa voando */}
      <g transform="translate(36 132) rotate(-16) scale(0.74)">
        <Kite />
      </g>

      {/* Blocos de montar */}
      <g transform="translate(318 296)">
        <rect x="0" y="0" width="46" height="46" rx="9" fill="#ffcf33" />
        <circle cx="23" cy="23" r="12" fill="#3d8fe8" />
        <rect x="50" y="0" width="46" height="46" rx="9" fill="#62aef5" />
        <path
          d="M73 12l12 22H61z"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <rect x="25" y="-48" width="46" height="46" rx="9" fill="#ac92f5" />
        <polygon points={BLOCK_STAR} transform="translate(48 -24)" fill="#fff6d1" />
      </g>

      {/* Bola */}
      <g transform="translate(100 304) scale(0.5)">
        <Ball />
      </g>

      {/* Pipo */}
      <g className={pipoClassName}>
        <g transform="translate(148 22) scale(1.2)">
          <PipoArt />
        </g>
      </g>
    </svg>
  );
}
