import type { ReactElement } from 'react';
import { DogScene, FarmScene, PipoScene, RocketScene, SeaScene, TrainScene } from './SceneArt';

export type SceneId = 'pipo' | 'cachorro' | 'mar' | 'foguete' | 'trem' | 'fazenda';

export interface Scene {
  id: SceneId;
  name: string;
  /** Desenho da imagem, em uma área de 300×300. */
  art: () => ReactElement;
}

/**
 * Imagens disponíveis no quebra-cabeça. Para acrescentar uma, desenhe a cena
 * em `SceneArt.tsx` (300×300) e inclua aqui e em `SceneId`.
 */
export const SCENES: readonly Scene[] = [
  { id: 'pipo', name: 'Pipo no céu', art: PipoScene },
  { id: 'cachorro', name: 'Cachorrinho', art: DogScene },
  { id: 'mar', name: 'Fundo do mar', art: SeaScene },
  { id: 'foguete', name: 'Foguete', art: RocketScene },
  { id: 'trem', name: 'Trenzinho', art: TrainScene },
  { id: 'fazenda', name: 'Fazenda', art: FarmScene },
];

export function getScene(id: SceneId): Scene {
  return SCENES.find((scene) => scene.id === id) ?? (SCENES[0] as Scene);
}

/** A imagem seguinte da lista (depois da última, volta para a primeira). */
export function nextSceneId(id: SceneId): SceneId {
  const index = SCENES.findIndex((scene) => scene.id === id);
  return (SCENES[(index + 1) % SCENES.length] as Scene).id;
}
