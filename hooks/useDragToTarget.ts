import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent, PointerEvent } from 'react';

/** Distância (em px) a partir da qual um toque vira arrasto. */
const DRAG_THRESHOLD = 10;

interface DragState {
  itemId: string;
  pointerId: number;
  element: HTMLElement;
  startX: number;
  startY: number;
  dragging: boolean;
  hovered: HTMLElement | null;
}

export interface DragBindings {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLElement>) => void;
  onClickCapture: (event: MouseEvent<HTMLElement>) => void;
}

interface DragOptions {
  /**
   * Chamado quando a peça é solta. `targetId` é o valor de `data-drop-id`
   * do lugar sob o dedo, ou `null` se ela foi solta fora de qualquer lugar.
   */
  onDrop: (itemId: string, targetId: string | null) => void;
}

/** Marca (ou desmarca) o lugar que está embaixo da peça durante o arrasto. */
function setHovered(state: DragState, next: HTMLElement | null): void {
  if (state.hovered === next) return;
  state.hovered?.removeAttribute('data-drag-over');
  next?.setAttribute('data-drag-over', 'true');
  state.hovered = next;
}

function findDropTarget(x: number, y: number, dragged: HTMLElement): HTMLElement | null {
  if (typeof document.elementsFromPoint !== 'function') return null;
  for (const element of document.elementsFromPoint(x, y)) {
    if (dragged.contains(element)) continue;
    const target = element.closest<HTMLElement>('[data-drop-id]');
    if (target && !dragged.contains(target)) return target;
  }
  return null;
}

/**
 * Arrastar é um atalho opcional — nunca o único caminho.
 *
 * Os jogos de encaixe funcionam por toque (toca na peça, toca no lugar) e
 * por teclado. Este gancho acrescenta o arrasto para quem prefere: funciona
 * com dedo, mouse e caneta, e um arrasto que termina fora de um lugar
 * apenas deixa a peça selecionada, sem punir a imprecisão.
 *
 * Uso: espalhe `bind(id)` no botão da peça e marque cada lugar com
 * `data-drop-id`. A peça precisa de `touch-action: none` no CSS.
 */
export function useDragToTarget({ onDrop }: DragOptions): (itemId: string) => DragBindings {
  const stateRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const onDropRef = useRef(onDrop);

  useEffect(() => {
    onDropRef.current = onDrop;
  });

  const finish = useCallback((state: DragState) => {
    const { element } = state;
    setHovered(state, null);
    element.style.transform = '';
    element.style.transition = '';
    element.style.zIndex = '';
    element.removeAttribute('data-dragging');
    try {
      element.releasePointerCapture(state.pointerId);
    } catch {
      // A captura já tinha sido liberada pelo navegador.
    }
  }, []);

  return useCallback(
    (itemId: string): DragBindings => ({
      onPointerDown(event) {
        if (!event.isPrimary) return;
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        stateRef.current = {
          itemId,
          pointerId: event.pointerId,
          element: event.currentTarget,
          startX: event.clientX,
          startY: event.clientY,
          dragging: false,
          hovered: null,
        };
      },

      onPointerMove(event) {
        const state = stateRef.current;
        if (!state || state.pointerId !== event.pointerId) return;
        const dx = event.clientX - state.startX;
        const dy = event.clientY - state.startY;

        if (!state.dragging) {
          if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
          state.dragging = true;
          state.element.setAttribute('data-dragging', 'true');
          state.element.style.transition = 'none';
          state.element.style.zIndex = '30';
          try {
            state.element.setPointerCapture(event.pointerId);
          } catch {
            // Sem captura, o arrasto ainda funciona enquanto o dedo estiver sobre a peça.
          }
        }

        state.element.style.transform = `translate(${dx}px, ${dy}px) scale(1.06)`;
        setHovered(state, findDropTarget(event.clientX, event.clientY, state.element));
      },

      onPointerUp(event) {
        const state = stateRef.current;
        if (!state || state.pointerId !== event.pointerId) return;
        stateRef.current = null;
        if (!state.dragging) return; // Foi um toque simples: o onClick cuida.

        const target = findDropTarget(event.clientX, event.clientY, state.element);
        finish(state);

        // O navegador ainda dispara um "click" depois de soltar; ele não deve
        // desfazer a seleção que o arrasto acabou de fazer.
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 80);

        onDropRef.current(state.itemId, target?.getAttribute('data-drop-id') ?? null);
      },

      onPointerCancel(event) {
        const state = stateRef.current;
        if (!state || state.pointerId !== event.pointerId) return;
        stateRef.current = null;
        if (state.dragging) finish(state);
      },

      onClickCapture(event) {
        if (!suppressClickRef.current) return;
        suppressClickRef.current = false;
        event.preventDefault();
        event.stopPropagation();
      },
    }),
    [finish],
  );
}
