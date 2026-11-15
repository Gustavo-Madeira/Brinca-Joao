import type { ReactNode } from 'react';
import { Button } from './Button';
import type { IconName } from './Icon';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  confirmIcon?: IconName;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Pergunta simples antes de uma ação que não dá para desfazer
 * (por exemplo, apagar o desenho). "Voltar" vem primeiro e é o caminho seguro.
 */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  confirmIcon,
  cancelLabel = 'Não, voltar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      hideCloseButton
      footer={
        <>
          <Button variant="soft" size="lg" icon="arrowLeft" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="primary" size="lg" icon={confirmIcon} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
