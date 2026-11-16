import { useContext } from 'react';
import { SettingsContext } from '@/context/settings-context';
import type { SettingsContextValue } from '@/context/settings-context';

export function useSettings(): SettingsContextValue {
  const value = useContext(SettingsContext);
  if (!value) {
    throw new Error('useSettings precisa estar dentro de <SettingsProvider>.');
  }
  return value;
}
