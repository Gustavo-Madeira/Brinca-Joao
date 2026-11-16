import { PageLayout } from '@/components/layout/PageLayout';
import { TopBar } from '@/components/layout/TopBar';
import { LinkButton } from '@/components/ui/Button';
import { GAMES } from '@/games/registry';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { GameMeta } from '@/types';
import styles from './GamesPage.module.css';

function GameCard({ game }: { game: GameMeta }) {
  const preload = () => void game.load();

  return (
    <article className={styles.card} data-theme={game.theme}>
      <div className={styles.art}>
        <game.Thumb className={styles.thumb} />
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{game.title}</h2>
        <p className={styles.description}>{game.description}</p>
        {/* O ::after deste link cobre o cartão inteiro: tocar em qualquer parte abre o jogo. */}
        <LinkButton
          to={`/jogos/${game.slug}`}
          variant="primary"
          size="lg"
          icon="play"
          className={styles.play}
          aria-label={`Jogar ${game.title}`}
          onPointerEnter={preload}
          onFocus={preload}
        >
          Jogar
        </LinkButton>
      </div>
    </article>
  );
}

/** Lista de jogos em cartões grandes. */
export function GamesPage() {
  useDocumentTitle('Jogos');

  return (
    <PageLayout topBar={<TopBar hideGamesLink />}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Vamos brincar de quê?</h1>
        <p className={styles.lead}>Escolha um jogo. Dá para trocar quando quiser!</p>
      </header>
      <ul className={styles.grid}>
        {GAMES.map((game) => (
          <li key={game.id}>
            <GameCard game={game} />
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
