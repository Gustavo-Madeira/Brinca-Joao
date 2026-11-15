import { cx } from '@/utils/cx';
import styles from './Pipo.module.css';

/** `feliz`: carinha de sempre. `festa`: olhinhos fechados de alegria. */
export type PipoMood = 'feliz' | 'festa';

const INK = '#1f2b4d';
const BODY = 'M80 10c42 0 66 34 66 74 0 40-34 74-66 76-32-2-66-36-66-76 0-40 24-74 66-74z';

/**
 * Desenho do Pipo, o balãozinho azul mascote do Brinca João.
 * Ocupa uma área de 160×220 e pode ser encaixado dentro de outros SVGs.
 */
export function PipoArt({ mood = 'feliz' }: { mood?: PipoMood }) {
  return (
    <g>
      {/* Cordinha */}
      <path
        d="M80 170c-12 14 14 24 0 38-6 6 2 10 0 12"
        fill="none"
        stroke="#7c8bae"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Nó */}
      <path d="M72 157h16l-3 13q-5 3-10 0z" fill="#2f7fdc" />
      {/* Corpo: a forma de trás faz a sombra, a da frente faz a luz */}
      <path d={BODY} fill="#3d8fe8" />
      <path d={BODY} fill="#5aa9f5" transform="translate(2.4 2.1) scale(0.92)" />
      {/* Brilho */}
      <ellipse
        cx="50"
        cy="46"
        rx="12"
        ry="19"
        transform="rotate(28 50 46)"
        fill="#ffffff"
        opacity="0.5"
      />
      {/* Bochechas */}
      <circle cx="42" cy="102" r="9" fill="#ff9eb5" opacity="0.8" />
      <circle cx="114" cy="102" r="9" fill="#ff9eb5" opacity="0.8" />
      {mood === 'festa' ? (
        <>
          <path
            d="M50 87q9-11 18 0M88 87q9-11 18 0"
            fill="none"
            stroke={INK}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path d="M62 100q16 22 32 0z" fill={INK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx="78" cy="107.5" rx="6" ry="3" fill="#ff7a93" />
        </>
      ) : (
        <>
          <ellipse cx="59" cy="84" rx="7.5" ry="9.5" fill={INK} />
          <ellipse cx="97" cy="84" rx="7.5" ry="9.5" fill={INK} />
          <circle cx="56.5" cy="80.5" r="2.8" fill="#ffffff" />
          <circle cx="94.5" cy="80.5" r="2.8" fill="#ffffff" />
          <path
            d="M64 103q14 15 28 0"
            fill="none"
            stroke={INK}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </>
      )}
    </g>
  );
}

interface PipoProps {
  mood?: PipoMood;
  className?: string;
  /** Flutua devagar (some com animações desligadas ou no modo calmo). */
  floating?: boolean;
  /** Descrição para leitores de tela. Sem ela, o desenho é só enfeite. */
  title?: string;
}

/** O mascote pronto para usar em qualquer lugar da interface. */
export function Pipo({ mood = 'feliz', className, floating, title }: PipoProps) {
  return (
    <svg
      className={cx(styles.pipo, floating && 'bj-float', className)}
      viewBox="0 0 160 220"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <PipoArt mood={mood} />
    </svg>
  );
}
