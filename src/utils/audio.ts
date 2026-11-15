/**
 * Sons do Brinca João, criados na hora com a Web Audio API.
 *
 * - Não há arquivos de áudio: o site continua leve.
 * - Só ondas suaves (seno e triângulo), volume baixo e notas curtas.
 * - Não existe som de "erro". Errar faz parte da brincadeira.
 * - Nada toca sozinho: quem chama `playSound` é sempre uma ação da criança,
 *   e só quando os sons estão ligados nas configurações (veja `useSound`).
 */

export type SoundName = 'toque' | 'selecionar' | 'virar' | 'encaixar' | 'acerto' | 'festa';

interface Note {
  /** Frequência em hertz. */
  freq: number;
  /** Início, em segundos, a partir do começo do som. */
  start: number;
  /** Duração em segundos. */
  duration: number;
  type?: OscillatorType;
  /** Volume relativo da nota (0 a 1). */
  level?: number;
}

const C5 = 523.25;
const D5 = 587.33;
const E5 = 659.25;
const G5 = 783.99;
const C6 = 1046.5;
const G4 = 392.0;

const SOUNDS: Record<SoundName, Note[]> = {
  toque: [{ freq: G4, start: 0, duration: 0.09, level: 0.6 }],
  selecionar: [{ freq: D5, start: 0, duration: 0.11, level: 0.7 }],
  virar: [{ freq: G4, start: 0, duration: 0.1, type: 'triangle', level: 0.6 }],
  encaixar: [
    { freq: C5, start: 0, duration: 0.11 },
    { freq: G5, start: 0.09, duration: 0.16 },
  ],
  acerto: [
    { freq: C5, start: 0, duration: 0.15 },
    { freq: E5, start: 0.12, duration: 0.15 },
    { freq: G5, start: 0.24, duration: 0.26 },
  ],
  festa: [
    { freq: C5, start: 0, duration: 0.16 },
    { freq: E5, start: 0.14, duration: 0.16 },
    { freq: G5, start: 0.28, duration: 0.16 },
    { freq: C6, start: 0.42, duration: 0.42, level: 0.8 },
    { freq: G5, start: 0.42, duration: 0.42, level: 0.45 },
  ],
};

/** Volume máximo bem baixo: confortável mesmo com o aparelho no último volume. */
const MASTER_LEVEL = 0.14;

type AudioContextConstructor = typeof AudioContext;

let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor: AudioContextConstructor | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext;
  if (!Ctor) return null;
  if (!context) context = new Ctor();
  if (context.state === 'suspended') {
    // Navegadores só liberam o áudio depois de um toque; aqui já estamos nele.
    void context.resume().catch(() => undefined);
  }
  return context;
}

export interface PlayOptions {
  /** Multiplicador de volume (0 a 1). O modo calmo usa um valor menor. */
  volume?: number;
}

/** Toca um som curto e suave. Nunca lança erro: sem áudio, apenas não toca. */
export function playSound(name: SoundName, options: PlayOptions = {}): void {
  try {
    const ctx = getContext();
    if (!ctx) return;
    const volume = Math.min(1, Math.max(0, options.volume ?? 1)) * MASTER_LEVEL;
    if (volume <= 0) return;
    const begin = ctx.currentTime + 0.02;

    for (const note of SOUNDS[name]) {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const startAt = begin + note.start;
      const endAt = startAt + note.duration;
      const peak = Math.max(0.0002, volume * (note.level ?? 1));

      oscillator.type = note.type ?? 'sine';
      oscillator.frequency.setValueAtTime(note.freq, startAt);

      // Ataque e final suaves: sem estalos.
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(peak, startAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(startAt);
      oscillator.stop(endAt + 0.03);
    }
  } catch {
    // Áudio indisponível neste aparelho: a brincadeira segue em silêncio.
  }
}
