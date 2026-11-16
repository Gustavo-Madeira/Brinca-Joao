import type { ReactNode } from 'react';
import { Cat, Dog, Duck } from '@/illustrations/animals';
import { Apple } from '@/illustrations/fruits';
import { starPoints } from '@/utils/geometry';
import { createJigsaw } from './quebra-cabeca/jigsaw';

/*
 * Ilustrações dos cartões de jogo (200×140). São enfeites: o nome e a
 * descrição do jogo já estão em texto no cartão.
 */

interface ThumbProps {
  className?: string;
}

function Frame({ className, children }: ThumbProps & { children: ReactNode }) {
  return (
    <svg className={className} viewBox="0 0 200 140" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

/** Mundo das Cores: paleta de pintura com pincel. */
export function ColorsThumb({ className }: ThumbProps) {
  return (
    <Frame className={className}>
      <path
        d="M96 20c44 0 78 22 78 52 0 22-18 34-38 30-12-2-20 4-18 14 2 10-8 14-22 14-44 0-78-24-78-56S52 20 96 20z"
        fill="#f6dcb4"
        stroke="#dcb988"
        strokeWidth="3"
      />
      <ellipse cx="144" cy="80" rx="10" ry="8.5" fill="#ffffff" stroke="#dcb988" strokeWidth="3" />
      <circle cx="58" cy="60" r="13" fill="#f0524f" />
      <circle cx="88" cy="44" r="13" fill="#ffcf33" />
      <circle cx="122" cy="46" r="13" fill="#5fcb8e" />
      <circle cx="52" cy="92" r="13" fill="#62aef5" />
      <circle cx="84" cy="108" r="13" fill="#ac92f5" />
      {/* Pincel */}
      <path d="M150 128l36-40" stroke="#c98b55" strokeWidth="8" strokeLinecap="round" />
      <path d="M146 132l7-8" stroke="#9aa7bd" strokeWidth="10" strokeLinecap="round" />
      <path d="M148 127q-11 0-15 11 11 2 19-6z" fill="#f0524f" />
    </Frame>
  );
}

const SHAPES_STAR = starPoints(152, 100, 30, 13);

/** Encaixe as Formas: círculo, quadrado, triângulo e estrela. */
export function ShapesThumb({ className }: ThumbProps) {
  return (
    <Frame className={className}>
      <circle cx="54" cy="52" r="32" fill="#62aef5" />
      <rect
        x="104"
        y="14"
        width="58"
        height="58"
        rx="11"
        transform="rotate(8 133 43)"
        fill="#ffcf33"
      />
      <path
        d="M70 88l30 40H40z"
        fill="#5fcb8e"
        stroke="#5fcb8e"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <polygon
        points={SHAPES_STAR}
        fill="#ac92f5"
        stroke="#ac92f5"
        strokeWidth="6"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

const CARD_STAR = starPoints(0, 0, 14, 6);

/** Jogo da Memória: uma carta virada e um par de maçãs. */
export function MemoryThumb({ className }: ThumbProps) {
  return (
    <Frame className={className}>
      <g transform="translate(46 72) rotate(-10)">
        <rect x="-30" y="-40" width="60" height="80" rx="11" fill="#62aef5" />
        <rect
          x="-24"
          y="-34"
          width="48"
          height="68"
          rx="7"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          opacity="0.6"
        />
        <polygon points={CARD_STAR} fill="#ffd95a" />
      </g>
      <g transform="translate(104 68)">
        <rect
          x="-30"
          y="-40"
          width="60"
          height="80"
          rx="11"
          fill="#ffffff"
          stroke="#c9d3e6"
          strokeWidth="3"
        />
        <g transform="translate(-24 -24) scale(0.4)">
          <Apple />
        </g>
      </g>
      <g transform="translate(160 74) rotate(8)">
        <rect
          x="-30"
          y="-40"
          width="60"
          height="80"
          rx="11"
          fill="#ffffff"
          stroke="#c9d3e6"
          strokeWidth="3"
        />
        <g transform="translate(-24 -24) scale(0.4)">
          <Apple />
        </g>
      </g>
    </Frame>
  );
}

const THUMB_JIGSAW = createJigsaw(2, 2, 104, 104);
const THUMB_PIECE_COLORS = ['#62aef5', '#ffcf33', '#5fcb8e', '#ac92f5'];

/** Quebra-Cabeça do João: quatro peças, uma delas chegando para encaixar. */
export function PuzzleThumb({ className }: ThumbProps) {
  return (
    <Frame className={className}>
      <g transform="translate(34 20)">
        {THUMB_JIGSAW.pieces.map((piece, index) => (
          <path
            key={piece.id}
            d={piece.path}
            fill={THUMB_PIECE_COLORS[index]}
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinejoin="round"
            // A peça de cima, à direita, está "a caminho" do lugar.
            transform={index === 1 ? 'translate(34 -4) rotate(12 78 26)' : undefined}
          />
        ))}
      </g>
    </Frame>
  );
}

/** Descubra os Animais: cachorro, gato e pato. */
export function AnimalsThumb({ className }: ThumbProps) {
  return (
    <Frame className={className}>
      <g transform="translate(6 46) scale(0.62)">
        <Cat />
      </g>
      <g transform="translate(122 46) scale(0.62)">
        <Duck />
      </g>
      <g transform="translate(46 10) scale(0.9)">
        <Dog />
      </g>
    </Frame>
  );
}

function Crayon({ color, dark, transform }: { color: string; dark: string; transform: string }) {
  return (
    <g transform={transform}>
      <path d="M-8 -28L0 -46l8 18z" fill={color} stroke={color} strokeWidth="3" strokeLinejoin="round" />
      <rect x="-10" y="-28" width="20" height="60" rx="4" fill={color} />
      <rect x="-10" y="-10" width="20" height="24" fill={dark} />
    </g>
  );
}

/** Desenho Livre: rabiscos coloridos e gizes de cera. */
export function DrawingThumb({ className }: ThumbProps) {
  return (
    <Frame className={className}>
      <path
        d="M16 86c10-44 26-48 36-16s24 36 38 2 28-40 40-10"
        fill="none"
        stroke="#62aef5"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M24 30q8-14 16 0t16 0"
        fill="none"
        stroke="#ffcf33"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M34 122q20-12 40 0"
        fill="none"
        stroke="#5fcb8e"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <Crayon color="#f0524f" dark="#c93c3a" transform="translate(132 86) rotate(-18)" />
      <Crayon color="#ac92f5" dark="#8b6ce0" transform="translate(156 84) rotate(2)" />
      <Crayon color="#ff9838" dark="#e67c1c" transform="translate(180 88) rotate(20)" />
    </Frame>
  );
}
