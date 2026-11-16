import type { ArtComponent } from './Art';
import {
  Cat,
  Chicken,
  Cow,
  Dog,
  Duck,
  Elephant,
  Frog,
  Horse,
  Lion,
  Monkey,
  Pig,
  Sheep,
} from './animals';
import { Apple, Banana, Grapes, Orange, Strawberry, Watermelon } from './fruits';
import { Ball, Boat, Car, Kite, Rocket, Teddy } from './toys';

export type PictureGroup = 'animal' | 'fruta' | 'brinquedo';

/** Uma figura do acervo, com nome em português para leitores de tela e voz. */
export interface Picture {
  id: string;
  name: string;
  group: PictureGroup;
  art: ArtComponent;
}

/**
 * Acervo de figuras do site. Para acrescentar uma figura nova, desenhe o
 * componente (120×120) e inclua uma linha aqui: ela passa a aparecer
 * automaticamente no Jogo da Memória.
 */
export const PICTURES: readonly Picture[] = [
  { id: 'cachorro', name: 'Cachorro', group: 'animal', art: Dog },
  { id: 'gato', name: 'Gato', group: 'animal', art: Cat },
  { id: 'vaca', name: 'Vaca', group: 'animal', art: Cow },
  { id: 'porco', name: 'Porco', group: 'animal', art: Pig },
  { id: 'pato', name: 'Pato', group: 'animal', art: Duck },
  { id: 'ovelha', name: 'Ovelha', group: 'animal', art: Sheep },
  { id: 'sapo', name: 'Sapo', group: 'animal', art: Frog },
  { id: 'leao', name: 'Leão', group: 'animal', art: Lion },
  { id: 'galinha', name: 'Galinha', group: 'animal', art: Chicken },
  { id: 'cavalo', name: 'Cavalo', group: 'animal', art: Horse },
  { id: 'macaco', name: 'Macaco', group: 'animal', art: Monkey },
  { id: 'elefante', name: 'Elefante', group: 'animal', art: Elephant },
  { id: 'maca', name: 'Maçã', group: 'fruta', art: Apple },
  { id: 'banana', name: 'Banana', group: 'fruta', art: Banana },
  { id: 'morango', name: 'Morango', group: 'fruta', art: Strawberry },
  { id: 'uva', name: 'Uva', group: 'fruta', art: Grapes },
  { id: 'laranja', name: 'Laranja', group: 'fruta', art: Orange },
  { id: 'melancia', name: 'Melancia', group: 'fruta', art: Watermelon },
  { id: 'bola', name: 'Bola', group: 'brinquedo', art: Ball },
  { id: 'pipa', name: 'Pipa', group: 'brinquedo', art: Kite },
  { id: 'ursinho', name: 'Ursinho', group: 'brinquedo', art: Teddy },
  { id: 'carrinho', name: 'Carrinho', group: 'brinquedo', art: Car },
  { id: 'foguete', name: 'Foguete', group: 'brinquedo', art: Rocket },
  { id: 'barco', name: 'Barco', group: 'brinquedo', art: Boat },
];

export function getPicture(id: string): Picture | undefined {
  return PICTURES.find((picture) => picture.id === id);
}
