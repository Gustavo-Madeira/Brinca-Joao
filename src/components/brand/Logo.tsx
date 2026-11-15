import { Icon } from '@/components/ui/Icon';
import { cx } from '@/utils/cx';
import { PipoArt } from './Pipo';
import styles from './Logo.module.css';

interface LogoProps {
  size?: 'sm' | 'lg';
  /** Esconde o balãozinho (quando o Pipo já aparece grande ao lado). */
  hideMark?: boolean;
  className?: string;
}

/** Logotipo "Brinca João 💙": o texto é texto de verdade, legível por leitores de tela. */
export function Logo({ size = 'sm', hideMark, className }: LogoProps) {
  return (
    <span className={cx(styles.logo, styles[size], className)}>
      {!hideMark && (
        <svg className={styles.mark} viewBox="0 0 160 220" aria-hidden="true" focusable="false">
          <PipoArt />
        </svg>
      )}
      <span className={styles.word}>
        <span className={styles.brinca}>Brinca</span>{' '}
        <span className={styles.joao}>
          João
          <svg
            className={styles.underline}
            viewBox="0 0 120 12"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M4 8c30-6 82-6 112-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </span>
      <Icon name="heart" className={styles.heart} size={size === 'lg' ? 2.25 : 1.125} />
    </span>
  );
}
