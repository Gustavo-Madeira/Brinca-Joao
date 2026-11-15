import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PROGRESS_KEY } from '@/context/progress-context';
import { gameMeta, readSaved, renderWithApp } from '@/test/render';
import type { Progress } from '@/types';
import MemoryGame from './MemoryGame';

const game = gameMeta('memoria');

function cards(): HTMLElement[] {
  return screen.getAllByRole('button', { name: /^Carta \d+:/ });
}

function label(index: number): string {
  return cards()[index]?.getAttribute('aria-label') ?? '';
}

const isClosed = (index: number) => label(index).endsWith('fechada');
const isMatched = (index: number) => label(index).endsWith('par encontrado');

/** Cartas abertas que ainda não formaram par. */
function openUnmatched(): number[] {
  return cards()
    .map((_, index) => index)
    .filter((index) => !isClosed(index) && !isMatched(index));
}

/**
 * Joga como uma criança curiosa: experimenta todos os pares possíveis.
 * Não depende de sorte nem de decorar o baralho.
 */
async function findAllPairs(user: UserEvent): Promise<void> {
  const total = cards().length;
  for (let i = 0; i < total; i += 1) {
    for (let j = i + 1; j < total; j += 1) {
      if (isMatched(i)) break;
      if (isMatched(j)) continue;

      // Duas cartas diferentes abertas: um toque em uma delas fecha as duas.
      const pending = openUnmatched();
      if (pending.length === 2) await user.click(cards()[pending[0]!]!);

      await user.click(cards()[i]!);
      await user.click(cards()[j]!);
    }
  }
}

describe('Jogo da Memória', () => {
  it('começa com seis cartas fechadas no nível fácil', () => {
    renderWithApp(<MemoryGame game={game} />);
    expect(cards()).toHaveLength(6);
    cards().forEach((_, index) => expect(isClosed(index)).toBe(true));
    expect(screen.getByRole('img', { name: '0 de 3 pares encontrados' })).toBeInTheDocument();
  });

  it('virar uma carta mostra a figura e convida a procurar a outra', async () => {
    const { user } = renderWithApp(<MemoryGame game={game} />);
    await user.click(cards()[0]!);
    expect(isClosed(0)).toBe(false);
    expect(screen.getByRole('status')).toHaveTextContent(/Onde está a outra igual\?/);
  });

  it('cartas diferentes continuam abertas até a criança tocar de novo', async () => {
    const { user } = renderWithApp(<MemoryGame game={game} />);

    // Procura duas cartas diferentes.
    await user.click(cards()[0]!);
    let other = 1;
    await user.click(cards()[other]!);
    if (isMatched(0)) {
      // Deu par de primeira; usa as duas cartas seguintes (uma delas é diferente de alguma).
      await user.click(cards()[2]!);
      other = 3;
      await user.click(cards()[other]!);
      if (isMatched(2)) return; // baralho todo em pares vizinhos: nada a verificar aqui
    }

    expect(openUnmatched()).toHaveLength(2);
    expect(screen.getByRole('status')).toHaveTextContent(/diferentes/);

    // Nenhum relógio fecha as cartas sozinho.
    await new Promise((resolve) => setTimeout(resolve, 120));
    expect(openUnmatched()).toHaveLength(2);

    // O toque seguinte, em uma delas, fecha as duas.
    await user.click(cards()[other]!);
    expect(openUnmatched()).toHaveLength(0);
  });

  it('"Espiar" abre todas as cartas e "Esconder" fecha de novo', async () => {
    const { user } = renderWithApp(<MemoryGame game={game} />);

    await user.click(screen.getByRole('button', { name: 'Espiar' }));
    cards().forEach((_, index) => expect(isClosed(index)).toBe(false));
    expect(cards()[0]).toHaveAttribute('aria-disabled', 'true');

    await user.click(screen.getByRole('button', { name: 'Esconder' }));
    cards().forEach((_, index) => expect(isClosed(index)).toBe(true));
  });

  it('encontrar todos os pares traz a comemoração e registra a brincadeira', async () => {
    const { user } = renderWithApp(<MemoryGame game={game} />);
    await findAllPairs(user);

    expect(screen.getByRole('heading', { name: 'Você achou todos os pares!' })).toHaveFocus();
    expect(screen.getByRole('img', { name: '3 de 3 pares encontrados' })).toBeInTheDocument();
    expect(readSaved<Progress>(PROGRESS_KEY)?.plays.memoria).toBe(1);

    await user.click(screen.getByRole('button', { name: 'Jogar de novo' }));
    cards().forEach((_, index) => expect(isClosed(index)).toBe(true));
  });

  it('a quantidade de pares aumenta com o nível', async () => {
    const { user } = renderWithApp(<MemoryGame game={game} />);
    await user.click(screen.getByRole('radio', { name: 'Médio' }));
    expect(cards()).toHaveLength(12);
    await user.click(screen.getByRole('radio', { name: 'Desafio' }));
    expect(cards()).toHaveLength(16);
  });
});
