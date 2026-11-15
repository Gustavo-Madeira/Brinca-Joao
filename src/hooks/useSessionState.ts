import { useCallback, useState } from 'react';
import type { Difficulty } from '@/types';

type Updater<S> = S | ((current: S) => S);

/**
 * Estado de uma partida que recomeça sozinho quando o nível muda.
 *
 * - `create(level)` monta uma partida nova (pode sortear à vontade);
 * - trocar o nível — pelo seletor do jogo ou pelas configurações — cria
 *   outra partida na hora, sem desmontar a tela (o foco do teclado fica onde está);
 * - `restart()` sorteia uma partida nova no mesmo nível.
 *
 * `create` deve ser uma função estável (declarada fora do componente).
 */
export function useSessionState<S>(
  level: Difficulty,
  create: (level: Difficulty) => S,
): [S, (update: Updater<S>) => void, () => void] {
  const [box, setBox] = useState(() => ({ level, state: create(level) }));

  let current = box;
  if (box.level !== level) {
    // Ajuste de estado durante a renderização: o React refaz a tela em
    // seguida, já com a partida nova, sem mostrar a antiga.
    current = { level, state: create(level) };
    setBox(current);
  }

  const setState = useCallback((update: Updater<S>) => {
    setBox((previous) => ({
      level: previous.level,
      state:
        typeof update === 'function' ? (update as (value: S) => S)(previous.state) : update,
    }));
  }, []);

  const restart = useCallback(() => {
    setBox({ level, state: create(level) });
  }, [level, create]);

  return [current.state, setState, restart];
}
