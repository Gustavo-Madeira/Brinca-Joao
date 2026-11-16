import { useId, useRef, useState } from 'react';
import { GameShell } from '@/components/game/GameShell';
import { Button, LinkButton } from '@/components/ui/Button';
import { Celebration } from '@/components/ui/Celebration';
import { Feedback } from '@/components/ui/Feedback';
import type { FeedbackTone } from '@/components/ui/Feedback';
import { praise, tryAgain } from '@/config/phrases';
import { useDragToTarget } from '@/hooks/useDragToTarget';
import { useGameDifficulty } from '@/hooks/useGameDifficulty';
import { useProgress } from '@/hooks/useProgress';
import { useRefocusWhenLost } from '@/hooks/useRefocusWhenLost';
import { useSessionState } from '@/hooks/useSessionState';
import { useSound } from '@/hooks/useSound';
import type { Difficulty, GameProps } from '@/types';
import { cx } from '@/utils/cx';
import { pieceViewBox } from './jigsaw';
import type { JigsawLayout, PieceGeometry } from './jigsaw';
import { IMAGE_SIZE, createPuzzle, describePosition, pieceFits } from './logic';
import type { PuzzleSetup } from './logic';
import { SCENES, getScene, nextSceneId } from './scenes';
import type { Scene, SceneId } from './scenes';
import styles from './PuzzleGame.module.css';

interface FeedbackState {
  text: string;
  tone: FeedbackTone;
}

interface Session {
  setup: PuzzleSetup;
  /** Peças já encaixadas (o id da peça é o id do lugar). */
  placed: string[];
  selectedId: string | null;
  /** Lugar destacado pelo botão "Ajuda". */
  hintId: string | null;
  /** Mostra a imagem, bem clarinha, no fundo do tabuleiro. */
  showGuide: boolean;
  /** Conta as tentativas em outro lugar, para repetir o "vai e vem" da peça. */
  nudges: number;
  finished: boolean;
  feedback: FeedbackState;
}

const NO_FEEDBACK: FeedbackState = { text: '', tone: 'neutro' };
const PICK_A_PLACE: FeedbackState = { text: 'Agora toque no lugar dessa peça.', tone: 'neutro' };
const VIEW_BOX = `0 0 ${IMAGE_SIZE} ${IMAGE_SIZE}`;

function createSession(level: Difficulty): Session {
  return {
    setup: createPuzzle(level),
    placed: [],
    selectedId: null,
    hintId: null,
    // No nível fácil, a imagem de fundo já começa ligada (máximo apoio visual).
    showGuide: level === 'facil',
    nudges: 0,
    finished: false,
    feedback: NO_FEEDBACK,
  };
}

function percent(value: number): string {
  return `${(value / IMAGE_SIZE) * 100}%`;
}

interface PieceArtProps {
  layout: JigsawLayout;
  piece: PieceGeometry;
  scene: Scene;
  clipId: string;
  className?: string;
}

