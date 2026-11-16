import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Difficulty, GameId, Progress } from '@/types';
import { readStorage, writeStorage } from '@/utils/storage';
import { EMPTY_PROGRESS, PROGRESS_KEY, ProgressContext, sanitizeProgress } from './progress-context';
import type { ProgressContextValue } from './progress-context';

/** Guarda o progresso local (níveis por jogo, brincadeiras concluídas, animais visitados). */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() =>
    sanitizeProgress(readStorage(PROGRESS_KEY)),
  );

  useEffect(() => {
    writeStorage(PROGRESS_KEY, progress);
  }, [progress]);

  const setGameLevel = useCallback((gameId: GameId, level: Difficulty) => {
    setProgress((current) =>
      current.levels[gameId] === level
        ? current
        : { ...current, levels: { ...current.levels, [gameId]: level } },
    );
  }, []);

  const clearGameLevels = useCallback(() => {
    setProgress((current) =>
      Object.keys(current.levels).length === 0 ? current : { ...current, levels: {} },
    );
  }, []);

  const recordPlay = useCallback((gameId: GameId) => {
    setProgress((current) => ({
      ...current,
      plays: { ...current.plays, [gameId]: Math.min(99999, (current.plays[gameId] ?? 0) + 1) },
    }));
  }, []);

  const markAnimalSeen = useCallback((animalId: string) => {
    setProgress((current) =>
      current.animalsSeen.includes(animalId)
        ? current
        : { ...current, animalsSeen: [...current.animalsSeen, animalId] },
    );
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({ ...EMPTY_PROGRESS, levels: {}, plays: {}, animalsSeen: [] });
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({ progress, setGameLevel, clearGameLevels, recordPlay, markAnimalSeen, resetProgress }),
    [progress, setGameLevel, clearGameLevels, recordPlay, markAnimalSeen, resetProgress],
  );

  return <ProgressContext value={value}>{children}</ProgressContext>;
}
