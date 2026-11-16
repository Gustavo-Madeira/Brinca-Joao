import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_SETTINGS, SETTINGS_KEY } from '@/config/settings';
import { SettingsProvider } from '@/context/SettingsProvider';
import type { Settings } from '@/types';
import { playSound } from '@/utils/audio';
import { speakText } from '@/utils/speech';
import { STORAGE_PREFIX } from '@/utils/storage';
import { useSound } from './useSound';

vi.mock('@/utils/audio', () => ({ playSound: vi.fn() }));
vi.mock('@/utils/speech', () => ({
  speakText: vi.fn(),
  stopSpeaking: vi.fn(),
  canSpeak: () => true,
}));

function renderSound(settings?: Partial<Settings>) {
  if (settings) {
    window.localStorage.setItem(
      STORAGE_PREFIX + SETTINGS_KEY,
      JSON.stringify({ ...DEFAULT_SETTINGS, ...settings }),
    );
  }
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SettingsProvider>{children}</SettingsProvider>
  );
  return renderHook(() => useSound(), { wrapper }).result;
}

describe('useSound', () => {
  it('em uma primeira visita, nenhum som e nenhuma voz saem do aparelho', () => {
    const sound = renderSound();
    expect(sound.current.enabled).toBe(false);

    sound.current.play('acerto');
    sound.current.play('festa');
    sound.current.speak('Olá!');

    expect(playSound).not.toHaveBeenCalled();
    expect(speakText).not.toHaveBeenCalled();
  });

  it('só montar a tela nunca dispara áudio, mesmo com os sons ligados', () => {
    renderSound({ sound: true });
    expect(playSound).not.toHaveBeenCalled();
    expect(speakText).not.toHaveBeenCalled();
  });

  it('com os sons ligados, toca e fala quando pedem', () => {
    const sound = renderSound({ sound: true });
    sound.current.play('acerto');
    sound.current.speak('Gato');

    expect(playSound).toHaveBeenCalledWith('acerto', { volume: 1 });
    expect(speakText).toHaveBeenCalledWith('Gato', { volume: 0.9 });
  });

  it('no modo calmo, tudo soa mais baixo', () => {
    const sound = renderSound({ sound: true, calmMode: true });
    sound.current.play('toque');
    expect(playSound).toHaveBeenCalledWith('toque', { volume: 0.55 });
  });
});
