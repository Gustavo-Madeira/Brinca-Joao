import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';

/*
 * Preparação comum dos testes. O jsdom (o "navegador de mentira" dos testes)
 * não tem algumas APIs de tela; aqui entram versões mínimas delas.
 */

beforeEach(() => {
  window.localStorage.clear();
  const root = document.documentElement;
  root.removeAttribute('data-size');
  root.removeAttribute('data-calm');
  root.removeAttribute('data-motion');
});

afterEach(() => {
  cleanup();
});

// Preferência de movimento do sistema: nos testes, "sem preferência".
if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      }) as MediaQueryList,
  });
}

// Rolagem: o jsdom não desenha nada, então não há o que rolar.
window.scrollTo = () => undefined;
Element.prototype.scrollIntoView = () => undefined;

class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
if (typeof window.ResizeObserver === 'undefined') {
  window.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

// Tela de desenho: um contexto 2D que aceita os comandos e não desenha.
const context2d = {
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  lineCap: 'butt',
  lineJoin: 'miter',
  fillRect: () => undefined,
  beginPath: () => undefined,
  arc: () => undefined,
  fill: () => undefined,
  moveTo: () => undefined,
  lineTo: () => undefined,
  quadraticCurveTo: () => undefined,
  stroke: () => undefined,
};
HTMLCanvasElement.prototype.getContext = (() =>
  context2d) as unknown as typeof HTMLCanvasElement.prototype.getContext;
