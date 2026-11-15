import { useEffect, useId, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Pipo } from '@/components/brand/Pipo';
import { useSettings } from '@/hooks/useSettings';
import { cx } from '@/utils/cx';
import { Icon } from './Icon';
import styles from './Celebration.module.css';

const CONFETTI_COLORS = ['#62aef5', '#ffcf33', '#5fcb8e', '#ac92f5', '#ffaecb', '#ffbf96'];
const CONFETTI_COUNT = 18;

/** Chuva curta e lenta de papeizinhos. Só existe com as animações ligadas. */
function Confetti() {
  const pieces = Array.from({ length: CONFETTI_COUNT }, (_, index) => {
    // Valores variados, mas sempre os mesmos: nada de sorteio durante o desenho da tela.
    const left = ((index * 37 + 11) % 96) + 2;
    const delay = ((index * 53) % 9) * 0.09;
    const duration = 2.6 + ((index * 29) % 7) * 0.16;
    const drift = ((index % 5) - 2) * 0.9;
    const spin = (index % 2 === 0 ? 1 : -1) * (140 + ((index * 41) % 120));
    const style = {
      left: `${left}%`,
      backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      borderRadius: index % 3 === 0 ? '50%' : '0.1875rem',
      '--drift': `${drift}rem`,
      '--spin': `${spin}deg`,
    } as CSSProperties;
    return <span key={index} className={styles.piece} style={style} />;
  });

  return (
    <div className={styles.confetti} aria-hidden="true">
      {pieces}
    </div>
  );
}

interface CelebrationProps {
  title: string;
  message?: string;
  /** Botões: jogar de novo, outros jogos... */
  children: ReactNode;
  /** Empilha o painel mesmo em telas largas (para colunas estreitas). */
  stacked?: boolean;
}

/**
 * Comemoração discreta ao concluir uma brincadeira: o Pipo sorri, três
 * estrelas aparecem e (se as animações estiverem ligadas) cai um pouco de
 * confete, sem som alto e sem tomar a tela inteira.
 */
export function Celebration({ title, message, children, stacked }: CelebrationProps) {
  const { motionEnabled } = useSettings();
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Leva o foco para o título: leitores de tela anunciam a conquista e os
  // botões ficam a um Tab de distância.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    const panel = panelRef.current;
    if (panel && typeof panel.scrollIntoView === 'function') {
      const smooth = document.documentElement.dataset.motion === 'on';
      panel.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'nearest' });
    }
  }, []);

  return (
    <section
      ref={panelRef}
      className={cx(styles.panel, stacked && styles.stacked, 'bj-rise-in')}
      aria-labelledby={titleId}
    >
      {motionEnabled && <Confetti />}
      <Pipo mood="festa" className={styles.pipo} />
      <div className={styles.content}>
        <div className={styles.stars} aria-hidden="true">
          <Icon name="star" size={1.75} className={`${styles.star} bj-pop-in`} />
          <Icon name="star" size={2.25} className={`${styles.star} bj-pop-in`} />
          <Icon name="star" size={1.75} className={`${styles.star} bj-pop-in`} />
        </div>
        <h2 ref={headingRef} id={titleId} className={styles.title} tabIndex={-1}>
          {title}
        </h2>
        {message && <p className={styles.message}>{message}</p>}
        <div className={styles.actions}>{children}</div>
      </div>
    </section>
  );
}
