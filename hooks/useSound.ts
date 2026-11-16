import { useCallback, useEffect } from 'react';
import { playSound } from '@/utils/audio';
import type { SoundName } from '@/utils/audio';
import { speakText, stopSpeaking } from '@/utils/speech';
import { useSettings } from './useSettings';

export interface SoundApi {
  /** Os sons estão ligados nas configurações? */
  enabled: boolean;
  /** Toca um som curto — somente se os sons estiverem ligados. */
  play: (name: SoundName) => void;
  /** Fala um texto — somente se os sons estiverem ligados. */
  speak: (text: string) => void;
}

/**
 * Porta única para qualquer áudio do site. Com os sons desligados (o padrão),
 * `play` e `speak` não fazem absolutamente nada.
 */
export function useSound(): SoundApi {
  const { settings } = useSettings();
  const enabled = settings.sound;
  // No modo calmo, tudo soa mais baixinho.
  const volume = settings.calmMode ? 0.55 : 1;

  const play = useCallback(
    (name: SoundName) => {
      if (enabled) playSound(name, { volume });
    },
    [enabled, volume],
  );

  const speak = useCallback(
    (text: string) => {
      if (enabled) speakText(text, { volume: volume * 0.9 });
    },
    [enabled, volume],
  );

  // Desligou os sons no meio de uma fala? Ela para na hora.
  useEffect(() => {
    if (!enabled) stopSpeaking();
  }, [enabled]);

  return { enabled, play, speak };
}
