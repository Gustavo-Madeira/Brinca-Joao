import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SettingsPanel } from './SettingsPanel';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Configurações rápidas, abertas pela engrenagem do topo. Por ser um
 * diálogo, a brincadeira em andamento continua exatamente onde estava.
 */
export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Configurações"
      footer={
        <Button variant="primary" size="lg" icon="check" onClick={onClose}>
          Pronto
        </Button>
      }
    >
      <SettingsPanel />
    </Modal>
  );
}
