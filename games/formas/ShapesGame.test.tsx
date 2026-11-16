import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PROGRESS_KEY } from '@/context/progress-context';
import { gameMeta, readSaved, renderWithApp } from '@/test/render';
import type { Progress } from '@/types';
import ShapesGame from './ShapesGame';

const game = gameMeta('formas');

function pieces(): HTMLElement[] {
  return screen.queryAllByRole('button', { name: /^Peça: / });
}

/** "Peça: estrela" → "estrela". */
function shapeOf(piece: HTMLElement): string {
  return (piece.getAttribute('aria-label') ?? '').replace('Peça: ', '');
}

function slotFor(shape: string): HTMLElement {
  return screen.getByRole('button', { name: `Lugar em forma de ${shape}` });
}

describe('Encaixe as Formas', () => {
  it('começa com três peças e três lugares no nível fácil', () => {
    renderWithApp(<ShapesGame game={game} />);
    expect(pieces()).toHaveLength(3);
    expect(screen.getAllByRole('button', { name: /^Lugar em forma de / })).toHaveLength(3);
  });

  it('pede para escolher uma peça quando tocam primeiro em um lugar', async () => {
    const { user } = renderWithApp(<ShapesGame game={game} />);
    await user.click(screen.getAllByRole('button', { name: /^Lugar em forma de / })[0]!);
    expect(screen.getByRole('status')).toHaveTextContent('Primeiro toque em uma peça.');
  });

  it('encaixa com dois toques: na peça e no lugar', async () => {
    const { user } = renderWithApp(<ShapesGame game={game} />);
    const piece = pieces()[0]!;
    const shape = shapeOf(piece);

    await user.click(piece);
    expect(piece).toHaveAttribute('aria-pressed', 'true');

    await user.click(slotFor(shape));
    expect(screen.getByRole('status')).toHaveTextContent(/está no lugar/);
    expect(screen.getByRole('button', { name: /: encaixado$/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(pieces()).toHaveLength(2);
  });

  it('lugar errado não tira a peça da mão nem conta como falha', async () => {
    const { user } = renderWithApp(<ShapesGame game={game} />);
    const [first, second] = pieces();
    if (!first || !second) throw new Error('faltam peças');

    await user.click(first);
    await user.click(slotFor(shapeOf(second)));

    expect(screen.getByRole('status')).toHaveTextContent(/outro lugar/);
    expect(first).toHaveAttribute('aria-pressed', 'true');
    expect(pieces()).toHaveLength(3);

    await user.click(slotFor(shapeOf(first)));
    expect(pieces()).toHaveLength(2);
  });

  it('a dica escolhe uma peça e destaca o lugar dela', async () => {
    const { user } = renderWithApp(<ShapesGame game={game} />);
    await user.click(screen.getByRole('button', { name: 'Dica' }));

    const selected = pieces().find((piece) => piece.getAttribute('aria-pressed') === 'true');
    if (!selected) throw new Error('a dica não selecionou nenhuma peça');
    expect(slotFor(shapeOf(selected))).toHaveClass('bj-glow');
  });

  it('dá para terminar só pelo teclado, e a comemoração aparece', async () => {
    const { user } = renderWithApp(<ShapesGame game={game} />);

    while (pieces().length > 0) {
      const piece = pieces()[0]!;
      const shape = shapeOf(piece);
      piece.focus();
      await user.keyboard('{Enter}');
      slotFor(shape).focus();
      await user.keyboard(' ');
    }

    expect(screen.getByRole('heading', { name: 'Todas as formas no lugar!' })).toHaveFocus();
    expect(readSaved<Progress>(PROGRESS_KEY)?.plays.formas).toBe(1);

    await user.click(screen.getByRole('button', { name: 'Jogar de novo' }));
    expect(pieces()).toHaveLength(3);
  });

  it('os níveis seguintes trazem mais formas', async () => {
    const { user } = renderWithApp(<ShapesGame game={game} />);
    await user.click(screen.getByRole('radio', { name: 'Médio' }));
    expect(pieces()).toHaveLength(4);
    await user.click(screen.getByRole('radio', { name: 'Desafio' }));
    expect(pieces()).toHaveLength(6);
  });

  it('"Recomeçar" devolve todas as peças para a bandeja', async () => {
    const { user } = renderWithApp(<ShapesGame game={game} />);
    const piece = pieces()[0]!;
    await user.click(piece);
    await user.click(slotFor(shapeOf(piece)));
    expect(pieces()).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Recomeçar' }));
    expect(pieces()).toHaveLength(3);
  });
});
