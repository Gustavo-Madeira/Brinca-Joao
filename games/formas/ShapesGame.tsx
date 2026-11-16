import { useRef } from 'react';
import { GameShell } from '@/components/game/GameShell';
import { Button, LinkButton } from '@/components/ui/Button';
import { Celebration } from '@/components/ui/Celebration';
import { Feedback } from '@/components/ui/Feedback';
import type { FeedbackTone } from '@/components/ui/Feedback';
import { Icon } from '@/components/ui/Icon';
import { getDifficultyInfo, nextDifficulty } from '@/config/difficulty';
import { praise, tryAgain } from '@/config/phrases';
import { useDragToTarget } from '@/hooks/useDragToTarget';
import { useGameDifficulty } from '@/hooks/useGameDifficulty';
import { useProgress } from '@/hooks/useProgress';
import { useRefocusWhenLost } from '@/hooks/useRefocusWhenLost';
import { useSessionState } from '@/hooks/useSessionState';
import { useSound } from '@/hooks/useSound';
import type { Difficulty, GameProps } from '@/types';
import { cx } from '@/utils/cx';
import { createShapesRound, fits } from './logic';
import type { ShapePiece, ShapesRound } from './logic';
import { ShapeFigure } from './ShapeFigure';
import { getShape } from './shapes';
import type { ShapeId } from './shapes';
import styles from './ShapesGame.module.css';

interface FeedbackState {
  text: string;
  tone: FeedbackTone;
}

interface Session {
  round: ShapesRound;
  /** Lugares já preenchidos. */
  placed: ShapeId[];
  selectedId: string | null;
  /** Lugar destacado pela dica. */
  hintSlot: ShapeId | null;
  /** Conta as tentativas em outro lugar, para repetir o "vai e vem" da peça. */
  nudges: number;
  finished: boolean;
  feedback: FeedbackState;
}

const NO_FEEDBACK: FeedbackState = { text: '', tone: 'neutro' };
const PICK_A_PLACE: FeedbackState = { text: 'Agora toque no lugar dessa forma.', tone: 'neutro' };

