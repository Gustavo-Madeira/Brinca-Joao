/**
 * Voz do Brinca João, usando a síntese de fala do próprio aparelho
 * (Web Speech API). Não baixa nada e não envia nada para a internet.
 *
 * Assim como os sons, a voz só fala depois de um toque da criança e só
 * quando os sons estão ligados nas configurações (veja `useSound`).
 */

function getSynth(): SpeechSynthesis | null {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    if (typeof window.SpeechSynthesisUtterance === 'undefined') return null;
    return window.speechSynthesis ?? null;
  } catch {
    return null;
  }
}

/** Indica se este aparelho consegue falar. */
export function canSpeak(): boolean {
  return getSynth() !== null;
}

function pickPortugueseVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  const normalize = (lang: string) => lang.toLowerCase().replace('_', '-');
  return (
    voices.find((voice) => normalize(voice.lang) === 'pt-br') ??
    voices.find((voice) => normalize(voice.lang).startsWith('pt')) ??
    null
  );
}

export interface SpeakOptions {
  /** Volume de 0 a 1. */
  volume?: number;
}

/** Fala um texto curto em português. Interrompe qualquer fala anterior. */
export function speakText(text: string, options: SpeakOptions = {}): void {
  const synth = getSynth();
  if (!synth || !text.trim()) return;
  try {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = Math.min(1, Math.max(0, options.volume ?? 0.9));
    const voice = pickPortugueseVoice(synth);
    if (voice) utterance.voice = voice;
    synth.speak(utterance);
  } catch {
    // Voz indisponível: o texto continua visível na tela.
  }
}

/** Para a fala imediatamente (por exemplo, ao sair de um jogo). */
export function stopSpeaking(): void {
  const synth = getSynth();
  if (!synth) return;
  try {
    synth.cancel();
  } catch {
    // Nada a fazer.
  }
}
