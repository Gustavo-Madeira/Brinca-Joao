import type { ReactElement } from 'react';

/**
 * Uma ilustração do Brinca João é um componente que devolve o *conteúdo* de
 * um SVG (um <g>), sempre desenhado em uma área de 120×120. Assim o mesmo
 * desenho serve sozinho (com <Art>) ou dentro de cenas maiores
 * (com <g transform="...">).
 */
export type ArtComponent = () => ReactElement;

interface ArtProps {
  art: ArtComponent;
  /** Descrição para leitores de tela. Sem ela, o desenho é tratado como enfeite. */
  title?: string;
  className?: string;
}

/** Moldura SVG de 120×120 para qualquer ilustração. */
export function Art({ art: Drawing, title, className }: ArtProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <Drawing />
    </svg>
  );
}
