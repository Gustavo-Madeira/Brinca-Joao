import type { ComponentType, LazyExoticComponent } from 'react';

/** Níveis de dificuldade dos jogos com desafio. */
export type Difficulty = 'facil' | 'medio' | 'desafio';

/** Tamanho geral dos elementos da tela. */
export type ElementSize = 'normal' | 'grande' | 'enorme';

/** Preferências salvas no navegador (nunca saem do aparelho). */
export interface Settings {
  /** Sons e voz. Começam sempre desligados. */
  sound: boolean;
  /** Animações suaves. */
  animations: boolean;
  /** Modo calmo: menos movimento e menos enfeites. */
  calmMode: boolean;
  /** Tamanho dos elementos. */
  size: ElementSize;
  /** Nível inicial dos jogos. */
  difficulty: Difficulty;
}

/** Identificador de cada jogo (também é o trecho do endereço). */
export type GameId = 'cores' | 'formas' | 'memoria' | 'quebra-cabeca' | 'animais' | 'desenho';

/** Paletas de tema disponíveis em `styles/tokens.css`. */
export type ThemeName = 'sky' | 'sun' | 'leaf' | 'lilac' | 'peach' | 'rose';

/** Progresso local, guardado só neste aparelho. */
export interface Progress {
  /** Nível escolhido dentro de cada jogo (substitui o nível inicial). */
  levels: Partial<Record<GameId, Difficulty>>;
  /** Quantas vezes cada brincadeira foi concluída. */
  plays: Partial<Record<GameId, number>>;
  /** Animais já visitados em "Descubra os Animais". */
  animalsSeen: string[];
}

/** Ficha de um jogo no catálogo. Para criar um jogo novo, basta uma ficha nova. */
export interface GameMeta {
  id: GameId;
  /** Trecho do endereço: /jogos/<slug>. */
  slug: string;
  title: string;
  description: string;
  emoji: string;
  theme: ThemeName;
  /** Se o jogo tem os três níveis de dificuldade. */
  hasLevels: boolean;
  /** Ilustração do cartão. */
  Thumb: ComponentType<{ className?: string }>;
  /** Carrega o código do jogo só quando ele é aberto. */
  load: () => Promise<{ default: ComponentType<GameProps> }>;
  Component: LazyExoticComponent<ComponentType<GameProps>>;
}

/** O que todo jogo recebe da página que o hospeda. */
export interface GameProps {
  game: GameMeta;
}
