import { useEffect, useId, useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from './Button';
import styles from './Modal.module.css';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Botões de ação, mostrados no rodapé do diálogo. */
  footer?: ReactNode;
  /** Esconde o "X" quando os botões do rodapé já resolvem tudo. */
  hideCloseButton?: boolean;
}

/**
 * Diálogo modal acessível:
 * - o foco entra no diálogo ao abrir e volta para onde estava ao fechar;
 * - Tab e Shift+Tab ficam presos dentro dele;
 * - Esc, o botão "Fechar" ou um toque fora fecham;
 * - o resto da página fica inerte enquanto ele está aberto.
 */
export function Modal({ open, onClose, title, children, footer, hideCloseButton }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const appRoot = document.getElementById('root');
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    appRoot?.setAttribute('inert', '');
    dialogRef.current?.focus();

    // Teclado: Esc fecha; Tab e Shift+Tab dão a volta dentro do diálogo.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const active = document.activeElement;
      if (!dialog.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = previousOverflow;
      appRoot?.removeAttribute('inert');
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return createPortal(
    // O fundo escuro só fecha com o ponteiro; no teclado existem Esc e o botão "Fechar".
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={`${styles.backdrop} bj-fade-in`} onClick={handleBackdropClick}>
      <div
        ref={dialogRef}
        className={`${styles.dialog} bj-rise-in`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {!hideCloseButton && (
            <IconButton icon="close" label="Fechar" variant="soft" onClick={onClose} />
          )}
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
