/**
 * Acesso seguro ao localStorage.
 *
 * O Brinca João guarda apenas preferências e progresso, sempre no próprio
 * aparelho. Se o navegador bloquear o armazenamento (modo privado, cota
 * cheia, política da escola), o site continua funcionando normalmente —
 * só não lembra as escolhas na próxima visita.
 */

export const STORAGE_PREFIX = 'brinca-joao:';

function getStore(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Lê e interpreta um valor salvo. Devolve `null` se não existir ou estiver corrompido. */
export function readStorage(key: string): unknown {
  const store = getStore();
  if (!store) return null;
  try {
    const raw = store.getItem(STORAGE_PREFIX + key);
    if (raw === null) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

/** Salva um valor. Devolve `false` se não foi possível salvar. */
export function writeStorage(key: string, value: unknown): boolean {
  const store = getStore();
  if (!store) return false;
  try {
    store.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Salva um texto que já está em formato JSON (evita converter duas vezes
 * conteúdos grandes, como o desenho). `readStorage` lê normalmente depois.
 */
export function writeStorageText(key: string, json: string): boolean {
  const store = getStore();
  if (!store) return false;
  try {
    store.setItem(STORAGE_PREFIX + key, json);
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key: string): void {
  const store = getStore();
  if (!store) return;
  try {
    store.removeItem(STORAGE_PREFIX + key);
  } catch {
    // Sem armazenamento disponível: não há nada para apagar.
  }
}

/** Apaga tudo o que o Brinca João guardou neste aparelho. */
export function clearAllStorage(): void {
  const store = getStore();
  if (!store) return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < store.length; i += 1) {
      const key = store.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) keys.push(key);
    }
    keys.forEach((key) => store.removeItem(key));
  } catch {
    // Sem armazenamento disponível: não há nada para apagar.
  }
}
