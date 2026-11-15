import type { ElementSize, Settings } from '@/types';
import { isDifficulty } from './difficulty';

export const SETTINGS_KEY = 'preferencias';

/**
 * Padrões pensados para uma primeira visita tranquila:
 * sons desligados, nível fácil e tamanho normal.
 */
export const DEFAULT_SETTINGS: Settings = {
  sound: false,
  animations: true,
  calmMode: false,
  size: 'normal',
  difficulty: 'facil',
};

export interface SizeInfo {
  id: ElementSize;
  label: string;
}

export const SIZES: readonly SizeInfo[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'grande', label: 'Grande' },
  { id: 'enorme', label: 'Bem grande' },
];

function isElementSize(value: unknown): value is ElementSize {
  return value === 'normal' || value === 'grande' || value === 'enorme';
}

/**
 * Valida o que veio do armazenamento. Qualquer valor estranho (dado antigo,
 * corrompido ou editado à mão) volta para o padrão seguro.
 */
export function sanitizeSettings(raw: unknown): Settings {
  if (typeof raw !== 'object' || raw === null) return { ...DEFAULT_SETTINGS };
  const data = raw as Record<string, unknown>;
  return {
    sound: typeof data.sound === 'boolean' ? data.sound : DEFAULT_SETTINGS.sound,
    animations:
      typeof data.animations === 'boolean' ? data.animations : DEFAULT_SETTINGS.animations,
    calmMode: typeof data.calmMode === 'boolean' ? data.calmMode : DEFAULT_SETTINGS.calmMode,
    size: isElementSize(data.size) ? data.size : DEFAULT_SETTINGS.size,
    difficulty: isDifficulty(data.difficulty) ? data.difficulty : DEFAULT_SETTINGS.difficulty,
  };
}
