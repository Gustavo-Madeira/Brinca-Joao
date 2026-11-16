import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PROGRESS_KEY } from '@/context/progress-context';
import { gameMeta, readSaved, renderWithApp } from '@/test/render';
import type { Progress } from '@/types';
import ColorsGame from './ColorsGame';

const game = gameMeta('cores');

/** "Peixe azul": descrição da figura-modelo da rodada atual. */
function targetDescription(): string {
  const label = screen.getByRole('group', { name: /^Rodada/ }).getAttribute('aria-label') ?? '';
  return (label.split('Figura modelo: ')[1] ?? '').replace(/\.$/, '');
}

function options(): HTMLElement[] {
  return within(screen.getByRole('list', { name: 'Opções' })).getAllByRole('button');
}

/** No nível fácil a opção certa é idêntica ao modelo (mesma figura, mesma cor). */
function correctOption(): HTMLElement {
  return screen.getByRole('button', { name: targetDescription() });
}

function wrongOption(): HTMLElement {
  const wrong = options().find((option) => option.getAttribute('aria-label') !== targetDescription());
  if (!wrong) throw new Error('não há opção diferente do modelo');
  return wrong;
}

describe('Mundo das Cores', () => {
  it('mostra o modelo, três opções e nenhuma estrela no começo', () => {
    renderWithApp(<ColorsGame game={game} />);
    expect(screen.getByText('Toque na figura que tem a mesma cor!')).toBeInTheDocument();
    expect(options()).toHaveLength(3);
    expect(screen.getByRole('img', { name: '0 de 5 estrelas' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Próxima/ })).not.toBeInTheDocument();
  });

  it('acertar acende uma estrela e libera o botão "Próxima"', async () => {
    const { user } = renderWithApp(<ColorsGame game={game} />);
    await user.click(correctOption());

    expect(screen.getByRole('status')).toHaveTextContent(/É o /);
    expect(screen.getByRole('img', { name: '1 de 5 estrelas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Próxima/ })).toHaveFocus();
  });

  it('errar não tem punição: a opção só fica apagada e dá para tentar de novo', async () => {
    const { user } = renderWithApp(<ColorsGame game={game} />);
    const wrong = wrongOption();

    await user.click(wrong);
    expect(wrong).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('status')).toHaveTextContent(/Tente outro/);
    expect(screen.getByRole('img', { name: '0 de 5 estrelas' })).toBeInTheDocument();

    // Quantas tentativas quiser: a certa continua valendo.
    await user.click(wrong);
    await user.click(correctOption());
    expect(screen.getByRole('img', { name: '1 de 5 estrelas' })).toBeInTheDocument();
  });

  it('a dica destaca a opção certa', async () => {
    const { user } = renderWithApp(<ColorsGame game={game} />);
    await user.click(screen.getByRole('button', { name: 'Dica' }));
    expect(correctOption()).toHaveClass('bj-glow');
    expect(wrongOption()).not.toHaveClass('bj-glow');
  });

  it('dá para jogar inteiro só pelo teclado', async () => {
    const { user } = renderWithApp(<ColorsGame game={game} />);
    correctOption().focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: /Próxima/ })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('group', { name: /^Rodada 2 de 5/ })).toHaveFocus();
  });

  it('depois de cinco rodadas vem a comemoração, e a brincadeira fica registrada', async () => {
    const { user } = renderWithApp(<ColorsGame game={game} />);

    for (let round = 1; round <= 5; round += 1) {
      expect(screen.getByRole('group', { name: new RegExp(`^Rodada ${round} de 5`) })).toBeVisible();
      await user.click(correctOption());
      await user.click(screen.getByRole('button', { name: round < 5 ? 'Próxima' : 'Ver as estrelas' }));
    }

    expect(screen.getByRole('heading', { name: 'Você completou as cores!' })).toHaveFocus();
    expect(readSaved<Progress>(PROGRESS_KEY)?.plays.cores).toBe(1);

    await user.click(screen.getByRole('button', { name: 'Jogar de novo' }));
    expect(screen.getByRole('group', { name: /^Rodada 1 de 5/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '0 de 5 estrelas' })).toBeInTheDocument();
  });

  it('trocar de nível muda a quantidade de opções e fica salvo para este jogo', async () => {
    const { user } = renderWithApp(<ColorsGame game={game} />);

    await user.click(screen.getByRole('radio', { name: 'Médio' }));
    expect(options()).toHaveLength(4);

    await user.click(screen.getByRole('radio', { name: 'Desafio' }));
    expect(options()).toHaveLength(6);
    expect(readSaved<Progress>(PROGRESS_KEY)?.levels.cores).toBe('desafio');
  });

  it('começa no nível inicial escolhido nas configurações', () => {
    renderWithApp(<ColorsGame game={game} />, { settings: { difficulty: 'medio' } });
    expect(screen.getByRole('radio', { name: 'Médio' })).toBeChecked();
    expect(options()).toHaveLength(4);
  });

  it('toda opção tem nome com figura e cor, mesmo com os nomes escondidos na tela', async () => {
    const { user } = renderWithApp(<ColorsGame game={game} />);
    const toggle = screen.getByRole('button', { name: 'Nomes das cores' });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    options().forEach((option) => expect(option).toHaveAccessibleName(/\S+ \S+/));
  });
});
