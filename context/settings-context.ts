import { createContext } from 'react';
import type { Settings } from '@/types';

export interface SettingsContextValue {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  resetSettings: () => void;
  /** O aparelho pediu "movimento reduzido" nas configurações do sistema. */
  prefersReducedMotion: boolean;
  /**
   * Resultado final: só há movimento se as animações estão ligadas, o modo
   * calmo está desligado e o aparelho não pediu movimento reduzido.
   */
  motionEnabled: boolean;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);
