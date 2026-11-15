import { round1 } from '@/utils/geometry';
import type { ColorDef } from './colors';
import type { ObjectDef, Tint } from './objects';

/*
 * Figuras "pintáveis" do Mundo das Cores (120×120).
 * Cada figura usa só os três tons da cor recebida, mais cinza e preto
 * neutros — assim uma flor vermelha não tem caule verde para confundir.
 */

const INK = '#2b2f45';
const GREY = '#7c8bae';

export function Balloon({ base, dark, light }: Tint) {
  return (
    <g>
      <path
        d="M60 100c-4 7 5 9 0 18"
        fill="none"
        stroke={GREY}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M54 92h12l-2 9h-8z" fill={dark} />
      <path
        d="M60 10c22 0 36 18 36 41 0 23-18 41-36 43-18-2-36-20-36-43 0-23 14-41 36-41z"
        fill={base}
        stroke={dark}
        strokeWidth="2.5"
      />
      <ellipse cx="45" cy="34" rx="6" ry="11" transform="rotate(28 45 34)" fill={light} opacity="0.85" />
    </g>
  );
}

export function Fish({ base, dark, light }: Tint) {
  return (
    <g>
      <path d="M86 60l24-21v42z" fill={dark} stroke={dark} strokeWidth="4" strokeLinejoin="round" />
      <path d="M40 36q16-18 34 0z" fill={dark} />
      <ellipse cx="54" cy="60" rx="41" ry="28" fill={base} stroke={dark} strokeWidth="2.5" />
      <path
        d="M62 36q10 24 0 48M76 42q7 18 0 36"
        fill="none"
        stroke={dark}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <ellipse cx="44" cy="74" rx="12" ry="5" fill={light} opacity="0.7" />
      <circle cx="33" cy="53" r="7.5" fill="#ffffff" stroke={dark} strokeWidth="1.5" />
      <circle cx="32" cy="53" r="3.6" fill={INK} />
    </g>
  );
}

export function ToyCar({ base, dark, light }: Tint) {
  return (
    <g>
      <path
        d="M12 74V62q0-7 8-9l15-3 11-17q4-6 12-6h20q8 0 12 7l9 17q11 2 11 11v12q0 6-6 6H18q-6 0-6-6z"
        fill={base}
        stroke={dark}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M50 35h15v16H40z" fill="#f1f4f9" stroke={dark} strokeWidth="2" strokeLinejoin="round" />
      <path d="M71 35h8l8 16H71z" fill="#f1f4f9" stroke={dark} strokeWidth="2" strokeLinejoin="round" />
      <rect x="99" y="59" width="9" height="8" rx="3" fill={light} stroke={dark} strokeWidth="1.5" />
      <circle cx="36" cy="82" r="13" fill={INK} />
      <circle cx="36" cy="82" r="5.5" fill="#d8dce8" />
      <circle cx="86" cy="82" r="13" fill={INK} />
      <circle cx="86" cy="82" r="5.5" fill="#d8dce8" />
    </g>
  );
}

export function Shirt({ base, dark, light }: Tint) {
  return (
    <g>
      <path
        d="M42 18L20 28 6 52l18 10 10-10v50h52V52l10 10 18-10-14-24-22-10q-18 14-36 0z"
        fill={base}
        stroke={dark}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M42 18q18 14 36 0" fill="none" stroke={dark} strokeWidth="5" strokeLinecap="round" />
      <rect x="64" y="56" width="14" height="14" rx="3" fill={light} stroke={dark} strokeWidth="2" />
    </g>
  );
}

const PETALS = Array.from({ length: 6 }, (_, index) => {
  const angle = (index / 6) * Math.PI * 2 - Math.PI / 2;
  return { x: round1(60 + Math.cos(angle) * 27), y: round1(60 + Math.sin(angle) * 27) };
});

export function Flower({ base, dark, light }: Tint) {
  return (
    <g>
      {/* Contorno primeiro, miolo depois: sobra só a linha de fora das pétalas. */}
      {PETALS.map((petal) => (
        <circle
          key={`o-${petal.x}-${petal.y}`}
          cx={petal.x}
          cy={petal.y}
          r="18"
          fill={base}
          stroke={dark}
          strokeWidth="5"
        />
      ))}
      {PETALS.map((petal) => (
        <circle key={`i-${petal.x}-${petal.y}`} cx={petal.x} cy={petal.y} r="18" fill={base} />
      ))}
      <circle cx="60" cy="60" r="15" fill={light} stroke={dark} strokeWidth="2.5" />
    </g>
  );
}

export function Butterfly({ base, dark, light }: Tint) {
  return (
    <g>
      <g fill={base} stroke={dark} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M58 58C44 22 10 20 12 46c1 14 22 20 46 16z" />
        <path d="M62 58C76 22 110 20 108 46c-1 14-22 20-46 16z" />
        <path d="M58 64c-22-2-38 8-34 24 4 14 28 10 34-12z" />
        <path d="M62 64c22-2 38 8 34 24-4 14-28 10-34-12z" />
      </g>
      <g fill={light}>
        <circle cx="32" cy="44" r="7" />
        <circle cx="88" cy="44" r="7" />
        <circle cx="40" cy="82" r="5" />
        <circle cx="80" cy="82" r="5" />
      </g>
      <path
        d="M58 40q-6-14-14-16M62 40q6-14 14-16"
        fill="none"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect x="56" y="38" width="8" height="54" rx="4" fill={INK} />
    </g>
  );
}

export function Umbrella({ base, dark, light }: Tint) {
  return (
    <g>
      <path
        d="M60 58v40q0 10-9 10t-9-8"
        fill="none"
        stroke={INK}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M60 18v-8" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path
        d="M12 62C14 34 34 16 60 16s46 18 48 46q-8-8-16 0-8-8-16 0-8-8-16 0-8-8-16 0-8-8-16 0-8-8-16 0z"
        fill={base}
        stroke={dark}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M60 16v40M60 16Q42 30 44 56M60 16q18 14 16 40"
        fill="none"
        stroke={dark}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.65"
      />
      <ellipse cx="38" cy="38" rx="5" ry="10" transform="rotate(38 38 38)" fill={light} opacity="0.8" />
    </g>
  );
}

export function Bucket({ base, dark, light }: Tint) {
  return (
    <g>
      <path
        d="M26 44C26 12 94 12 94 44"
        fill="none"
        stroke={GREY}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M22 42h76l-9 58q-1 6-7 6H38q-6 0-7-6z"
        fill={base}
        stroke={dark}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <ellipse cx="60" cy="42" rx="38" ry="7" fill={dark} />
      <path d="M26 62h68" stroke={dark} strokeWidth="5" opacity="0.5" />
      <path d="M36 70l3 24" stroke={light} strokeWidth="5" strokeLinecap="round" opacity="0.85" />
    </g>
  );
}

interface TintedObjectProps {
  object: ObjectDef;
  color: ColorDef;
  className?: string;
  /** Descrição para leitores de tela (quando a figura não está dentro de um botão já rotulado). */
  title?: string;
}

/** Uma figura pintada com uma das cores do jogo. */
export function TintedObject({ object, color, className, title }: TintedObjectProps) {
  const Drawing = object.art;
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <Drawing base={color.base} dark={color.dark} light={color.light} />
    </svg>
  );
}
