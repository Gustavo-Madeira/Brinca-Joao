import type { ArtComponent } from '@/illustrations/Art';
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
} from '@/illustrations/animals';

export interface AnimalInfo {
  id: string;
  name: string;
  /** Som do animal, como aparece escrito no balãozinho. */
  sound: string;
  /** Frase curta e simples sobre o animal. */
  fact: string;
  /** Texto falado pela voz do aparelho (quando os sons estão ligados). */
  spoken: string;
  art: ArtComponent;
}

/**
 * Os animais do jogo. Para acrescentar um, desenhe o rosto em
 * `src/illustrations/animals.tsx` e adicione uma linha aqui.
 */
export const ANIMALS: readonly AnimalInfo[] = [
  {
    id: 'cachorro',
    name: 'Cachorro',
    sound: 'Au au!',
    fact: 'O cachorro adora brincar.',
    spoken: 'Cachorro. Au, au! O cachorro adora brincar.',
    art: Dog,
  },
  {
    id: 'gato',
    name: 'Gato',
    sound: 'Miau!',
    fact: 'O gato gosta de carinho.',
    spoken: 'Gato. Miau! O gato gosta de carinho.',
    art: Cat,
  },
  {
    id: 'vaca',
    name: 'Vaca',
    sound: 'Muuu!',
    fact: 'A vaca come capim.',
    spoken: 'Vaca. Muuu! A vaca come capim.',
    art: Cow,
  },
  {
    id: 'porco',
    name: 'Porco',
    sound: 'Óinc óinc!',
    fact: 'O porco gosta de lama.',
    spoken: 'Porco. Óinc, óinc! O porco gosta de lama.',
    art: Pig,
  },
  {
    id: 'pato',
    name: 'Pato',
    sound: 'Quá quá!',
    fact: 'O pato sabe nadar.',
    spoken: 'Pato. Quá, quá! O pato sabe nadar.',
    art: Duck,
  },
  {
    id: 'ovelha',
    name: 'Ovelha',
    sound: 'Bééé!',
    fact: 'A ovelha tem lã macia.',
    spoken: 'Ovelha. Béé! A ovelha tem lã macia.',
    art: Sheep,
  },
  {
    id: 'sapo',
    name: 'Sapo',
    sound: 'Croac croac!',
    fact: 'O sapo pula bem alto.',
    spoken: 'Sapo. Croac, croac! O sapo pula bem alto.',
    art: Frog,
  },
  {
    id: 'leao',
    name: 'Leão',
    sound: 'Roaar!',
    fact: 'O leão tem uma juba grande.',
    spoken: 'Leão. Roar! O leão tem uma juba grande.',
    art: Lion,
  },
  {
    id: 'galinha',
    name: 'Galinha',
    sound: 'Có có có!',
    fact: 'A galinha bota ovos.',
    spoken: 'Galinha. Có, có, có! A galinha bota ovos.',
    art: Chicken,
  },
  {
    id: 'cavalo',
    name: 'Cavalo',
    sound: 'Iiirrí!',
    fact: 'O cavalo corre bem rápido.',
    spoken: 'Cavalo. Irrí! O cavalo corre bem rápido.',
    art: Horse,
  },
  {
    id: 'macaco',
    name: 'Macaco',
    sound: 'Uh uh ah ah!',
    fact: 'O macaco adora bananas.',
    spoken: 'Macaco. Uh, uh, ah, ah! O macaco adora bananas.',
    art: Monkey,
  },
  {
    id: 'elefante',
    name: 'Elefante',
    sound: 'Fuuuó!',
    fact: 'O elefante tem uma tromba comprida.',
    spoken: 'Elefante. Fuó! O elefante tem uma tromba comprida.',
    art: Elephant,
  },
];
