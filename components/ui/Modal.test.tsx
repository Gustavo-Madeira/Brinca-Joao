import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Modal } from './Modal';

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Título do diálogo"
        footer={<button type="button">Último</button>}
      >
        <button type="button">Primeiro</button>
      </Modal>
    </>
  );
}

async function openDialog() {
  const user = userEvent.setup();
  render(<Harness />);
  await user.click(screen.getByRole('button', { name: 'Abrir' }));
  return user;
}

describe('Modal', () => {
  it('abre como diálogo com nome e leva o foco para dentro', async () => {
    await openDialog();
    const dialog = screen.getByRole('dialog', { name: 'Título do diálogo' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveFocus();
  });

  it('prende o Tab dentro do diálogo, nos dois sentidos', async () => {
    const user = await openDialog();
    const close = screen.getByRole('button', { name: 'Fechar' });
    const first = screen.getByRole('button', { name: 'Primeiro' });
    const last = screen.getByRole('button', { name: 'Último' });

    await user.tab();
    expect(close).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus();
    await user.tab();
    expect(last).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(last).toHaveFocus();
  });

  it('fecha com Esc e devolve o foco para quem abriu', async () => {
    const user = await openDialog();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir' })).toHaveFocus();
  });

  it('fecha pelo botão "Fechar"', async () => {
    const user = await openDialog();
    await user.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('fecha ao tocar fora, mas não ao tocar dentro', async () => {
    const user = await openDialog();
    const dialog = screen.getByRole('dialog');

    await user.click(dialog);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const backdrop = dialog.parentElement;
    if (!backdrop) throw new Error('diálogo sem fundo');
    await user.click(backdrop);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('trava a rolagem da página só enquanto está aberto', async () => {
    const user = await openDialog();
    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');
    expect(document.body.style.overflow).toBe('');
  });
});
