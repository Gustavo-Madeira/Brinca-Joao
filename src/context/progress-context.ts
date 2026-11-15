import { createContext } from 'react';
import { isDifficulty } from '@/config/difficulty';
import type { Difficulty, GameId, Progress } from '@/types';

export const PROGRESS_KEY = 'progresso';

export const GAME_IDS: readonly GameId[] = [
  'cores',
  'formas',
  'memoria',
  'quebra-cabeca',
  'animais',
  'desenho',
];

export const EMPTY_PROGRESS: Progress = { levels: {}, plays: {}, animalsSeen: [] };

export interface ProgressContextValue {
  progress: Progress;
  /** Guarda o nível escolhido dentro de um jogo. */
  setGameLevel: (gameId: GameId, level: Difficulty) => void;
  /** Esquece os níveis por jogo: todos voltam a usar o nível inicial. */
  clearGameLevels: () => void;
  /** Conta mais uma brincadeira concluída. */
  recordPlay: (gameId: GameId) => void;
  markAnimalSeen: (animalId: string) => void;
  resetProgress: () => void;
}

export const ProgressContext = createContext<ProgressContextValue | null>(null);

function isGameId(value: string): value is GameId {
  return (GAME_IDS as readonly string[]).includes(value);
}

/** Valida o progresso salvo, descartando qualquer coisa inesperada. */
export function sanitizeProgress(raw: unknown): Progress {
  const result: Progress = { levels: {}, plays: {}, animalsSeen: [] };
  if (typeof raw !== 'object' || raw === null) return result;
  const data = raw as Record<string, unknown>;

  if (typeof data.levels === 'object' && data.levels !== null) {
    for (const [key, value] of Object.entries(data.levels as Record<string, unknown>)) {
      if (isGameId(key) && isDifficulty(value)) result.levels[key] = value;
    }
  }

  if (typeof data.plays === 'object' && data.plays !== null) {
    for (const [key, value] of Object.entries(data.plays as Record<string, unknown>)) {
      if (isGameId(key) && typeof value === 'number' && Number.isFinite(value) && value > 0) {
        result.plays[key] = Math.min(99999, Math.floor(value));
      }
    }
  }

  if (Array.isArray(data.animalsSeen)) {
    const seen = data.animalsSeen.filter(
      (item): item is string => typeof item === 'string' && item.length < 40,
    );
    result.animalsSeen = Array.from(new Set(seen)).slice(0, 100);
  }

  return result;
}
