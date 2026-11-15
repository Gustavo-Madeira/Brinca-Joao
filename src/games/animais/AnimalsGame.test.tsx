import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PROGRESS_KEY } from '@/context/progress-context';
import { gameMeta, readSaved, renderWithApp } from '@/test/render';
import type { Progress } from '@/types';
import { playSound } from '@/utils/audio';
import { speakText } from '@/utils/speech';
import AnimalsGame from './AnimalsGame';
import { ANIMALS } from './data';

vi.mock('@/utils/audio', () => ({ playSound: vi.fn() }));
vi.mock('@/utils/speech', () => ({
  speakText: vi.fn(),
  stopSpeaking: vi.fn(),
  canSpeak: () => true,
}));

const game = gameMeta('animais');

describe('Descubra os Animais', () => {
  it('mostra todos os animais, cada um com o nome', () => {
    renderWithApp(<AnimalsGame game={game} />);
    expect(ANIMALS).toHaveLength(12);
    ANIMALS.forEach((animal) => {
      expect(screen.getByRole('button', { name: animal.name })).toBeInTheDocument();
    });
  });

  it('tocar em um animal mostra o nome, o som escrito e uma curiosidade', async () => {
    const { user } = renderWithApp(<AnimalsGame game={game} />);
    const cat = screen.getByRole('button', { name: 'Gato' });

    await user.click(cat);
    expect(cat).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Gato: Miau!');
    expect(screen.getByRole('status')).toHaveTextContent('O gato gosta de carinho.');
  });

  it('com os sons desligados (o padrão), nada fala e nada toca', async () => {
    const { user } = renderWithApp(<AnimalsGame game={game} />);
    await user.click(screen.getByRole('button', { name: 'Cachorro' }));
    await user.click(screen.getByRole('button', { name: 'Vaca' }));

    expect(speakText).not.toHaveBeenCalled();
    expect(playSound).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Ouvir a instrução' })).not.toBeInTheDocument();
  });

  it('com os sons ligados, a voz fala o animal tocado (e só depois do toque)', async () => {
    const { user } = renderWithApp(<AnimalsGame game={game} />, { settings: { sound: true } });
    expect(speakText).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Pato' }));
    expect(speakText).toHaveBeenCalledTimes(1);
    expect(speakText).toHaveBeenCalledWith(
      'Pato. Quá, quá! O pato sabe nadar.',
      expect.objectContaining({ volume: expect.any(Number) }),
    );
  });

  it('com os sons ligados, aparece o botão para ouvir a instrução', async () => {
    const { user } = renderWithApp(<AnimalsGame game={game} />, { settings: { sound: true } });
    await user.click(screen.getByRole('button', { name: 'Ouvir a instrução' }));
    expect(speakText).toHaveBeenCalledWith('Toque em um animal para conhecer.', expect.anything());
  });

  it('pode tocar no mesmo animal quantas vezes quiser, e só um balão aparece por vez', async () => {
    const { user } = renderWithApp(<AnimalsGame game={game} />);
    const frog = screen.getByRole('button', { name: 'Sapo' });

    await user.click(frog);
    await user.click(frog);
    await user.click(screen.getByRole('button', { name: 'Leão' }));

    expect(screen.queryByText('Croac croac!')).not.toBeInTheDocument();
    expect(screen.getByText('Roaar!')).toBeInTheDocument();
    expect(frog).not.toHaveAttribute('aria-current');
  });

  it('lembra, só neste aparelho, quais animais já foram visitados', async () => {
    const { user } = renderWithApp(<AnimalsGame game={game} />);
    expect(screen.getByText(/já visitou: 0 de 12/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Ovelha' }));
    await user.click(screen.getByRole('button', { name: 'Ovelha' }));
    await user.click(screen.getByRole('button', { name: 'Macaco' }));

    expect(screen.getByText(/já visitou: 2 de 12/)).toBeInTheDocument();
    expect(readSaved<Progress>(PROGRESS_KEY)?.animalsSeen).toEqual(['ovelha', 'macaco']);
  });

  it('funciona pelo teclado', async () => {
    const { user } = renderWithApp(<AnimalsGame game={game} />);
    screen.getByRole('button', { name: 'Elefante' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('status')).toHaveTextContent('Elefante');
  });
});
