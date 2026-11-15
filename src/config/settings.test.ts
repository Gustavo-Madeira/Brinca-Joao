import { describe, expect, it } from 'vitest';
import { sanitizeProgress } from '@/context/progress-context';
import { nextDifficulty } from './difficulty';
import { DEFAULT_SETTINGS, sanitizeSettings } from './settings';

describe('preferências', () => {
  it('começam com sons desligados, nível fácil e tamanho normal', () => {
    expect(DEFAULT_SETTINGS).toEqual({
      sound: false,
      animations: true,
      calmMode: false,
      size: 'normal',
      difficulty: 'facil',
    });
  });

  it('usam o padrão quando não há nada salvo', () => {
    expect(sanitizeSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(sanitizeSettings('texto solto')).toEqual(DEFAULT_SETTINGS);
  });

  it('aproveitam os valores válidos e trocam os inválidos pelo padrão', () => {
    const result = sanitizeSettings({
      sound: true,
      animations: 'sim',
      calmMode: true,
      size: 'gigante',
      difficulty: 'desafio',
      extra: 123,
    });
    expect(result).toEqual({
      sound: true,
      animations: true,
      calmMode: true,
      size: 'normal',
      difficulty: 'desafio',
    });
  });
});

describe('progresso salvo', () => {
  it('começa vazio quando não há nada salvo', () => {
    expect(sanitizeProgress(undefined)).toEqual({ levels: {}, plays: {}, animalsSeen: [] });
  });

  it('descarta jogos, níveis e contagens que não existem', () => {
    const result = sanitizeProgress({
      levels: { cores: 'medio', memoria: 'impossivel', 'jogo-fantasma': 'facil' },
      plays: { formas: 3, memoria: -2, desenho: 'muitas', 'jogo-fantasma': 9 },
      animalsSeen: ['gato', 'gato', 42, 'cachorro'],
    });
    expect(result.levels).toEqual({ cores: 'medio' });
    expect(result.plays).toEqual({ formas: 3 });
    expect(result.animalsSeen).toEqual(['gato', 'cachorro']);
  });
});

describe('níveis', () => {
  it('oferecem o próximo nível, até acabar', () => {
    expect(nextDifficulty('facil')).toBe('medio');
    expect(nextDifficulty('medio')).toBe('desafio');
    expect(nextDifficulty('desafio')).toBeNull();
  });
});
