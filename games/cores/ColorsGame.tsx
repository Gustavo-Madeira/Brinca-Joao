import { useEffect, useRef, useState } from 'react';
import { GameShell } from '@/components/game/GameShell';
import { ProgressStars } from '@/components/game/ProgressStars';
import { Button, LinkButton } from '@/components/ui/Button';
import { Celebration } from '@/components/ui/Celebration';
import { Feedback } from '@/components/ui/Feedback';
import type { FeedbackTone } from '@/components/ui/Feedback';
import { Icon } from '@/components/ui/Icon';
import { getDifficultyInfo, nextDifficulty } from '@/config/difficulty';
import { praise, tryAgain } from '@/config/phrases';
import { useGameDifficulty } from '@/hooks/useGameDifficulty';
import { useProgress } from '@/hooks/useProgress';
import { revealAndFocus, useRefocusWhenLost } from '@/hooks/useRefocusWhenLost';
import { useSessionState } from '@/hooks/useSessionState';
import { useSound } from '@/hooks/useSound';
import type { Difficulty, GameProps } from '@/types';
import { cx } from '@/utils/cx';
import { ColorChip } from './ColorChip';
import { capitalize, getColor } from './colors';
import { ROUNDS_PER_SESSION, createColorRound } from './logic';
import type { ColorOption, ColorRound } from './logic';
import { TintedObject } from './ObjectArt';
import { describeObject, getObject } from './objects';
import styles from './ColorsGame.module.css';

interface FeedbackState {
  text: string;
  tone: FeedbackTone;
}

interface Session {
  round: ColorRound;
  /** Rodada atual, de 1 a ROUNDS_PER_SESSION. */
  roundNumber: number;
  /** Opções já tocadas que não eram a certa (ficam apagadinhas). */
  wrongIds: string[];
  solved: boolean;
  hinted: boolean;
  finished: boolean;
  feedback: FeedbackState;
}

const NO_FEEDBACK: FeedbackState = { text: '', tone: 'neutro' };

function createSession(level: Difficulty): Session {
  return {
    round: createColorRound(level),
    roundNumber: 1,
    wrongIds: [],
    solved: false,
    hinted: false,
    finished: false,
    feedback: NO_FEEDBACK,
  };
}

/**
 * Mundo das Cores: aparece uma figura-modelo e a criança toca na opção que
 * tem a mesma cor. Sem tempo, sem placar negativo; quem toca em outra cor
 * ouve o nome dela e pode tentar de novo quantas vezes quiser.
 */
