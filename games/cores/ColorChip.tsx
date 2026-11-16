import type { ReactElement } from 'react';
import { starPoints } from '@/utils/geometry';
import { capitalize } from './colors';
import type { ColorDef, SymbolId } from './colors';
import styles from './ColorChip.module.css';

const STAR = starPoints(12, 12.5, 10, 4.4);

/** Desenhos dos símbolos, em uma grade de 24×24. */
const SYMBOLS: Record<SymbolId, ReactElement> = {
  coracao: (
    <path d="M12 20.3s-7.8-4.7-7.8-10.3A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 7.8 2.7c0 5.6-7.8 10.3-7.8 10.3z" />
  ),
  gota: <path d="M12 2.5c4.2 5.6 6.6 9 6.6 12.3a6.6 6.6 0 0 1-13.2 0c0-3.3 2.4-6.7 6.6-12.3z" />,
  estrela: <polygon points={STAR} />,
  folha: <path d="M4.5 19.5C3.5 10 9 4.5 19.5 4.5c0 10.5-6 16-15 15z" />,
  circulo: <circle cx="12" cy="12" r="8.5" />,
  losango: <path d="M12 2l8.5 10-8.5 10-8.5-10z" />,
  cruz: <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />,
  quadrado: <rect x="4" y="4" width="16" height="16" rx="2.5" />,
  lua: <path d="M20 14.3A8.3 8.3 0 1 1 9.7 4 6.6 6.6 0 0 0 20 14.3z" />,
  nuvem: <path d="M7 19a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.6 1.4A3.8 3.8 0 0 1 17.5 19z" />,
};

interface ColorSymbolProps {
  symbol: SymbolId;
  /** Tamanho em rem. */
  size?: number;
}

export function ColorSymbol({ symbol, size = 1.125 }: ColorSymbolProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={`${size}rem`}
      height={`${size}rem`}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0 }}
    >
      {SYMBOLS[symbol]}
    </svg>
  );
}

/**
 * Etiqueta "símbolo + nome da cor". O símbolo de cada cor é sempre o mesmo,
 * então dá para combinar as figuras pelo símbolo, pelo nome ou pela cor.
 */
export function ColorChip({ color, className }: { color: ColorDef; className?: string }) {
  return (
    <span className={className ? `${styles.chip} ${className}` : styles.chip}>
      <ColorSymbol symbol={color.symbol} />
      <span>{capitalize(color.name)}</span>
    </span>
  );
}
