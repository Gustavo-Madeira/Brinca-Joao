import styles from './LevelDots.module.css';

/**
 * Bolinhas que mostram o nível (1, 2 ou 3) sem depender de leitura:
 * ● ○ ○ fácil · ● ● ○ médio · ● ● ● desafio.
 */
export function LevelDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className={styles.dots} aria-hidden="true">
      {[1, 2, 3].map((dot) => (
        <span key={dot} className={dot <= level ? styles.filled : styles.hollow} />
      ))}
    </span>
  );
}
