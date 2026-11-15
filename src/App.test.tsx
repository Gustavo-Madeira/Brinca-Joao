import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { App } from './App';
import { GAMES } from './games/registry';

function renderApp(path: string) {
  const location = memoryLocation({ path, record: true });
  const user = userEvent.setup();
  render(
    <Router hook={location.hook}>
      <App />
    </Router>,
  );
  return { user, history: location.history };
}

describe('página inicial', () => {
  it('tem o nome do site, as boas-vindas e a homenagem discreta', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { level: 1, name: /Brinca João/ })).toBeInTheDocument();
    expect(screen.getByText('Um mundo de brincadeiras feito com carinho!')).toBeInTheDocument();
    expect(screen.getByText('Feito com amor para João Lucas 💙')).toBeInTheDocument();
  });

  it('o botão "Vamos brincar!" leva para a lista de jogos', async () => {
    const { user, history } = renderApp('/');
    await user.click(screen.getByRole('link', { name: 'Vamos brincar!' }));
    expect(history[history.length - 1]).toBe('/jogos');
    expect(screen.getByRole('heading', { level: 1, name: 'Vamos brincar de quê?' })).toBeInTheDocument();
  });

  it('dá acesso direto a cada jogo e às configurações', () => {
    renderApp('/');
    GAMES.forEach((game) => {
      expect(screen.getByRole('link', { name: game.title })).toHaveAttribute(
        'href',
        `/jogos/${game.slug}`,
      );
    });
    expect(screen.getByRole('link', { name: 'Configurações' })).toHaveAttribute(
      'href',
      '/configuracoes',
    );
  });

  it('o único link para fora do site é o crédito do criador, no rodapé', () => {
    renderApp('/');
    // Todo o resto são endereços do próprio site ("/...") ou âncoras da página ("#...").
    const external = screen
      .getAllByRole('link')
      .filter((link) => !/^[/#]/.test(link.getAttribute('href') ?? ''));

    expect(external).toHaveLength(1);
    const credit = external[0]!;
    expect(credit).toHaveAccessibleName(/Gustavo Madeira/);
    expect(credit).toHaveAttribute('href', 'https://gustavomadeira-portfolio.netlify.app/');
    expect(credit).toHaveAttribute('target', '_blank');
    expect(credit).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(credit.closest('footer')).not.toBeNull();
  });

  it('as telas de jogo não têm rodapé nem links para fora', async () => {
    renderApp('/jogos/animais');
    await screen.findByRole('button', { name: 'Gato' });
    expect(screen.queryByText(/Criado por/)).not.toBeInTheDocument();
    screen.getAllByRole('link').forEach((link) => {
      expect(link.getAttribute('href')).toMatch(/^[/#]/);
    });
  });
});

describe('lista de jogos', () => {
  it('mostra os seis jogos, cada um com nome, descrição e botão "Jogar"', () => {
    renderApp('/jogos');
    expect(GAMES).toHaveLength(6);
    GAMES.forEach((game) => {
      const card = screen.getByRole('heading', { level: 2, name: game.title }).closest('article');
      if (!card) throw new Error(`cartão não encontrado: ${game.title}`);
      expect(within(card).getByText(game.description)).toBeInTheDocument();
      expect(within(card).getByRole('link', { name: `Jogar ${game.title}` })).toHaveAttribute(
        'href',
        `/jogos/${game.slug}`,
      );
    });
  });
});

describe('telas dos jogos', () => {
  it.each(GAMES.map((game) => [game.title, game.slug] as const))(
    '%s abre direto pelo endereço, com "Voltar" e configurações',
    async (title, slug) => {
      renderApp(`/jogos/${slug}`);
      expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Voltar para os jogos' })).toHaveAttribute(
        'href',
        '/jogos',
      );
      expect(screen.getByRole('button', { name: 'Configurações' })).toBeInTheDocument();

      // O código do jogo chega depois (carregamento sob demanda) e traz a instrução do Pipo.
      const stage = await screen.findByText(/!$/, { selector: 'p[class*="bubble"]' });
      expect(stage).toBeInTheDocument();
      expect(document.title).toBe(`${title} · Brinca João`);
    },
  );

  it('"Voltar" leva de volta para a lista de jogos', async () => {
    const { user, history } = renderApp('/jogos/animais');
    await user.click(screen.getByRole('link', { name: 'Voltar para os jogos' }));
    expect(history[history.length - 1]).toBe('/jogos');
  });

  it('as configurações abrem por cima do jogo, sem sair dele', async () => {
    const { user, history } = renderApp('/jogos/animais');
    await screen.findByRole('button', { name: 'Gato' });

    await user.click(screen.getByRole('button', { name: 'Configurações' }));
    const dialog = screen.getByRole('dialog', { name: 'Configurações' });
    expect(within(dialog).getByRole('switch', { name: 'Sons' })).toHaveAttribute(
      'aria-checked',
      'false',
    );

    await user.click(within(dialog).getByRole('button', { name: 'Pronto' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(history).toEqual(['/jogos/animais']);
    expect(screen.getByRole('button', { name: 'Gato' })).toBeInTheDocument();
  });
});

describe('outras páginas', () => {
  it('a página de configurações tem o painel e as informações para a família', () => {
    renderApp('/configuracoes');
    expect(screen.getByRole('heading', { level: 1, name: 'Configurações' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Sons' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Para a família' })).toBeInTheDocument();
  });

  it('"Apagar dados" pede confirmação e devolve tudo ao padrão', async () => {
    window.localStorage.setItem(
      'brinca-joao:preferencias',
      JSON.stringify({ sound: true, animations: true, calmMode: false, size: 'enorme', difficulty: 'medio' }),
    );
    window.localStorage.setItem('brinca-joao:desenho', '{"v":1,"aspect":1,"strokes":[]}');
    const { user } = renderApp('/configuracoes');
    expect(screen.getByRole('switch', { name: 'Sons' })).toHaveAttribute('aria-checked', 'true');

    await user.click(screen.getByRole('button', { name: 'Apagar dados deste aparelho' }));
    await user.click(screen.getByRole('button', { name: 'Sim, apagar' }));

    expect(screen.getByRole('switch', { name: 'Sons' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: 'Normal' })).toBeChecked();
    expect(screen.getByText('Pronto! Tudo voltou ao começo.')).toBeInTheDocument();
    expect(window.localStorage.getItem('brinca-joao:desenho')).toBeNull();
  });

  it('endereços que não existem mostram uma tela amigável com caminho de volta', () => {
    renderApp('/pagina-que-nao-existe');
    expect(screen.getByRole('heading', { level: 1, name: /voou para longe/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver os jogos' })).toHaveAttribute('href', '/jogos');
  });

  it('um jogo que não existe também cai na tela amigável', () => {
    renderApp('/jogos/jogo-que-nao-existe');
    expect(screen.getByRole('heading', { level: 1, name: /voou para longe/ })).toBeInTheDocument();
  });
});