function createSession(level: Difficulty): Session {
  return {
    round: createShapesRound(level),
    placed: [],
    selectedId: null,
    hintSlot: null,
    nudges: 0,
    finished: false,
    feedback: NO_FEEDBACK,
  };
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Encaixe as Formas: toque em uma peça e depois no lugar dela — ou arraste,
 * se preferir. Peça no lugar errado não some nem "quebra": ela só balança
 * de leve e continua na mão.
 */
export default function ShapesGame({ game }: GameProps) {
  const [level, setLevel] = useGameDifficulty(game.id);
  const [session, setSession, restart] = useSessionState(level, createSession);
  const sound = useSound();
  const { recordPlay } = useProgress();
  const boardRef = useRef<HTMLDivElement>(null);

  const { round } = session;
  const selected = round.pieces.find((piece) => piece.id === session.selectedId) ?? null;
  const harderLevel = nextDifficulty(level);

  useRefocusWhenLost(boardRef, round);

  function tryPlace(piece: ShapePiece, slot: ShapeId) {
    if (session.finished || session.placed.includes(slot)) return;
    const shape = getShape(piece.shape);

    if (fits(piece, slot)) {
      const placed = [...session.placed, slot];
      const finished = placed.length === round.slots.length;
      sound.play(finished ? 'festa' : 'encaixar');
      if (finished) recordPlay(game.id);
      setSession((current) => ({
        ...current,
        placed,
        selectedId: null,
        hintSlot: null,
        finished,
        feedback: {
          text: `${praise()} ${capitalize(shape.article)} ${shape.name} está no lugar.`,
          tone: 'acerto',
        },
      }));
      return;
    }

    setSession((current) => ({
      ...current,
      selectedId: piece.id,
      nudges: current.nudges + 1,
      feedback: { text: `${tryAgain()} Essa peça é de outro lugar.`, tone: 'carinho' },
    }));
  }

  function selectPiece(piece: ShapePiece) {
    if (session.selectedId === piece.id) {
      setSession((current) => ({ ...current, selectedId: null, hintSlot: null, feedback: NO_FEEDBACK }));
      return;
    }
    sound.play('selecionar');
    sound.speak(capitalize(getShape(piece.shape).name));
    setSession((current) => ({
      ...current,
      selectedId: piece.id,
      hintSlot: null,
      feedback: PICK_A_PLACE,
    }));
  }

  function tapSlot(slot: ShapeId) {
    if (session.finished || session.placed.includes(slot)) return;
    if (!selected) {
      setSession((current) => ({
        ...current,
        feedback: { text: 'Primeiro toque em uma peça.', tone: 'neutro' },
      }));
      return;
    }
    tryPlace(selected, slot);
  }

  const bindDrag = useDragToTarget({
    onDrop(pieceId, targetId) {
      const piece = round.pieces.find((item) => item.id === pieceId);
      if (!piece) return;
      const slot = round.slots.find((item) => item === targetId);
      if (!slot) {
        // Soltou fora de um lugar: a peça fica selecionada, pronta para o próximo toque.
        setSession((current) => ({
          ...current,
          selectedId: piece.id,
          hintSlot: null,
          feedback: PICK_A_PLACE,
        }));
        return;
      }
      tryPlace(piece, slot);
    },
  });

  function hint() {
    if (session.finished) return;
    const piece = selected ?? round.pieces.find((item) => !session.placed.includes(item.shape));
    if (!piece) return;
    setSession((current) => ({
      ...current,
      selectedId: piece.id,
      hintSlot: piece.shape,
      feedback: { text: 'Olhe o lugar que está brilhando!', tone: 'neutro' },
    }));
  }

  return (
    <GameShell
      instruction="Toque em uma peça. Depois, toque no lugar dela!"
      level={level}
      onLevelChange={setLevel}
      actions={
        <>
          <Button variant="soft" icon="hint" onClick={hint} disabled={session.finished}>
            Dica
          </Button>
          <Button variant="soft" icon="restart" onClick={restart}>
            Recomeçar
          </Button>
        </>
      }
    >
      <div ref={boardRef} tabIndex={-1} className={styles.board} role="group" aria-label="Lugares das formas">
        <ul className={styles.grid} data-count={round.slots.length}>
          {round.slots.map((slot) => {
            const shape = getShape(slot);
            const piece = round.pieces.find((item) => item.shape === slot);
            const filled = session.placed.includes(slot);
            return (
              <li key={slot} className={styles.cell}>
                <button
                  type="button"
                  data-drop-id={slot}
                  className={cx(
                    styles.slot,
                    filled && styles.filled,
                    session.hintSlot === slot && !filled && 'bj-glow',
                  )}
                  aria-label={
                    filled ? `${capitalize(shape.name)}: encaixado` : `Lugar em forma de ${shape.name}`
                  }
                  aria-disabled={filled || undefined}
                  onClick={() => tapSlot(slot)}
                >
                  {filled ? (
                    <ShapeFigure
                      shape={slot}
                      variant="peca"
                      color={piece?.color}
                      className={`${styles.figure} bj-pop-in`}
                    />
                  ) : (
                    <ShapeFigure
                      shape={slot}
                      variant="lugar"
                      color={piece?.color}
                      tintHint={round.colorHints}
                      className={styles.figure}
                    />
                  )}
                  {filled && (
                    <span className={styles.badge} aria-hidden="true">
                      <Icon name="check" size={1.125} />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <Feedback message={session.feedback.text} tone={session.feedback.tone} />

      {/* A comemoração entra no lugar da bandeja: as formas encaixadas continuam à vista. */}
      {session.finished ? (
        <Celebration title="Todas as formas no lugar!" message="Você encaixou tudo direitinho.">
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
        <div className={styles.tray} role="group" aria-label="Peças">
          <ul className={styles.grid} data-count={round.pieces.length}>
            {round.pieces.map((piece) => {
              const shape = getShape(piece.shape);
              if (session.placed.includes(piece.shape)) {
                // O espaço da peça continua ali: nada muda de lugar na bandeja.
                return <li key={piece.id} className={cx(styles.cell, styles.emptySpot)} aria-hidden="true" />;
              }
              const isSelected = piece.id === session.selectedId;
              return (
                <li key={piece.id} className={styles.cell}>
                  <button
                    type="button"
                    className={cx(styles.piece, isSelected && styles.selected)}
                    aria-pressed={isSelected}
                    aria-label={`Peça: ${shape.name}`}
                    onClick={() => selectPiece(piece)}
                    {...bindDrag(piece.id)}
                  >
                    <ShapeFigure
                      // A chave muda a cada tentativa em outro lugar: o balanço recomeça.
                      key={isSelected ? session.nudges : 'parada'}
                      shape={piece.shape}
                      variant="peca"
                      color={piece.color}
                      className={cx(
                        styles.figure,
                        isSelected && session.nudges > 0 && 'bj-nudge',
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </GameShell>
  );
}
