import { useContext } from 'react';
import { ProgressContext } from '@/context/progress-context';
import type { ProgressContextValue } from '@/context/progress-context';

export function useProgress(): ProgressContextValue {
  const value = useContext(ProgressContext);
  if (!value) {
    throw new Error('useProgress precisa estar dentro de <ProgressProvider>.');
  }
  return value;
}
