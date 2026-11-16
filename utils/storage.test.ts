import { describe, expect, it, vi } from 'vitest';
import {
  STORAGE_PREFIX,
  clearAllStorage,
  readStorage,
  removeStorage,
  writeStorage,
  writeStorageText,
} from './storage';

describe('armazenamento local', () => {
  it('salva e lê um valor', () => {
    expect(writeStorage('teste', { a: 1, b: ['x'] })).toBe(true);
    expect(readStorage('teste')).toEqual({ a: 1, b: ['x'] });
  });

  it('usa sempre o prefixo do site nas chaves', () => {
    writeStorage('teste', 1);
    expect(window.localStorage.getItem(`${STORAGE_PREFIX}teste`)).toBe('1');
  });

  it('devolve null para chave que não existe', () => {
    expect(readStorage('nada-aqui')).toBeNull();
  });

  it('devolve null (sem quebrar) quando o conteúdo salvo está corrompido', () => {
    window.localStorage.setItem(`${STORAGE_PREFIX}quebrado`, '{isto não é json');
    expect(readStorage('quebrado')).toBeNull();
  });

  it('writeStorageText guarda um JSON pronto sem converter de novo', () => {
    writeStorageText('texto', '{"v":1}');
    expect(readStorage('texto')).toEqual({ v: 1 });
  });

  it('removeStorage apaga só a chave pedida', () => {
    writeStorage('um', 1);
    writeStorage('dois', 2);
    removeStorage('um');
    expect(readStorage('um')).toBeNull();
    expect(readStorage('dois')).toBe(2);
  });

  it('clearAllStorage apaga só o que é do Brinca João', () => {
    writeStorage('preferencias', { sound: true });
    writeStorage('progresso', {});
    window.localStorage.setItem('outro-site', 'fica');
    clearAllStorage();
    expect(readStorage('preferencias')).toBeNull();
    expect(readStorage('progresso')).toBeNull();
    expect(window.localStorage.getItem('outro-site')).toBe('fica');
  });

  it('continua funcionando quando o navegador recusa salvar', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('cota cheia');
    });
    expect(writeStorage('teste', 1)).toBe(false);
    expect(writeStorageText('teste', '1')).toBe(false);
    spy.mockRestore();
  });

  it('continua funcionando quando o navegador recusa ler', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    expect(readStorage('teste')).toBeNull();
    spy.mockRestore();
  });
});
