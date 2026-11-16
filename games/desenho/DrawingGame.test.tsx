import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { gameMeta, readSaved, renderWithApp } from '@/test/render';
import { STORAGE_PREFIX } from '@/utils/storage';
import DrawingGame from './DrawingGame';
import { DRAWING_KEY, PALETTE, PAPER_COLOR } from './strokes';

const game = gameMeta('desenho');

interface SavedDrawing {
  v: number;
  aspect: number;
  strokes: Array<{ c: string; s: number; p: number[] }>;
}

function paper(): HTMLElement {
  return screen.getByRole('application', { name: 'Papel de desenho' });
}

/** Simula um risco com o dedo: encosta, arrasta e solta. */
function drawStroke(): void {
  const canvas = paper();
  fireEvent.pointerDown(canvas, { pointerId: 1, button: 0, clientX: 10, clientY: 10 });
  fireEvent.pointerMove(canvas, { pointerId: 1, clientX: 60, clientY: 40 });
  fireEvent.pointerUp(canvas, { pointerId: 1, clientX: 60, clientY: 40 });
}

async function savedStrokes(count: number): Promise<SavedDrawing> {
  await waitFor(
    () => expect(readSaved<SavedDrawing>(DRAWING_KEY)?.strokes).toHaveLength(count),
    { timeout: 2000 },
  );
  return readSaved<SavedDrawing>(DRAWING_KEY) as SavedDrawing;
}

describe('Desenho Livre', () => {
  it('começa com o papel em branco: nada para desfazer ou limpar', () => {
    renderWithApp(<DrawingGame game={game} />);
    expect(paper()).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Desfazer' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Limpar' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Baixar desenho' })).toBeEnabled();
  });

  it('todas as cores têm nome, e uma delas já vem escolhida', () => {
    renderWithApp(<DrawingGame game={game} />);
    PALETTE.forEach((color) => {
      expect(screen.getByRole('radio', { name: color.name })).toBeInTheDocument();
    });
    const chosen = PALETTE.filter(
      (color) => (screen.getByRole('radio', { name: color.name }) as HTMLInputElement).checked,
    );
    expect(chosen).toHaveLength(1);
    expect(screen.getByRole('radio', { name: 'Pincel' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Médio' })).toBeChecked();
  });

  it('um risco no papel libera "Desfazer" e "Limpar" e fica salvo no aparelho', async () => {
    renderWithApp(<DrawingGame game={game} />);
    drawStroke();

    expect(screen.getByRole('button', { name: 'Desfazer' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Limpar' })).toBeEnabled();

    const saved = await savedStrokes(1);
    expect(saved.v).toBe(1);
    expect(saved.strokes[0]?.c).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('desenha com a cor e a espessura escolhidas', async () => {
    const { user } = renderWithApp(<DrawingGame game={game} />);
    await user.click(screen.getByRole('radio', { name: 'Azul' }));
    await user.click(screen.getByRole('radio', { name: 'Grosso' }));
    drawStroke();

    const saved = await savedStrokes(1);
    expect(saved.strokes[0]?.c).toBe('#2f80ed');
    expect(saved.strokes[0]?.s).toBe(0.045);
  });

  it('a borracha "pinta" da cor do papel, e escolher uma cor volta para o pincel', async () => {
    const { user } = renderWithApp(<DrawingGame game={game} />);

    await user.click(screen.getByRole('radio', { name: 'Borracha' }));
    PALETTE.forEach((color) => {
      expect(screen.getByRole('radio', { name: color.name })).not.toBeChecked();
    });
    drawStroke();
    expect((await savedStrokes(1)).strokes[0]?.c).toBe(PAPER_COLOR);

    await user.click(screen.getByRole('radio', { name: 'Verde' }));
    expect(screen.getByRole('radio', { name: 'Pincel' })).toBeChecked();
  });

  it('"Desfazer" apaga só o último traço', async () => {
    const { user } = renderWithApp(<DrawingGame game={game} />);
    drawStroke();
    drawStroke();
    await savedStrokes(2);

    await user.click(screen.getByRole('button', { name: 'Desfazer' }));
    expect(screen.getByRole('status')).toHaveTextContent('Último traço apagado.');
    await savedStrokes(1);

    await user.click(screen.getByRole('button', { name: 'Desfazer' }));
    expect(screen.getByRole('button', { name: 'Desfazer' })).toBeDisabled();
  });

  it('"Limpar" pede confirmação antes de apagar', async () => {
    const { user } = renderWithApp(<DrawingGame game={game} />);
    drawStroke();

    // Desistir mantém o desenho.
    await user.click(screen.getByRole('button', { name: 'Limpar' }));
    expect(screen.getByRole('dialog', { name: 'Limpar o desenho?' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Não, voltar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Desfazer' })).toBeEnabled();

    // Confirmar apaga.
    await user.click(screen.getByRole('button', { name: 'Limpar' }));
    await user.click(screen.getByRole('button', { name: 'Sim, limpar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Desfazer' })).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent(/Papel limpinho/);
    await savedStrokes(0);
  });

  it('dá para desenhar pelo teclado: espaço abaixa o pincel, as setas riscam', async () => {
    const { user } = renderWithApp(<DrawingGame game={game} />);
    paper().focus();

    await user.keyboard(' ');
    expect(screen.getByRole('status')).toHaveTextContent(/Pincel no papel/);
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowDown}');
    await user.keyboard(' ');
    expect(screen.getByRole('status')).toHaveTextContent('Pincel levantado.');

    const saved = await savedStrokes(1);
    // Ponto inicial + três movimentos.
    expect(saved.strokes[0]?.p).toHaveLength(8);
    expect(screen.getByRole('button', { name: 'Desfazer' })).toBeEnabled();
  });

  it('reabre o desenho que estava guardado', () => {
    window.localStorage.setItem(
      STORAGE_PREFIX + DRAWING_KEY,
      JSON.stringify({ v: 1, aspect: 1, strokes: [{ c: '#e5484d', s: 0.02, p: [1000, 1000, 5000, 5000] }] }),
    );
    renderWithApp(<DrawingGame game={game} />);
    expect(screen.getByRole('button', { name: 'Desfazer' })).toBeEnabled();
  });

  it('ignora um desenho salvo corrompido e abre o papel em branco', () => {
    window.localStorage.setItem(STORAGE_PREFIX + DRAWING_KEY, '{"v":1,"strokes":"quebrado"}');
    renderWithApp(<DrawingGame game={game} />);
    expect(screen.getByRole('button', { name: 'Desfazer' })).toBeDisabled();
  });

  it('"Baixar desenho" gera um arquivo PNG com nome amigável', async () => {
    const createObjectURL = vi.fn(() => 'blob:desenho');
    const revokeObjectURL = vi.fn();
    Object.assign(URL, { createObjectURL, revokeObjectURL });
    HTMLCanvasElement.prototype.toBlob = function toBlob(callback: BlobCallback) {
      callback(new Blob(['png'], { type: 'image/png' }));
    };
    let downloadName = '';
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function click(this: HTMLAnchorElement) {
        downloadName = this.download;
      });

    const { user } = renderWithApp(<DrawingGame game={game} />);
    drawStroke();
    await user.click(screen.getByRole('button', { name: 'Baixar desenho' }));

    expect(click).toHaveBeenCalledTimes(1);
    expect(downloadName).toBe('meu-desenho-brinca-joao.png');
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent(/Desenho salvo/);
  });
});
