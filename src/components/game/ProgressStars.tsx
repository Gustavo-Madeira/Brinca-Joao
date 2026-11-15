import { Icon } from '@/components/ui/Icon';
import { cx } from '@/utils/cx';
import styles from './ProgressStars.module.css';

interface ProgressStarsProps {
  /** Quantas estrelas já foram conquistadas. */
  done: number;
  total: number;
  /** O que as estrelas contam, por exemplo "rodadas" ou "pares". */
  label: string;
}

/**
 * Fileira de estrelas: cada acerto acende uma. Só soma, nunca tira —
 * é um incentivo, não um placar.
 */
export function ProgressStars({ done, total, label }: ProgressStarsProps) {
  return (
    <div className={styles.stars} role="img" aria-label={`${done} de ${total} ${label}`}>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={cx(styles.star, index < done && styles.on)}>
          <Icon name="star" size={1.625} />
        </span>
      ))}
    </div>
  );
}
