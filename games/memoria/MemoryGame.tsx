import { useRef } from 'react';
import { GameShell } from '@/components/game/GameShell';
import { ProgressStars } from '@/components/game/ProgressStars';
import { Button, LinkButton } from '@/components/ui/Button';
import { Celebration } from '@/components/ui/Celebration';
import { Feedback } from '@/components/ui/Feedback';
import type { FeedbackTone } from '@/components/ui/Feedback';
import { Icon } from '@/components/ui/Icon';
import { getDifficultyInfo, nextDifficulty } from '@/config/difficulty';
import { praise } from '@/config/phrases';
import { useGameDifficulty } from '@/hooks/useGameDifficulty';
import { useProgress } from '@/hooks/useProgress';
import { useRefocusWhenLost } from '@/hooks/useRefocusWhenLost';
import { useSessionState } from '@/hooks/useSessionState';
import { useSound } from '@/hooks/useSound';
import { Art } from '@/illustrations/Art';
import { getPicture } from '@/illustrations/catalog';
import type { Difficulty, GameProps } from '@/types';
import { cx } from '@/utils/cx';
import { starPoints } from '@/utils/geometry';
import { createMemoryState, flipCard, hasMismatch, isComplete, isFaceUp } from './logic';
import type { MemoryCard, MemoryState } from './logic';
import styles from './MemoryGame.module.css';

interface FeedbackState {
  text: string;
  tone: FeedbackTone;
}

interface Session {
  memory: MemoryState;
  /** "Espiar": todas as cartas ficam abertas enquanto estiver ligado. */
  peeking: boolean;
  finished: boolean;
  feedback: FeedbackState;
}

const NO_FEEDBACK: FeedbackState = { text: '', tone: 'neutro' };
const BACK_STAR = starPoints(50, 52, 24, 10.5);

function createSession(level: Difficulty): Session {
  return {
    memory: createMemoryState(level),
    peeking: false,
    finished: false,
    feedback: NO_FEEDBACK,
  };
}

/** Verso da carta: azul, com uma estrela. */
function CardBack() {
  return (
    <svg className={styles.backArt} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <rect
        x="9"
        y="9"
        width="82"
        height="82"
        rx="12"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        opacity="0.55"
      />
      <polygon points={BACK_STAR} fill="#ffd95a" stroke="#ffd95a" strokeWidth="5" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Jogo da Memória: encontre os pares.
 * Duas cartas diferentes ficam abertas até a criança tocar de novo — não há
 * relógio escondido fechando as cartas antes de ela conseguir olhar.
 */
export default function MemoryGame({ game }: GameProps) {
  const [level, setLevel] = useGameDifficulty(game.id);
  const [session, setSession, restart] = useSessionState(level, createSession);
  const sound = useSound();
  const { recordPlay } = useProgress();
  const boardRef = useRef<HTMLUListElement>(null);

  const { memory } = session;
  const pairCount = memory.cards.length / 2;
  const harderLevel = nextDifficulty(level);

  useRefocusWhenLost(boardRef, memory.cards);

  function handleCard(card: MemoryCard) {
    if (session.peeking || session.finished) return;
    const next = flipCard(memory, card.id);
    if (next === memory) return;

    const picture = getPicture(card.pictureId);
    const name = picture?.name ?? 'Figura';
    const opened = next.open.includes(card.id) || next.lastMatch === card.pictureId;
    const finished = isComplete(next);
    let feedback: FeedbackState = NO_FEEDBACK;

    if (next.lastMatch) {
      feedback = { text: `${praise()} Você achou o par: ${name}.`, tone: 'acerto' };
      sound.play(finished ? 'festa' : 'acerto');
    } else if (hasMismatch(next)) {
      feedback = {
        text: 'Essas são diferentes. Toque em outra carta para continuar.',
        tone: 'carinho',
      };
      sound.play('virar');
    } else if (opened) {
      feedback = { text: `${name}! Onde está a outra igual?`, tone: 'neutro' };
      sound.play('virar');
    }

    if (opened && !next.lastMatch) sound.speak(name);
    if (finished) recordPlay(game.id);

    setSession((current) => ({ ...current, memory: next, finished, feedback }));
  }

  function togglePeek() {
    if (session.finished) return;
    setSession((current) => ({
      ...current,
      peeking: !current.peeking,
      // Ao espiar, um par diferente que estava aberto é fechado.
      memory: current.peeking ? current.memory : { ...current.memory, open: [], lastMatch: null },
      feedback: current.peeking
        ? NO_FEEDBACK
        : { text: 'Olhe com calma. Depois, toque em "Esconder".', tone: 'neutro' },
    }));
  }

  return (
    <GameShell
      instruction="Vire duas cartas e encontre as figuras iguais!"
      level={level}
      onLevelChange={setLevel}
      actions={
        <>
          <Button
            variant="soft"
            icon={session.peeking ? 'eyeOff' : 'eye'}
            aria-pressed={session.peeking}
            onClick={togglePeek}
            disabled={session.finished}
          >
            {session.peeking ? 'Esconder' : 'Espiar'}
          </Button>
          <Button variant="soft" icon="restart" onClick={restart}>
            Recomeçar
          </Button>
        </>
      }
    >
      <ProgressStars done={memory.matched.length} total={pairCount} label="pares encontrados" />

      <ul
        ref={boardRef}
        tabIndex={-1}
        className={styles.board}
        data-cards={memory.cards.length}
        aria-label="Cartas"
      >
        {memory.cards.map((card, index) => {
          const picture = getPicture(card.pictureId);
          const matched = memory.matched.includes(card.pictureId);
          const faceUp = session.peeking || isFaceUp(memory, card);
          const position = `Carta ${index + 1}`;
          let label = `${position}: fechada`;
          if (matched) label = `${position}: ${picture?.name}, par encontrado`;
          else if (faceUp) label = `${position}: ${picture?.name}`;

          return (
            <li key={card.id} className={styles.cell}>
              <button
                type="button"
                className={cx(styles.card, faceUp && styles.faceUp, matched && styles.matched)}
                aria-label={label}
                aria-disabled={matched || session.peeking || undefined}
                onClick={() => handleCard(card)}
              >
                <span className={styles.inner}>
                  <span className={cx(styles.face, styles.back)}>
                    <CardBack />
                  </span>
                  <span className={cx(styles.face, styles.front)}>
                    {/* A figura fica sempre desenhada: assim a carta gira inteira ao fechar. */}
                    {picture && <Art art={picture.art} className={styles.art} />}
                  </span>
                </span>
                {matched && (
                  <span className={`${styles.badge} bj-pop-in`} aria-hidden="true">
                    <Icon name="check" size={1} />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <Feedback message={session.feedback.text} tone={session.feedback.tone} />

      {/* A comemoração aparece embaixo: as cartas abertas continuam à vista. */}
      {session.finished && (
        <Celebration title="Você achou todos os pares!" message="Que memória boa!">
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
      )}
    </GameShell>
  );
}
