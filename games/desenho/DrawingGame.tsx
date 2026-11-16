import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import { GameShell } from '@/components/game/GameShell';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Feedback } from '@/components/ui/Feedback';
import { Icon } from '@/components/ui/Icon';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import type { SegmentOption } from '@/components/ui/SegmentedControl';
import { useSound } from '@/hooks/useSound';
import type { GameProps } from '@/types';
import { readStorage, removeStorage, writeStorageText } from '@/utils/storage';
import {
  BRUSH_SIZES,
  DRAWING_KEY,
  ERASER_SCALE,
  PALETTE,
  PAPER_COLOR,
  clamp01,
  drawAll,
  drawLastSegment,
  drawStroke,
  parseDrawing,
  serializeDrawing,
} from './strokes';
import type { BrushSizeId, Drawing, Stroke } from './strokes';
import styles from './DrawingGame.module.css';

type Tool = 'pincel' | 'borracha';

const TOOL_OPTIONS: ReadonlyArray<SegmentOption<Tool>> = [
  { value: 'pincel', label: 'Pincel', symbol: <Icon name="brush" size={1.375} /> },
  { value: 'borracha', label: 'Borracha', symbol: <Icon name="eraser" size={1.375} /> },
];

const DOT_REM: Record<BrushSizeId, number> = { fino: 0.375, medio: 0.75, grosso: 1.25 };

const SIZE_OPTIONS: ReadonlyArray<SegmentOption<BrushSizeId>> = BRUSH_SIZES.map((size) => ({
  value: size.id,
  label: size.name,
  symbol: (
    <span
      style={{
        display: 'block',
        width: `${DOT_REM[size.id]}rem`,
        height: `${DOT_REM[size.id]}rem`,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
      }}
    />
  ),
}));

/** Passo do pincel no teclado, em fração do papel. */
const KEY_STEP = 0.02;
const KEY_STEP_BIG = 0.06;
/** Largura da imagem baixada, em pixels. */
const EXPORT_WIDTH = 1600;
const MAX_POINTS_PER_STROKE = 6000;

function loadInitialDrawing(): Drawing {
  const saved = parseDrawing(readStorage(DRAWING_KEY));
  if (saved && saved.strokes.length > 0) return saved;
  // Papel quadrado em telas estreitas (celular em pé); mais largo nas demais.
  const narrow = typeof window !== 'undefined' && window.innerWidth < 640;
  return { aspect: narrow ? 1 : 4 / 3, strokes: [] };
}

/**
 * Desenho Livre: um papel em branco, doze cores, três espessuras, borracha,
 * desfazer, limpar (com confirmação) e baixar a imagem. Funciona com dedo,
 * caneta, mouse e também pelo teclado (setas movem o pincel, espaço abaixa
 * ou levanta). O desenho fica guardado no aparelho para continuar depois.
 */
