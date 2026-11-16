import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PROGRESS_KEY } from '@/context/progress-context';
import { SETTINGS_KEY } from '@/config/settings';
import { readSaved, renderWithApp } from '@/test/render';
import type { Progress, Settings } from '@/types';
import { playSound } from '@/utils/audio';
import { STORAGE_PREFIX } from '@/utils/storage';
import { SettingsPanel } from './SettingsPanel';

vi.mock('@/utils/audio', () => ({ playSound: vi.fn() }));

const root = document.documentElement;

describe('painel de configurações', () => {
  it('começa com os sons desligados e as animações ligadas', () => {
    renderWithApp(<SettingsPanel />);
    expect(screen.getByRole('switch', { name: 'Sons' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('switch', { name: 'Animações' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('switch', { name: 'Modo calmo' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    expect(screen.getByRole('radio', { name: 'Normal' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Fácil' })).toBeChecked();
    expect(playSound).not.toHaveBeenCalled();
  });

  it('liga os sons, toca uma amostra e salva a escolha', async () => {
    const { user } = renderWithApp(<SettingsPanel />);
    const sound = screen.getByRole('switch', { name: 'Sons' });

    await user.click(sound);
    expect(sound).toHaveAttribute('aria-checked', 'true');
    expect(playSound).toHaveBeenCalledTimes(1);
    expect(readSaved<Settings>(SETTINGS_KEY)?.sound).toBe(true);

    // Desligar não toca nada.
    await user.click(sound);
    expect(sound).toHaveAttribute('aria-checked', 'false');
    expect(playSound).toHaveBeenCalledTimes(1);
    expect(readSaved<Settings>(SETTINGS_KEY)?.sound).toBe(false);
  });

  it('funciona pelo teclado', async () => {
    const { user } = renderWithApp(<SettingsPanel />);
    const sound = screen.getByRole('switch', { name: 'Sons' });
    sound.focus();
    await user.keyboard('{Enter}');
    expect(sound).toHaveAttribute('aria-checked', 'true');
    await user.keyboard(' ');
    expect(sound).toHaveAttribute('aria-checked', 'false');
  });

  it('o modo calmo desliga o movimento e trava o interruptor de animações', async () => {
    const { user } = renderWithApp(<SettingsPanel />);
    expect(root.dataset.motion).toBe('on');
    expect(root.dataset.calm).toBe('false');

    await user.click(screen.getByRole('switch', { name: 'Modo calmo' }));
    expect(root.dataset.calm).toBe('true');
    expect(root.dataset.motion).toBe('off');

    const animations = screen.getByRole('switch', { name: 'Animações' });
    expect(animations).toHaveAttribute('aria-disabled', 'true');
    expect(animations).toHaveAttribute('aria-checked', 'false');
    expect(animations).toHaveAccessibleDescription(/modo calmo/i);

    // Travado: tocar nele não muda a preferência guardada.
    await user.click(animations);
    expect(readSaved<Settings>(SETTINGS_KEY)?.animations).toBe(true);
  });

  it('desligar as animações desliga o movimento', async () => {
    const { user } = renderWithApp(<SettingsPanel />);
    await user.click(screen.getByRole('switch', { name: 'Animações' }));
    expect(root.dataset.motion).toBe('off');
    expect(readSaved<Settings>(SETTINGS_KEY)?.animations).toBe(false);
  });

  it('respeita o pedido de "movimento reduzido" do aparelho', () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      ...original(query),
      matches: query.includes('prefers-reduced-motion'),
    })) as typeof window.matchMedia;

    renderWithApp(<SettingsPanel />);
    const animations = screen.getByRole('switch', { name: 'Animações' });
    expect(root.dataset.motion).toBe('off');
    expect(animations).toHaveAttribute('aria-disabled', 'true');
    expect(animations).toHaveAccessibleDescription(/aparelho/i);

    window.matchMedia = original;
  });

  it('muda o tamanho dos elementos', async () => {
    const { user } = renderWithApp(<SettingsPanel />);
    await user.click(screen.getByRole('radio', { name: 'Bem grande' }));
    expect(root.dataset.size).toBe('enorme');
    expect(readSaved<Settings>(SETTINGS_KEY)?.size).toBe('enorme');
  });

  it('o nível inicial vale para todos os jogos (apaga escolhas antigas por jogo)', async () => {
    window.localStorage.setItem(
      STORAGE_PREFIX + PROGRESS_KEY,
      JSON.stringify({ levels: { cores: 'desafio' }, plays: { cores: 2 }, animalsSeen: [] }),
    );
    const { user } = renderWithApp(<SettingsPanel />);

    await user.click(screen.getByRole('radio', { name: 'Médio' }));
    expect(readSaved<Settings>(SETTINGS_KEY)?.difficulty).toBe('medio');
    expect(readSaved<Progress>(PROGRESS_KEY)?.levels).toEqual({});
    // O que a criança já brincou continua guardado.
    expect(readSaved<Progress>(PROGRESS_KEY)?.plays).toEqual({ cores: 2 });
  });

  it('abre com as preferências que já estavam salvas', () => {
    renderWithApp(<SettingsPanel />, {
      settings: { sound: true, calmMode: true, size: 'grande', difficulty: 'desafio' },
    });
    expect(screen.getByRole('switch', { name: 'Sons' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Grande' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Desafio' })).toBeChecked();
    expect(root.dataset.size).toBe('grande');
    expect(root.dataset.calm).toBe('true');
  });
});
