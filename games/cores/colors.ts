export type ColorId =
  | 'vermelho'
  | 'azul'
  | 'amarelo'
  | 'verde'
  | 'laranja'
  | 'roxo'
  | 'rosa'
  | 'marrom'
  | 'preto'
  | 'branco';

/** Símbolo que acompanha cada cor, para ninguém depender só de enxergar cores. */
export type SymbolId =
  | 'coracao'
  | 'gota'
  | 'estrela'
  | 'folha'
  | 'circulo'
  | 'losango'
  | 'cruz'
  | 'quadrado'
  | 'lua'
  | 'nuvem';

export interface ColorDef {
  id: ColorId;
  /** Nome no masculino: "azul", "vermelho". */
  name: string;
  /** Nome no feminino, para combinar com "flor", "camiseta"... */
  feminine: string;
  /** Cor principal da figura. */
  base: string;
  /** Tom escuro: contornos e detalhes. */
  dark: string;
  /** Tom claro: brilhos. */
  light: string;
  symbol: SymbolId;
}

/**
 * As cores do jogo. Cada uma tem três tons (para as figuras terem volume
 * sem misturar outras cores) e um símbolo próprio, sempre o mesmo.
 */
export const COLORS: readonly ColorDef[] = [
  {
    id: 'vermelho',
    name: 'vermelho',
    feminine: 'vermelha',
    base: '#e5484d',
    dark: '#b4232a',
    light: '#ffc9cb',
    symbol: 'coracao',
  },
  {
    id: 'azul',
    name: 'azul',
    feminine: 'azul',
    base: '#2f80ed',
    dark: '#1c5bbf',
    light: '#cfe3ff',
    symbol: 'gota',
  },
  {
    id: 'amarelo',
    name: 'amarelo',
    feminine: 'amarela',
    base: '#ffcb2e',
    dark: '#c99700',
    light: '#fff1bd',
    symbol: 'estrela',
  },
  {
    id: 'verde',
    name: 'verde',
    feminine: 'verde',
    base: '#3db56c',
    dark: '#23804a',
    light: '#c8efd6',
    symbol: 'folha',
  },
  {
    id: 'laranja',
    name: 'laranja',
    feminine: 'laranja',
    base: '#ff8a3d',
    dark: '#c95b12',
    light: '#ffdcc2',
    symbol: 'circulo',
  },
  {
    id: 'roxo',
    name: 'roxo',
    feminine: 'roxa',
    base: '#8b5cf6',
    dark: '#5e36c7',
    light: '#e1d5ff',
    symbol: 'losango',
  },
  {
    id: 'rosa',
    name: 'rosa',
    feminine: 'rosa',
    base: '#f472b6',
    dark: '#c23a82',
    light: '#ffd6ea',
    symbol: 'cruz',
  },
  {
    id: 'marrom',
    name: 'marrom',
    feminine: 'marrom',
    base: '#9a6b4a',
    dark: '#6b452c',
    light: '#e8d3c3',
    symbol: 'quadrado',
  },
  {
    id: 'preto',
    name: 'preto',
    feminine: 'preta',
    base: '#2b2f3a',
    dark: '#0f1116',
    light: '#9aa3b2',
    symbol: 'lua',
  },
  {
    id: 'branco',
    name: 'branco',
    feminine: 'branca',
    base: '#ffffff',
    dark: '#9aa5ba',
    light: '#eef2f8',
    symbol: 'nuvem',
  },
];

export function getColor(id: ColorId): ColorDef {
  const color = COLORS.find((item) => item.id === id);
  if (!color) throw new Error(`Cor desconhecida: ${id}`);
  return color;
}

/** Primeira letra maiúscula: "azul" → "Azul". */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