/** Uma peça solta: a imagem recortada no formato do encaixe. */
function PieceArt({ layout, piece, scene, clipId, className }: PieceArtProps) {
  const SceneArt = scene.art;
  return (
    <svg
      className={className}
      viewBox={pieceViewBox(layout, piece)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={piece.path} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <SceneArt />
      </g>
      <path
        d={piece.path}
        fill="none"
        stroke="#1f2b4d"
        strokeOpacity="0.6"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Quebra-Cabeça do João: toque em uma peça e depois no lugar dela (ou
 * arraste). A peça só se fixa no lugar certo; em outro lugar ela apenas
 * balança de leve e continua disponível. Há modelo, imagem de fundo
 * opcional e um botão de ajuda — e nenhuma penalidade.
 */
export default function PuzzleGame({ game }: GameProps) {
  const [level, setLevel] = useGameDifficulty(game.id);
  const [sceneId, setSceneId] = useState<SceneId>('pipo');
  const [session, setSession, restart] = useSessionState(level, createSession);
  const sound = useSound();
  const { recordPlay } = useProgress();
  const boardRef = useRef<HTMLDivElement>(null);
  const clipBase = `recorte-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  const scene = getScene(sceneId);
  const SceneArt = scene.art;
  const { layout, tray } = session.setup;
  const pieces = layout.pieces;
  const placedPieces = pieces.filter((piece) => session.placed.includes(piece.id));
  const hintPiece = pieces.find((piece) => piece.id === session.hintId) ?? null;
  const remaining = tray.filter((id) => !session.placed.includes(id));

  useRefocusWhenLost(boardRef, session.setup);

  function tryPlace(pieceId: string, slotId: string) {
    if (session.finished) return;
    if (session.placed.includes(slotId)) {
      setSession((current) => ({
        ...current,
        selectedId: pieceId,
        feedback: { text: 'Esse lugar já tem uma peça. Tente outro.', tone: 'neutro' },
      }));
      return;
    }

    if (pieceFits(pieceId, slotId)) {
      const placed = [...session.placed, pieceId];
      const finished = placed.length === pieces.length;
      sound.play(finished ? 'festa' : 'encaixar');
      if (finished) recordPlay(game.id);
      setSession((current) => ({
        ...current,
        placed,
        selectedId: null,
        hintId: null,
        finished,
        feedback: finished ? NO_FEEDBACK : { text: `${praise()} A peça encaixou.`, tone: 'acerto' },
      }));
      return;
    }

    setSession((current) => ({
      ...current,
      selectedId: pieceId,
      nudges: current.nudges + 1,
      feedback: { text: `${tryAgain()} Essa peça é de outro lugar.`, tone: 'carinho' },
    }));
  }

  function selectPiece(pieceId: string) {
    if (session.selectedId === pieceId) {
      setSession((current) => ({ ...current, selectedId: null, hintId: null, feedback: NO_FEEDBACK }));
      return;
    }
    sound.play('selecionar');
    setSession((current) => ({
      ...current,
      selectedId: pieceId,
      hintId: null,
      feedback: PICK_A_PLACE,
    }));
  }

  function tapSlot(slotId: string) {
    if (session.finished || session.placed.includes(slotId)) return;
    if (!session.selectedId) {
      setSession((current) => ({
        ...current,
        feedback: { text: 'Primeiro toque em uma peça.', tone: 'neutro' },
      }));
      return;
    }
    tryPlace(session.selectedId, slotId);
  }

  const bindDrag = useDragToTarget({
    onDrop(pieceId, targetId) {
      const slot = pieces.find((piece) => piece.id === targetId);
      if (!slot) {
        // Soltou fora do tabuleiro: a peça fica selecionada, pronta para o próximo toque.
        setSession((current) => ({
          ...current,
          selectedId: pieceId,
          hintId: null,
          feedback: PICK_A_PLACE,
        }));
        return;
      }
      tryPlace(pieceId, slot.id);
    },
  });

  function help() {
    if (session.finished) return;
    const pieceId = session.selectedId ?? remaining[0];
    if (!pieceId) return;
    setSession((current) => ({
      ...current,
      selectedId: pieceId,
      hintId: pieceId,
      feedback: { text: 'Olhe o lugar que está brilhando!', tone: 'neutro' },
    }));
  }

  function changeScene(id: SceneId) {
    setSceneId(id);
    restart();
  }

  return (
    <GameShell
      instruction="Toque em uma peça. Depois, toque no lugar dela!"
      level={level}
      onLevelChange={setLevel}
      actions={
        <>
          <Button variant="soft" icon="hint" onClick={help} disabled={session.finished}>
            Ajuda
          </Button>
          <Button
            variant="soft"
            icon={session.showGuide ? 'eye' : 'eyeOff'}
            aria-pressed={session.showGuide}
            onClick={() => setSession((current) => ({ ...current, showGuide: !current.showGuide }))}
          >
            Imagem de fundo
          </Button>
          <Button variant="soft" icon="restart" onClick={restart}>
            Recomeçar
          </Button>
        </>
      }
    >
      <div className={styles.layout}>
        <div className={styles.info}>
          <figure className={styles.model}>
            <svg
              className={styles.modelArt}
              viewBox={VIEW_BOX}
              role="img"
              aria-label={`Modelo: ${scene.name}`}
            >
              <SceneArt />
            </svg>
            <figcaption className={styles.modelCaption}>Modelo</figcaption>
          </figure>
          <Feedback
            message={session.feedback.text}
            tone={session.feedback.tone}
            className={styles.feedback}
          />
        </div>

        <div
          ref={boardRef}
          tabIndex={-1}
          className={styles.board}
          role="group"
          aria-label={`Tabuleiro: ${scene.name}. ${session.placed.length} de ${pieces.length} peças no lugar.`}
        >
          <svg className={styles.boardArt} viewBox={VIEW_BOX} aria-hidden="true" focusable="false">
            <rect width={IMAGE_SIZE} height={IMAGE_SIZE} fill="#eef3fa" />
            {session.showGuide && (
              <g opacity="0.3">
                <SceneArt />
              </g>
            )}
            {/* Contorno dos lugares vazios */}
            {pieces
              .filter((piece) => !session.placed.includes(piece.id))
              .map((piece) => (
                <path
                  key={piece.id}
                  d={piece.path}
                  fill="none"
                  stroke="#7c8bae"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                />
              ))}
            {hintPiece && <path d={hintPiece.path} className={styles.hintShape} />}
            <defs>
              {placedPieces.map((piece) => (
                <clipPath key={piece.id} id={`${clipBase}-t-${piece.id}`}>
                  <path d={piece.path} />
                </clipPath>
              ))}
            </defs>
            {placedPieces.map((piece) => (
              <g key={piece.id} className="bj-fade-in">
                <g clipPath={`url(#${clipBase}-t-${piece.id})`}>
                  <SceneArt />
                </g>
                <path
                  d={piece.path}
                  fill="none"
                  stroke="#ffffff"
                  strokeOpacity="0.9"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </g>
            ))}
          </svg>

          {pieces.map((piece) => {
            const filled = session.placed.includes(piece.id);
            const position = describePosition(piece.row, piece.col);
            return (
              <button
                key={piece.id}
                type="button"
                data-drop-id={piece.id}
                className={cx(styles.slot, filled && styles.slotFilled)}
                style={{
                  left: percent(piece.x),
                  top: percent(piece.y),
                  width: percent(layout.cellWidth),
                  height: percent(layout.cellHeight),
                }}
                aria-label={filled ? `Lugar da ${position}: peça encaixada` : `Lugar da ${position}`}
                aria-disabled={filled || undefined}
                onClick={() => tapSlot(piece.id)}
              />
            );
          })}
        </div>

        {/* A comemoração entra no lugar da bandeja: a figura montada continua à vista. */}
        {session.finished ? (
          <div className={styles.done}>
            <Celebration title={`Você montou: ${scene.name}!`} message="Ficou lindo." stacked>
              <Button
                variant="primary"
                size="lg"
                icon="image"
                onClick={() => changeScene(nextSceneId(sceneId))}
              >
                Outra figura
              </Button>
              <Button variant="soft" size="lg" icon="restart" onClick={restart}>
                Montar de novo
              </Button>
              <LinkButton to="/jogos" variant="soft" size="lg" icon="grid">
                Outros jogos
              </LinkButton>
            </Celebration>
          </div>
        ) : (
          <div className={styles.trayBox} role="group" aria-label="Peças">
            <ul className={styles.tray} data-pieces={pieces.length}>
              {tray.map((id) => {
                const piece = pieces.find((item) => item.id === id);
                if (!piece) return null;
                const aspectRatio = `${layout.cellWidth + layout.pad * 2} / ${layout.cellHeight + layout.pad * 2}`;
                if (session.placed.includes(id)) {
                  // O espaço da peça continua ali: nada muda de lugar na bandeja.
                  return (
                    <li key={id} className={styles.trayItem} aria-hidden="true">
                      <span className={styles.traySpot} style={{ aspectRatio }} />
                    </li>
                  );
                }
                const isSelected = id === session.selectedId;
                return (
                  <li key={id} className={styles.trayItem}>
                    <button
                      type="button"
                      className={cx(styles.piece, isSelected && styles.selected)}
                      aria-pressed={isSelected}
                      aria-label={`Peça da ${describePosition(piece.row, piece.col)}`}
                      onClick={() => selectPiece(id)}
                      {...bindDrag(id)}
                    >
                      <PieceArt
                        // A chave muda a cada tentativa em outro lugar: o balanço recomeça.
                        key={isSelected ? session.nudges : 'parada'}
                        layout={layout}
                        piece={piece}
                        scene={scene}
                        clipId={`${clipBase}-p-${id}`}
                        className={cx(
                          styles.pieceArt,
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
      </div>

      <div className={styles.scenes} role="group" aria-labelledby={`${clipBase}-figuras`}>
        <h2 id={`${clipBase}-figuras`} className={styles.scenesTitle}>
          Figuras
        </h2>
        <ul className={styles.sceneList}>
          {SCENES.map((item) => {
            const ItemArt = item.art;
            const current = item.id === sceneId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={cx(styles.sceneButton, current && styles.sceneCurrent)}
                  aria-pressed={current}
                  aria-label={item.name}
                  title={item.name}
                  onClick={() => changeScene(item.id)}
                >
                  <svg viewBox={VIEW_BOX} aria-hidden="true" focusable="false">
                    <ItemArt />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </GameShell>
  );
}
