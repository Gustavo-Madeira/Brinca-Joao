import type { ReactElement } from 'react';
import type { ColorDef } from './colors';
import { Balloon, Bucket, Butterfly, Fish, Flower, Shirt, ToyCar, Umbrella } from './ObjectArt';

export type ObjectId =
  | 'balao'
  | 'peixe'
  | 'carrinho'
  | 'camiseta'
  | 'flor'
  | 'borboleta'
  | 'guarda-chuva'
  | 'balde';

/** Os três tons de uma cor, usados para pintar uma figura. */
export interface Tint {
  base: string;
  dark: string;
  light: string;
}

export type TintedArt = (tint: Tint) => ReactElement;

export interface ObjectDef {
  id: ObjectId;
  name: string;
  /** Gênero da palavra, para a cor concordar: "flor amarela", "balão amarelo". */
  gender: 'm' | 'f';
  art: TintedArt;
}

/**
 * Figuras do Mundo das Cores. Para acrescentar uma, desenhe o componente em
 * `ObjectArt.tsx` (usando só os três tons recebidos) e inclua uma linha aqui.
 */
export const OBJECTS: readonly ObjectDef[] = [
  { id: 'balao', name: 'Balão', gender: 'm', art: Balloon },
  { id: 'peixe', name: 'Peixe', gender: 'm', art: Fish },
  { id: 'carrinho', name: 'Carrinho', gender: 'm', art: ToyCar },
  { id: 'camiseta', name: 'Camiseta', gender: 'f', art: Shirt },
  { id: 'flor', name: 'Flor', gender: 'f', art: Flower },
  { id: 'borboleta', name: 'Borboleta', gender: 'f', art: Butterfly },
  { id: 'guarda-chuva', name: 'Guarda-chuva', gender: 'm', art: Umbrella },
  { id: 'balde', name: 'Balde', gender: 'm', art: Bucket },
];

export const OBJECT_IDS: readonly ObjectId[] = OBJECTS.map((object) => object.id);

export function getObject(id: ObjectId): ObjectDef {
  const object = OBJECTS.find((item) => item.id === id);
  if (!object) throw new Error(`Figura desconhecida: ${id}`);
  return object;
}

/** "Balão azul", "Flor amarela": nome da figura com a cor concordando. */
export function describeObject(object: ObjectDef, color: ColorDef): string {
  return `${object.name} ${object.gender === 'f' ? color.feminine : color.name}`;
}
