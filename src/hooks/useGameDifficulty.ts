import { useCallback } from 'react';
import type { Difficulty, GameId } from '@/types';
import { useProgress } from './useProgress';
import { useSettings } from './useSettings';

/**
 * Nível de um jogo: começa no "nível inicial" das configurações e passa a
 * lembrar a escolha feita dentro do próprio jogo.
 */
export function useGameDifficulty(gameId: GameId): [Difficulty, (level: Difficulty) => void] {
  const { settings } = useSettings();
  const { progress, setGameLevel } = useProgress();
  const level = progress.levels[gameId] ?? settings.difficulty;

  const setLevel = useCallback(
    (next: Difficulty) => setGameLevel(gameId, next),
    [gameId, setGameLevel],
  );

  return [level, setLevel];
}
