import { useState } from 'react';
import { GameShell } from '@/components/game/GameShell';
import { Icon } from '@/components/ui/Icon';
import { useProgress } from '@/hooks/useProgress';
import { useSound } from '@/hooks/useSound';
import { Art } from '@/illustrations/Art';
import type { GameProps } from '@/types';
import { cx } from '@/utils/cx';
import { canSpeak } from '@/utils/speech';
import { ANIMALS } from './data';
import type { AnimalInfo } from './data';
import styles from './AnimalsGame.module.css';

/**
 * Descubra os Animais: exploração livre.
 * Não há certo nem errado — tocar em um animal mostra o nome, o som
 * escrito, uma curiosidade e (com os sons ligados) fala tudo em voz alta.
 */
export default function AnimalsGame(_props: GameProps) {
  const sound = useSound();
  const { progress, markAnimalSeen } = useProgress();
  const [activeId, setActiveId] = useState<string | null>(null);
  // Aumenta a cada toque para a animação recomeçar mesmo no mesmo animal.
  const [tapCount, setTapCount] = useState(0);

  const active = ANIMALS.find((animal) => animal.id === activeId) ?? null;
  const seenCount = ANIMALS.filter((animal) => progress.animalsSeen.includes(animal.id)).length;

  function handleTap(animal: AnimalInfo) {
    setActiveId(animal.id);
    setTapCount((count) => count + 1);
    markAnimalSeen(animal.id);
    if (canSpeak()) {
      sound.speak(animal.spoken);
    } else {
      sound.play('selecionar');
    }
  }

  return (
    <GameShell
      instruction="Toque em um animal para conhecer!"
      spokenInstruction="Toque em um animal para conhecer."
    >
      <ul className={styles.grid}>
        {ANIMALS.map((animal) => {
          const isActive = animal.id === activeId;
          const seen = progress.animalsSeen.includes(animal.id);
          return (
            <li key={animal.id}>
              <button
                type="button"
                className={cx(styles.card, isActive && styles.active)}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => handleTap(animal)}
              >
                {/* As chaves mudam a cada toque para as animações recomeçarem. */}
                {isActive && (
                  <span
                    key={`balao-${tapCount}`}
                    className={`${styles.bubble} bj-pop-in`}
                    aria-hidden="true"
                  >
                    {animal.sound}
                  </span>
                )}
                <Art
                  key={isActive ? `figura-${tapCount}` : 'figura-parada'}
                  art={animal.art}
                  className={cx(styles.art, isActive && 'bj-wiggle')}
                />
                <span className={styles.name}>{animal.name}</span>
                {seen && (
                  <span className={styles.seen} aria-hidden="true">
                    <Icon name="heart" size={1.125} />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.info} role="status" aria-live="polite">
        {active ? (
          <>
            <Art art={active.art} className={styles.infoArt} />
            <p className={styles.infoText}>
              <strong className={styles.infoName}>
                {active.name}: {active.sound}
              </strong>{' '}
              <span>{active.fact}</span>
            </p>
          </>
        ) : (
          <p className={styles.infoText}>
            <span>Qual animal você quer conhecer primeiro?</span>
          </p>
        )}
      </div>

      <p className={styles.count}>
        <Icon name="heart" size={1.125} className={styles.countIcon} />
        Animais que você já visitou: {seenCount} de {ANIMALS.length}
      </p>
    </GameShell>
  );
}
