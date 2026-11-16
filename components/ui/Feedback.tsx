import { cx } from '@/utils/cx';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import styles from './Feedback.module.css';

/**
 * - `neutro`: orientação ("Toque em uma peça").
 * - `acerto`: comemoração curta.
 * - `carinho`: quando não deu certo — sempre um convite, nunca uma bronca.
 */
export type FeedbackTone = 'neutro' | 'acerto' | 'carinho';

const TONE_ICON: Record<FeedbackTone, IconName> = {
  neutro: 'sparkle',
  acerto: 'star',
  carinho: 'heart',
};

interface FeedbackProps {
  message: string;
  tone?: FeedbackTone;
  className?: string;
}

/**
 * Faixa de mensagem dos jogos. Fica sempre na tela (não some sozinha, então
 * ninguém precisa ler com pressa) e é anunciada por leitores de tela.
 */
export function Feedback({ message, tone = 'neutro', className }: FeedbackProps) {
  return (
    <p
      className={cx(styles.feedback, styles[tone], !message && styles.empty, className)}
      role="status"
      aria-live="polite"
    >
      {message && (
        <>
          <Icon name={TONE_ICON[tone]} size={1.375} className={styles.icon} />
          <span>{message}</span>
        </>
      )}
    </p>
  );
}