export default function DrawingGame(_props: GameProps) {
  const sound = useSound();
  const [initial] = useState(loadInitialDrawing);
  const aspect = initial.aspect;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>(initial.strokes);
  const currentRef = useRef<Stroke | null>(null);
  const pointerRef = useRef<number | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const saveTimerRef = useRef<number | null>(null);

  const [tool, setTool] = useState<Tool>('pincel');
  const [colorId, setColorId] = useState(PALETTE[1]?.id ?? 'preto');
  const [sizeId, setSizeId] = useState<BrushSizeId>('medio');
  const [strokeCount, setStrokeCount] = useState(initial.strokes.length);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [cursor, setCursor] = useState({ x: 0.5, y: 0.5 });
  const [penDown, setPenDown] = useState(false);

  const colorGroup = useId();
  const helpId = useId();

  const getContext = useCallback((): CanvasRenderingContext2D | null => {
    try {
      return canvasRef.current?.getContext('2d') ?? null;
    } catch {
      return null;
    }
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;
    drawAll(ctx, strokesRef.current, canvas.width, canvas.height);
    if (currentRef.current) drawStroke(ctx, currentRef.current, canvas.width, canvas.height);
  }, [getContext]);

  // O papel acompanha o tamanho da tela (e a nitidez do aparelho) sem borrar o desenho.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      redraw();
    };

    resize();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [redraw]);

  const save = useCallback(() => {
    const text = serializeDrawing({ aspect, strokes: strokesRef.current });
    if (text === null) removeStorage(DRAWING_KEY);
    else writeStorageText(DRAWING_KEY, text);
  }, [aspect]);

  const scheduleSave = useCallback(() => {
    if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      saveTimerRef.current = null;
      save();
    }, 400);
  }, [save]);

  // Ao sair da página (ou fechar a aba), o que estava esperando para salvar é salvo.
  useEffect(() => {
    const flush = () => {
      if (saveTimerRef.current === null) return;
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
      save();
    };
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [save]);

  function beginStroke(x: number, y: number) {
    const size = BRUSH_SIZES.find((item) => item.id === sizeId)?.value ?? 0.02;
    const color = PALETTE.find((item) => item.id === colorId)?.value ?? '#2b2f45';
    const stroke: Stroke =
      tool === 'borracha'
        ? { color: PAPER_COLOR, size: size * ERASER_SCALE, points: [x, y] }
        : { color, size, points: [x, y] };
    currentRef.current = stroke;
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (canvas && ctx) drawStroke(ctx, stroke, canvas.width, canvas.height);
  }

  function extendStroke(x: number, y: number) {
    const stroke = currentRef.current;
    if (!stroke || stroke.points.length >= MAX_POINTS_PER_STROKE * 2) return;
    const lastX = stroke.points[stroke.points.length - 2] ?? x;
    const lastY = stroke.points[stroke.points.length - 1] ?? y;
    // Ignora tremidinhas menores que um pontinho.
    if (Math.abs(x - lastX) < 0.0015 && Math.abs(y - lastY) < 0.0015) return;
    stroke.points.push(x, y);
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (canvas && ctx) drawLastSegment(ctx, stroke, canvas.width, canvas.height);
  }

  function endStroke() {
    const stroke = currentRef.current;
    if (!stroke) return;
    currentRef.current = null;
    strokesRef.current = [...strokesRef.current, stroke];
    setStrokeCount(strokesRef.current.length);
    setMessage('');
    redraw();
    scheduleSave();
  }

  function toPoint(clientX: number, clientY: number): [number, number] {
    const rect = rectRef.current ?? canvasRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return [0.5, 0.5];
    return [
      clamp01((clientX - rect.left) / rect.width),
      clamp01((clientY - rect.top) / rect.height),
    ];
  }

  function liftKeyboardPen() {
    if (!penDown) return;
    endStroke();
    setPenDown(false);
  }

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    // Só um dedo desenha por vez: a palma da mão apoiada não risca o papel.
    if (pointerRef.current !== null) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    liftKeyboardPen();
    pointerRef.current = event.pointerId;
    rectRef.current = event.currentTarget.getBoundingClientRect();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Sem captura, o traço termina quando o dedo sai do papel.
    }
    const [x, y] = toPoint(event.clientX, event.clientY);
    beginStroke(x, y);
  }

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    if (pointerRef.current !== event.pointerId) return;
    const native = event.nativeEvent;
    // Eventos "agrupados" pelo navegador deixam a linha mais redondinha.
    const coalesced =
      typeof native.getCoalescedEvents === 'function' ? native.getCoalescedEvents() : [];
    const events = coalesced.length > 0 ? coalesced : [native];
    for (const item of events) {
      const [x, y] = toPoint(item.clientX, item.clientY);
      extendStroke(x, y);
    }
  }

  function handlePointerEnd(event: PointerEvent<HTMLCanvasElement>) {
    if (pointerRef.current !== event.pointerId) return;
    pointerRef.current = null;
    rectRef.current = null;
    endStroke();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLCanvasElement>) {
    const step = event.shiftKey ? KEY_STEP_BIG : KEY_STEP;
    let dx = 0;
    let dy = 0;

    switch (event.key) {
      case 'ArrowLeft':
        dx = -step;
        break;
      case 'ArrowRight':
        dx = step;
        break;
      case 'ArrowUp':
        dy = -step;
        break;
      case 'ArrowDown':
        dy = step;
        break;
      case ' ':
      case 'Enter':
        event.preventDefault();
        if (penDown) {
          liftKeyboardPen();
          setMessage('Pincel levantado.');
        } else {
          beginStroke(cursor.x, cursor.y);
          setPenDown(true);
          setMessage('Pincel no papel. Use as setas para desenhar.');
        }
        return;
      default:
        return;
    }

    event.preventDefault();
    const next = { x: clamp01(cursor.x + dx), y: clamp01(cursor.y + dy) };
    setCursor(next);
    if (penDown) extendStroke(next.x, next.y);
  }

  function undo() {
    if (strokesRef.current.length === 0) return;
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
    setMessage('Último traço apagado.');
    redraw();
    scheduleSave();
  }

  function clearAll() {
    currentRef.current = null;
    strokesRef.current = [];
    setStrokeCount(0);
    setPenDown(false);
    setConfirmOpen(false);
    setMessage('Papel limpinho! Pode desenhar de novo.');
    redraw();
    scheduleSave();
  }

  function download() {
    const fail = () => setMessage('Não deu para salvar a imagem neste aparelho.');
    try {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = EXPORT_WIDTH;
      exportCanvas.height = Math.round(EXPORT_WIDTH / aspect);
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) {
        fail();
        return;
      }
      drawAll(ctx, strokesRef.current, exportCanvas.width, exportCanvas.height);

      const deliver = (url: string, isObjectUrl: boolean) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'meu-desenho-brinca-joao.png';
        document.body.appendChild(link);
        link.click();
        link.remove();
        if (isObjectUrl) window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
        sound.play('acerto');
        setMessage('Desenho salvo! Procure na pasta de downloads.');
      };

      if (typeof exportCanvas.toBlob === 'function') {
        exportCanvas.toBlob((blob) => {
          if (blob) deliver(URL.createObjectURL(blob), true);
          else fail();
        }, 'image/png');
      } else {
        deliver(exportCanvas.toDataURL('image/png'), false);
      }
    } catch {
      fail();
    }
  }

  const hasDrawing = strokeCount > 0;

  return (
    <GameShell
      instruction="Escolha uma cor e desenhe o que quiser!"
      actions={
        <>
          <Button variant="soft" icon="undo" onClick={undo} disabled={!hasDrawing}>
            Desfazer
          </Button>
          <Button
            variant="soft"
            icon="trash"
            onClick={() => setConfirmOpen(true)}
            disabled={!hasDrawing}
          >
            Limpar
          </Button>
          <Button variant="primary" icon="download" onClick={download}>
            Baixar desenho
          </Button>
        </>
      }
    >
      <div className={styles.paper} style={{ '--aspect': aspect } as CSSProperties}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          // role="application": o papel é uma área interativa de verdade, operada
          // pelo teclado (setas e espaço). É o papel ARIA indicado para avisar o
          // leitor de tela de que as teclas vão direto para o desenho.
          // oxlint-disable-next-line jsx-a11y/no-interactive-element-to-noninteractive-role
          role="application"
          aria-roledescription="papel de desenho"
          aria-label="Papel de desenho"
          aria-describedby={helpId}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onKeyDown={handleKeyDown}
          onBlur={liftKeyboardPen}
        />
        {/* Mira do teclado: só aparece quando o papel recebe foco pelo teclado. */}
        <span
          className={styles.cursor}
          data-down={penDown}
          style={{ left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%` }}
          aria-hidden="true"
        />
      </div>

      <Feedback message={message} />

      <div className={styles.toolbar}>
        <fieldset className={styles.colors}>
          <legend className={styles.legend}>Cores</legend>
          <div className={styles.swatches}>
            {PALETTE.map((color) => {
              const selected = tool === 'pincel' && color.id === colorId;
              return (
                <label key={color.id} className={styles.swatchLabel} title={color.name}>
                  <input
                    type="radio"
                    className={styles.swatchInput}
                    name={colorGroup}
                    aria-label={color.name}
                    checked={selected}
                    onChange={() => {
                      setColorId(color.id);
                      // Escolher uma cor já volta para o pincel.
                      setTool('pincel');
                    }}
                  />
                  <span
                    className={styles.swatch}
                    style={{ backgroundColor: color.value, color: color.check }}
                  >
                    {selected && <Icon name="check" size={1.375} />}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className={styles.controls}>
          <SegmentedControl
            legend="Ferramenta"
            options={TOOL_OPTIONS}
            value={tool}
            onChange={setTool}
            compact
          />
          <SegmentedControl
            legend="Traço"
            options={SIZE_OPTIONS}
            value={sizeId}
            onChange={setSizeId}
            compact
          />
        </div>
      </div>

      <p id={helpId} className={styles.help}>
        No teclado: as setas movem o pincel e a barra de espaço abaixa ou levanta o pincel.
      </p>

      <ConfirmDialog
        open={confirmOpen}
        title="Limpar o desenho?"
        confirmLabel="Sim, limpar"
        confirmIcon="trash"
        onConfirm={clearAll}
        onCancel={() => setConfirmOpen(false)}
      >
        <p>O desenho todo será apagado e o papel ficará em branco.</p>
      </ConfirmDialog>
    </GameShell>
  );
}
