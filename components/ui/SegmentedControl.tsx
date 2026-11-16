import { useId } from 'react';
import type { ReactNode } from 'react';
import { cx } from '@/utils/cx';
import { Icon } from './Icon';
import styles from './SegmentedControl.module.css';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  /** Símbolo que acompanha o texto (bolinhas, letras de tamanhos diferentes...). */
  symbol?: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  legend: string;
  description?: string;
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange: (value: T) => void;
  /** Versão menor, usada dentro dos jogos. */
  compact?: boolean;
}

/**
 * Escolha única entre poucas opções. Por baixo são botões de rádio de
 * verdade: as setas do teclado e os leitores de tela funcionam sozinhos.
 * A opção marcada ganha cor, borda mais grossa e um "✓".
 */
export function SegmentedControl<T extends string>({
  legend,
  description,
  options,
  value,
  onChange,
  compact,
}: SegmentedControlProps<T>) {
  const name = useId();
  const descriptionId = useId();

  return (
    <fieldset
      className={cx(styles.group, compact && styles.compact)}
      aria-describedby={description ? descriptionId : undefined}
    >
      <legend className={styles.legend}>{legend}</legend>
      {description && (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      )}
      <div className={styles.options}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <label key={option.value} className={styles.option}>
              <input
                type="radio"
                className={styles.input}
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
              />
              <span className={cx(styles.face, selected && styles.selected)}>
                {option.symbol && (
                  <span className={styles.symbol} aria-hidden="true">
                    {option.symbol}
                  </span>
                )}
                <span className={styles.label}>
                  {selected && <Icon name="check" size={1.125} className={styles.check} />}
                  {option.label}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