export default function ColorsGame({ game }: GameProps) {
  const [level, setLevel] = useGameDifficulty(game.id);
  const [session, setSession, restart] = useSessionState(level, createSession);
  const [showLabels, setShowLabels] = useState(true);
  const sound = useSound();
  const { recordPlay } = useProgress();
  const targetRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const { round } = session;
  const targetColor = getColor(round.target.colorId);
  const targetObject = getObject(round.target.objectId);
  const starsDone = session.roundNumber - 1 + (session.solved ? 1 : 0);
  const isLastRound = session.roundNumber >= ROUNDS_PER_SESSION;
  const harderLevel = nextDifficulty(level);

  // Acertou: o botão "Próxima" aparece e recebe o foco.
  useEffect(() => {
    if (session.solved && !session.finished) revealAndFocus(nextRef.current);
  }, [session.solved, session.finished]);

  // Rodada nova: se o foco se perdeu, ele volta para a figura-modelo.
  useRefocusWhenLost(targetRef, round);

  function choose(option: ColorOption) {
    if (session.solved || session.wrongIds.includes(option.id)) return;
    const color = getColor(option.colorId);

    if (option.id === round.correctOptionId) {
      const cheer = praise();
      sound.play('acerto');
      sound.speak(`${capitalize(color.name)}! ${cheer}`);
      setSession((current) => ({
        ...current,
        solved: true,
        hinted: false,
        feedback: { text: `${cheer} É o ${color.name}!`, tone: 'acerto' },
      }));
      return;
    }

    // Outra cor: sem som de erro. A voz só diz o nome da cor tocada.
    sound.speak(capitalize(color.name));
    setSession((current) => ({
      ...current,
      wrongIds: [...current.wrongIds, option.id],
      feedback: { text: `${tryAgain()} Esse é o ${color.name}. Tente outro.`, tone: 'carinho' },
    }));
  }

  function next() {
    if (isLastRound) {
      sound.play('festa');
      recordPlay(game.id);
      setSession((current) => ({ ...current, finished: true, feedback: NO_FEEDBACK }));
      return;
    }
    const nextRound = createColorRound(level, Math.random, round.target.colorId);
    setSession((current) => ({
      ...current,
      round: nextRound,
      roundNumber: current.roundNumber + 1,
      wrongIds: [],
      solved: false,
      hinted: false,
      feedback: NO_FEEDBACK,
    }));
  }

  function hint() {
    if (session.solved || session.finished) return;
    setSession((current) => ({
      ...current,
      hinted: true,
      feedback: { text: 'Olhe a figura que está brilhando!', tone: 'neutro' },
    }));
  }

  return (
    <GameShell
      instruction="Toque na figura que tem a mesma cor!"
      level={level}
      onLevelChange={setLevel}
      actions={
        <>
          <Button
            variant="soft"
            icon="hint"
            onClick={hint}
            disabled={session.solved || session.finished}
          >
            Dica
          </Button>
          <Button
            variant="soft"
            icon={showLabels ? 'eye' : 'eyeOff'}
            aria-pressed={showLabels}
            onClick={() => setShowLabels((value) => !value)}
          >
            Nomes das cores
          </Button>
          <Button variant="soft" icon="restart" onClick={restart}>
            Recomeçar
          </Button>
        </>
      }
    >
      {session.finished ? (
        <Celebration title="Você completou as cores!" message="Cinco estrelas para você.">
          <Button variant="primary" size="lg" icon="restart" onClick={restart}>
            Jogar de novo
          </Button>
          {harderLevel && (
            <Button variant="soft" size="lg" onClick={() => setLevel(harderLevel)}>
              Tentar o nível {getDifficultyInfo(harderLevel).label}
            </Button>
          )}
          <LinkButton to="/jogos" variant="soft" size="lg" icon="grid">
            Outros jogos
          </LinkButton>
        </Celebration>
      ) : (
        <>
          <ProgressStars done={starsDone} total={ROUNDS_PER_SESSION} label="estrelas" />

          <div
            ref={targetRef}
            tabIndex={-1}
            className={styles.target}
            role="group"
            aria-label={`Rodada ${session.roundNumber} de ${ROUNDS_PER_SESSION}. Figura modelo: ${describeObject(targetObject, targetColor)}.`}
          >
            <TintedObject object={targetObject} color={targetColor} className={styles.targetArt} />
            <div className={styles.targetText}>
              <p className={styles.caption}>Olhe esta cor</p>
              {showLabels && <ColorChip color={targetColor} />}
            </div>
          </div>

          <ul
            className={cx(styles.options, session.solved && styles.solved)}
            data-count={round.options.length}
            aria-label="Opções"
          >
            {round.options.map((option) => {
              const color = getColor(option.colorId);
              const object = getObject(option.objectId);
              const isCorrect = option.id === round.correctOptionId;
              const wasTried = session.wrongIds.includes(option.id);
              const inactive = session.solved || wasTried;
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    className={cx(
                      styles.option,
                      wasTried && styles.tried,
                      session.solved && isCorrect && styles.correct,
                      session.hinted && isCorrect && !session.solved && 'bj-glow',
                    )}
                    aria-label={describeObject(object, color)}
                    aria-disabled={inactive || undefined}
                    onClick={() => choose(option)}
                  >
                    <TintedObject object={object} color={color} className={styles.optionArt} />
                    {showLabels && <ColorChip color={color} className={styles.optionChip} />}
                    {session.solved && isCorrect && (
                      <span className={`${styles.badge} bj-pop-in`} aria-hidden="true">
                        <Icon name="check" size={1.25} />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <Feedback message={session.feedback.text} tone={session.feedback.tone} />

          <div className={styles.next}>
            {session.solved && (
              <Button ref={nextRef} variant="primary" size="lg" iconEnd="arrowRight" onClick={next}>
                {isLastRound ? 'Ver as estrelas' : 'Próxima'}
              </Button>
            )}
          </div>
        </>
      )}
    </GameShell>
  );
}
