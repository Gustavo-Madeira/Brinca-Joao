import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/**
 * Quando um botão some depois de ser usado (por exemplo "Próxima"), o foco
 * do teclado ficaria perdido no começo da página. Este gancho devolve o foco
 * para `ref` sempre que `trigger` mudar *e* o foco tiver se perdido.
 *
 * Se a pessoa está com o foco em outro controle (trocando o nível, por
 * exemplo), nada acontece: o foco dela é respeitado.
 */
export function useRefocusWhenLost(ref: RefObject<HTMLElement | null>, trigger: unknown): void {
  const previous = useRef(trigger);

  useEffect(() => {
    if (Object.is(previous.current, trigger)) return;
    previous.current = trigger;
    const active = document.activeElement;
    if (!active || active === document.body) {
      ref.current?.focus({ preventScroll: true });
    }
  }, [ref, trigger]);
}

/**
 * Mostra um elemento na tela (rolando só se for preciso) e leva o foco até
 * ele. A rolagem é suave apenas quando o movimento está ligado.
 */
export function revealAndFocus(element: HTMLElement | null): void {
  if (!element) return;
  if (typeof element.scrollIntoView === 'function') {
    const smooth = document.documentElement.dataset.motion === 'on';
    element.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'nearest' });
  }
  element.focus({ preventScroll: true });
}
