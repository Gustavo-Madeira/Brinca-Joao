/** Gerador de números aleatórios entre 0 (inclusive) e 1 (exclusive). */
export type Rng = () => number;

/**
 * Gerador determinístico (mulberry32). Com a mesma semente, a sequência é
 * sempre igual — útil para testes automatizados.
 */
export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Inteiro entre `min` e `max`, incluindo os dois. */
export function randomInt(min: number, max: number, rng: Rng = Math.random): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/** Devolve uma cópia embaralhada (Fisher–Yates). Não altera a lista original. */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const temp = copy[i] as T;
    copy[i] = copy[j] as T;
    copy[j] = temp;
  }
  return copy;
}

/** Escolhe um item ao acaso. A lista não pode estar vazia. */
export function pickOne<T>(items: readonly T[], rng: Rng = Math.random): T {
  if (items.length === 0) {
    throw new Error('pickOne: a lista está vazia');
  }
  return items[Math.floor(rng() * items.length)] as T;
}

/** Escolhe `count` itens diferentes ao acaso (ou todos, se houver menos). */
export function pickMany<T>(items: readonly T[], count: number, rng: Rng = Math.random): T[] {
  return shuffle(items, rng).slice(0, Math.max(0, count));
}

/**
 * Embaralha garantindo que o resultado seja diferente da ordem original
 * (quando há pelo menos dois itens distintos). Evita que um quebra-cabeça
 * já comece "resolvido".
 */
export function shuffleDifferent<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  if (items.length < 2) return items.slice();
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const result = shuffle(items, rng);
    if (result.some((item, index) => item !== items[index])) return result;
  }
  // Último recurso: gira a lista uma posição.
  return [...items.slice(1), items[0] as T];
}
