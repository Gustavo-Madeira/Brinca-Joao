import type { Difficulty } from '@/types';
import { pickMany, pickOne, shuffle } from '@/utils/random';
import type { Rng } from '@/utils/random';
import type { ColorId } from './colors';
import { OBJECT_IDS } from './objects';
import type { ObjectId } from './objects';

export interface ColorOption {
  id: string;
  colorId: ColorId;
  objectId: ObjectId;
}

export interface ColorRound {
  /** A figura-modelo: "olhe esta cor". */
  target: { colorId: ColorId; objectId: ObjectId };
  /** As opções; exatamente uma tem a cor do modelo. */
  options: ColorOption[];
  correctOptionId: string;
}

interface LevelConfig {
  /** Cores que podem aparecer. */
  palette: readonly ColorId[];
  /** Quantas opções a criança vê. */
  optionCount: number;
  /**
   * `true`: todas as opções são a mesma figura do modelo (é só achar a igual).
   * `false`: as figuras são diferentes e só a cor combina.
   */
  sameObject: boolean;
}

const BASIC: readonly ColorId[] = ['vermelho', 'azul', 'amarelo', 'verde'];
const MEDIUM: readonly ColorId[] = [...BASIC, 'laranja', 'roxo', 'rosa'];
const ALL: readonly ColorId[] = [...MEDIUM, 'marrom', 'preto', 'branco'];

export const COLOR_LEVELS: Record<Difficulty, LevelConfig> = {
  facil: { palette: BASIC, optionCount: 3, sameObject: true },
  medio: { palette: MEDIUM, optionCount: 4, sameObject: false },
  desafio: { palette: ALL, optionCount: 6, sameObject: false },
};

/** Uma brincadeira completa tem cinco rodadas; depois vem a comemoração. */
export const ROUNDS_PER_SESSION = 5;

/**
 * Sorteia uma rodada. `previousColor` evita repetir a mesma cor-modelo
 * duas vezes seguidas.
 */
export function createColorRound(
  level: Difficulty,
  rng: Rng = Math.random,
  previousColor?: ColorId,
): ColorRound {
  const config = COLOR_LEVELS[level];

  const targetColor = pickOne(
    config.palette.filter((color) => color !== previousColor),
    rng,
  );
  const otherColors = pickMany(
    config.palette.filter((color) => color !== targetColor),
    config.optionCount - 1,
    rng,
  );
  const colors = shuffle([targetColor, ...otherColors], rng);

  const targetObject = pickOne(OBJECT_IDS, rng);
  const optionObjects: ObjectId[] = config.sameObject
    ? colors.map(() => targetObject)
    : pickMany(
        OBJECT_IDS.filter((object) => object !== targetObject),
        colors.length,
        rng,
      );

  const options = colors.map((colorId, index) => ({
    id: `opcao-${index}`,
    colorId,
    objectId: optionObjects[index] ?? targetObject,
  }));
  const correct = options.find((option) => option.colorId === targetColor);

  return {
    target: { colorId: targetColor, objectId: targetObject },
    options,
    correctOptionId: correct ? correct.id : 'opcao-0',
  };
}
