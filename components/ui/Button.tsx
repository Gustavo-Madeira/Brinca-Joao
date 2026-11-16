import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';
import { Link } from 'wouter';
import { cx } from '@/utils/cx';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost';
export type ButtonSize = 'md' | 'lg' | 'xl';

interface SharedProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ícone antes do texto. */
  icon?: IconName;
  /** Ícone depois do texto. */
  iconEnd?: IconName;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

const ICON_SIZE: Record<ButtonSize, number> = { md: 1.375, lg: 1.625, xl: 1.875 };

function classes({ variant = 'secondary', size = 'md', fullWidth, className }: SharedProps) {
  return cx(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className,
  );
}

function Content({ icon, iconEnd, size = 'md', children }: SharedProps) {
  return (
    <>
      {icon && <Icon name={icon} size={ICON_SIZE[size]} />}
      <span>{children}</span>
      {iconEnd && <Icon name={iconEnd} size={ICON_SIZE[size]} />}
    </>
  );
}

// `ComponentProps<'button'>` inclui `ref`: no React 19 ela chega como uma prop comum.
type ButtonProps = SharedProps & Omit<ComponentProps<'button'>, 'className' | 'children'>;

/** Botão grande e arredondado, com área de toque confortável. */
export function Button(props: ButtonProps) {
  const { variant, size, icon, iconEnd, fullWidth, className, children, type, ...rest } = props;
  const shared = { variant, size, icon, iconEnd, fullWidth, className, children };
  return (
    <button type={type ?? 'button'} className={classes(shared)} {...rest}>
      <Content {...shared} />
    </button>
  );
}

interface LinkButtonProps extends SharedProps {
  to: string;
  'aria-label'?: string;
  onPointerEnter?: () => void;
  onFocus?: () => void;
}

/** Link de navegação com aparência de botão. */
export function LinkButton(props: LinkButtonProps) {
  const { to, onPointerEnter, onFocus, 'aria-label': ariaLabel, ...shared } = props;
  return (
    <Link
      href={to}
      className={classes(shared)}
      aria-label={ariaLabel}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
    >
      <Content {...shared} />
    </Link>
  );
}

interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children' | 'aria-label'> {
  icon: IconName;
  /** Nome acessível obrigatório: o ícone sozinho não fala. */
  label: string;
  variant?: ButtonVariant;
  className?: string;
}

/** Botão só com ícone (sempre com nome acessível e dica de texto). */
export function IconButton({ icon, label, variant = 'soft', className, type, ...rest }: IconButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={cx(styles.button, styles[variant], styles.iconOnly, className)}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon name={icon} size={1.625} />
    </button>
  );
}
