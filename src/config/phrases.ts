import { pickOne } from '@/utils/random';
import type { Rng } from '@/utils/random';

/**
 * Frases dos jogos: sempre curtas, positivas e sem bronca.
 * Quando algo não dá certo, a mensagem é um convite para tentar de novo.
 */

const PRAISE = ['Isso mesmo!', 'Muito bem!', 'Que legal!', 'Você conseguiu!', 'Boa!'] as const;

const TRY_AGAIN = ['Quase!', 'Tudo bem!', 'Vamos de novo?'] as const;

export function praise(rng: Rng = Math.random): string {
  return pickOne(PRAISE, rng);
}

export function tryAgain(rng: Rng = Math.random): string {
  return pickOne(TRY_AGAIN, rng);
}
