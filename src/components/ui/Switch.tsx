import { useId } from 'react';
import { cx } from '@/utils/cx';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import styles from './Switch.module.css';

interface SwitchRowProps {
  label: string;
  description?: string;
  icon?: IconName;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Mostra o interruptor travado, com a explicação em `description`. */
  disabled?: boolean;
}

/**
 * Linha de configuração com interruptor liga/desliga.
 * A linha inteira é o botão (área de toque enorme) e o estado aparece de
 * três formas: posição da bolinha, cor e as palavras "Ligado"/"Desligado".
 */
export function SwitchRow({ label, description, icon, checked, onChange, disabled }: SwitchRowProps) {
  const labelId = useId();
  const descriptionId = useId();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelId}
      aria-describedby={description ? descriptionId : undefined}
      aria-disabled={disabled || undefined}
      className={cx(styles.row, checked && styles.on, disabled && styles.disabled)}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
    >
      {icon && (
        <span className={styles.icon}>
          <Icon name={icon} size={1.625} />
        </span>
      )}
      <span className={styles.text}>
        <span id={labelId} className={styles.label}>
          {label}
        </span>
        {description && (
          <span id={descriptionId} className={styles.description}>
            {description}
          </span>
        )}
      </span>
      <span className={styles.control} aria-hidden="true">
        <span className={styles.track}>
          <span className={styles.thumb}>{checked && <Icon name="check" size={1} />}</span>
        </span>
        <span className={styles.state}>{checked ? 'Ligado' : 'Desligado'}</span>
      </span>
    </button>
  );
}
