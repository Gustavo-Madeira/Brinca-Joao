import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Pipo } from '@/components/brand/Pipo';
import { IconButton } from '@/components/ui/Button';
import { useSound } from '@/hooks/useSound';
import type { Difficulty } from '@/types';
import { stopSpeaking } from '@/utils/speech';
import { DifficultyPicker } from './DifficultyPicker';
import styles from './GameShell.module.css';

interface GameShellProps {
  /** Instrução curta, dita pelo Pipo. */
  instruction: string;
  /** Texto falado ao tocar em "Ouvir" (por padrão, a própria instrução). */
  spokenInstruction?: string;
  /** Nível atual e como trocá-lo (só para jogos com níveis). */
  level?: Difficulty;
  onLevelChange?: (level: Difficulty) => void;
  /** Botões do jogo: dica, recomeçar... */
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * Moldura comum de todos os jogos, sempre na mesma ordem:
 * instrução → brincadeira → botões → nível.
 * Quem aprende a usar um jogo já sabe usar todos.
 */
export function GameShell({
  instruction,
  spokenInstruction,
  level,
  onLevelChange,
  actions,
  children,
}: GameShellProps) {
  const sound = useSound();

  // Saiu do jogo? Qualquer fala em andamento para.
  useEffect(() => stopSpeaking, []);

  return (
    <div className={styles.shell}>
      <div className={styles.instruction}>
        <Pipo className={styles.avatar} />
        <p className={styles.bubble}>{instruction}</p>
        {sound.enabled && (
          <IconButton
            icon="soundOn"
            label="Ouvir a instrução"
            onClick={() => sound.speak(spokenInstruction ?? instruction)}
          />
        )}
      </div>

      <div className={`${styles.stage} no-select`}>{children}</div>

      {actions && <div className={styles.actions}>{actions}</div>}

      {level && onLevelChange && (
        <div className={styles.level}>
          <DifficultyPicker value={level} onChange={onLevelChange} />
        </div>
      )}
    </div>
  );
}
