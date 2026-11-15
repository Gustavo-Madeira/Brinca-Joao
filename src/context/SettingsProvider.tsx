import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_SETTINGS, SETTINGS_KEY, sanitizeSettings } from '@/config/settings';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { Settings } from '@/types';
import { readStorage, writeStorage } from '@/utils/storage';
import { SettingsContext } from './settings-context';
import type { SettingsContextValue } from './settings-context';

/**
 * Guarda as preferências, salva no navegador e aplica os ajustes visuais
 * no elemento <html> (tamanho, modo calmo e movimento).
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() =>
    sanitizeSettings(readStorage(SETTINGS_KEY)),
  );
  const prefersReducedMotion = usePrefersReducedMotion();
  const motionEnabled = settings.animations && !settings.calmMode && !prefersReducedMotion;

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.size = settings.size;
    root.dataset.calm = settings.calmMode ? 'true' : 'false';
    root.dataset.motion = motionEnabled ? 'on' : 'off';
  }, [settings.size, settings.calmMode, motionEnabled]);

  useEffect(() => {
    writeStorage(SETTINGS_KEY, settings);
  }, [settings]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, updateSettings, resetSettings, prefersReducedMotion, motionEnabled }),
    [settings, updateSettings, resetSettings, prefersReducedMotion, motionEnabled],
  );

  return <SettingsContext value={value}>{children}</SettingsContext>;
}
