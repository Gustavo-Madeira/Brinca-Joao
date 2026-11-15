import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function getMediaQuery(): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null;
  return window.matchMedia(QUERY);
}

function subscribe(onChange: () => void): () => void {
  const query = getMediaQuery();
  if (!query) return () => undefined;
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }
  // Navegadores antigos.
  query.addListener(onChange);
  return () => query.removeListener(onChange);
}

function getSnapshot(): boolean {
  return getMediaQuery()?.matches ?? false;
}

/** `true` quando o aparelho está configurado para reduzir movimento. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
