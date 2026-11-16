import type { Difficulty } from '@/types';

export interface DifficultyInfo {
  id: Difficulty;
  label: string;
  /** Explicação curta para quem acompanha a criança. */
  hint: string;
  /** 1, 2 ou 3 — vira bolinhas na tela, para não depender só do texto. */
  level: 1 | 2 | 3;
}

export const DIFFICULTIES: readonly DifficultyInfo[] = [
  { id: 'facil', label: 'Fácil', hint: 'Poucos elementos e mais ajuda.', level: 1 },
  { id: 'medio', label: 'Médio', hint: 'Mais elementos para explorar.', level: 2 },
  { id: 'desafio', label: 'Desafio', hint: 'Um pouco mais elaborado.', level: 3 },
];

export function isDifficulty(value: unknown): value is Difficulty {
  return value === 'facil' || value === 'medio' || value === 'desafio';
}

export function getDifficultyInfo(id: Difficulty): DifficultyInfo {
  return DIFFICULTIES.find((item) => item.id === id) ?? (DIFFICULTIES[0] as DifficultyInfo);
}

/** Próximo nível, se existir. A progressão é sempre um convite, nunca uma obrigação. */
export function nextDifficulty(id: Difficulty): Difficulty | null {
  if (id === 'facil') return 'medio';
  if (id === 'medio') return 'desafio';
  return null;
}
