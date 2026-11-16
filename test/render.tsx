import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { SETTINGS_KEY, DEFAULT_SETTINGS } from '@/config/settings';
import { ProgressProvider } from '@/context/ProgressProvider';
import { SettingsProvider } from '@/context/SettingsProvider';
import { getGameBySlug } from '@/games/registry';
import type { GameMeta, Settings } from '@/types';
import { STORAGE_PREFIX } from '@/utils/storage';

interface RenderOptions {
  /** Endereço inicial (o roteador dos testes guarda a navegação na memória). */
  route?: string;
  /** Preferências já salvas antes de a tela abrir. */
  settings?: Partial<Settings>;
}

interface AppRenderResult extends RenderResult {
  user: UserEvent;
  /** Endereços visitados, do primeiro ao atual. */
  history: string[];
}

/** Monta um componente com tudo o que o site oferece em volta: preferências, progresso e rotas. */
export function renderWithApp(ui: ReactElement, options: RenderOptions = {}): AppRenderResult {
  if (options.settings) {
    window.localStorage.setItem(
      STORAGE_PREFIX + SETTINGS_KEY,
      JSON.stringify({ ...DEFAULT_SETTINGS, ...options.settings }),
    );
  }

  const location = memoryLocation({ path: options.route ?? '/', record: true });
  const user = userEvent.setup();
  const result = render(
    <Router hook={location.hook}>
      <SettingsProvider>
        <ProgressProvider>{ui}</ProgressProvider>
      </SettingsProvider>
    </Router>,
  );

  return { ...result, user, history: location.history };
}

/** Ficha de um jogo do catálogo (falha o teste se o endereço não existir). */
export function gameMeta(slug: string): GameMeta {
  const game = getGameBySlug(slug);
  if (!game) throw new Error(`Jogo não encontrado no catálogo: ${slug}`);
  return game;
}

/** Lê o que o site guardou no navegador sob uma chave. */
export function readSaved<T>(key: string): T | null {
  const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
  return raw === null ? null : (JSON.parse(raw) as T);
}
