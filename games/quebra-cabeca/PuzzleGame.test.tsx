import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PROGRESS_KEY } from '@/context/progress-context';
import { gameMeta, readSaved, renderWithApp } from '@/test/render';
import type { Progress } from '@/types';
import PuzzleGame from './PuzzleGame';

const game = gameMeta('quebra-cabeca');

function pieces(): HTMLElement[] {
  return screen.queryAllByRole('button', { name: /^Peça da / });
}

/** "Peça da linha 1, coluna 2" → "linha 1, coluna 2". */
function positionOf(piece: HTMLElement): string {
  return (piece.getAttribute('aria-label') ?? '').replace('Peça da ', '');
}

function slotAt(position: string): HTMLElement {
  return screen.getByRole('button', { name: new RegExp(`^Lugar da ${position}`) });
}

describe('Quebra-Cabeça do João', () => {
  it('começa com quatro peças, o modelo e a imagem de fundo ligada', () => {
    renderWithApp(<PuzzleGame game={game} />);
    expect(pieces()).toHaveLength(4);
    expect(screen.getByRole('img', { name: 'Modelo: Pipo no céu' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Imagem de fundo' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('group', { name: /0 de 4 peças no lugar/ })).toBeInTheDocument();
  });

  it('encaixa a peça no lugar certo com dois toques', async () => {
    const { user } = renderWithApp(<PuzzleGame game={game} />);
    const piece = pieces()[0]!;
    const position = positionOf(piece);

    await user.click(piece);
    expect(piece).toHaveAttribute('aria-pressed', 'true');
    await user.click(slotAt(position));

    expect(slotAt(position)).toHaveAccessibleName(`Lugar da ${position}: peça encaixada`);
    expect(pieces()).toHaveLength(3);
    expect(screen.getByRole('status')).toHaveTextContent(/encaixou/);
  });

  it('em outro lugar a peça não se fixa, sem penalidade nenhuma', async () => {
    const { user } = renderWithApp(<PuzzleGame game={game} />);
    const [first, second] = pieces();
    if (!first || !second) throw new Error('faltam peças');

    await user.click(first);
    await user.click(slotAt(positionOf(second)));

    expect(screen.getByRole('status')).toHaveTextContent(/outro lugar/);
    expect(first).toHaveAttribute('aria-pressed', 'true');
    expect(pieces()).toHaveLength(4);
  });

  it('o botão "Ajuda" escolhe uma peça e mostra onde ela vai', async () => {
    const { user } = renderWithApp(<PuzzleGame game={game} />);
    await user.click(screen.getByRole('button', { name: 'Ajuda' }));

    expect(pieces().filter((piece) => piece.getAttribute('aria-pressed') === 'true')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent(/brilhando/);
  });

  it('montar tudo traz a comemoração; "Outra figura" troca a imagem', async () => {
    const { user } = renderWithApp(<PuzzleGame game={game} />);

    while (pieces().length > 0) {
      const piece = pieces()[0]!;
      const position = positionOf(piece);
      await user.click(piece);
      await user.click(slotAt(position));
    }

    expect(screen.getByRole('heading', { name: 'Você montou: Pipo no céu!' })).toHaveFocus();
    expect(readSaved<Progress>(PROGRESS_KEY)?.plays['quebra-cabeca']).toBe(1);

    await user.click(screen.getByRole('button', { name: 'Outra figura' }));
    expect(screen.getByRole('img', { name: 'Modelo: Cachorrinho' })).toBeInTheDocument();
    expect(pieces()).toHaveLength(4);
  });

  it('dá para escolher a figura e ela vem desmontada', async () => {
    const { user } = renderWithApp(<PuzzleGame game={game} />);
    const farm = screen.getByRole('button', { name: 'Fazenda' });

    await user.click(farm);
    expect(farm).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('img', { name: 'Modelo: Fazenda' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /Fazenda\. 0 de 4/ })).toBeInTheDocument();
  });

  it('os níveis seguintes têm mais peças e começam sem a imagem de fundo', async () => {
    const { user } = renderWithApp(<PuzzleGame game={game} />);

    await user.click(screen.getByRole('radio', { name: 'Médio' }));
    expect(pieces()).toHaveLength(6);
    expect(screen.getByRole('button', { name: 'Imagem de fundo' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );

    await user.click(screen.getByRole('radio', { name: 'Desafio' }));
    expect(pieces()).toHaveLength(9);
  });
});
