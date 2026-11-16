import { Link } from 'wouter';
import { HeroScene } from '@/components/brand/HeroScene';
import { Logo } from '@/components/brand/Logo';
import { PageLayout } from '@/components/layout/PageLayout';
import { TopBar } from '@/components/layout/TopBar';
import { LinkButton } from '@/components/ui/Button';
import { GAMES } from '@/games/registry';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import styles from './HomePage.module.css';

/** Página inicial: boas-vindas, botão grande "Vamos brincar!" e atalhos para os jogos. */
export function HomePage() {
  useDocumentTitle();

  return (
    <PageLayout topBar={<TopBar hideGamesLink />}>
      <section className={styles.hero} aria-labelledby="inicio-titulo">
        <div className={styles.heroText}>
          <h1 id="inicio-titulo" className={styles.heroTitle}>
            <Logo size="lg" hideMark />
          </h1>
          <p className={styles.tagline}>Um mundo de brincadeiras feito com carinho!</p>
          <div className={styles.heroActions}>
            <LinkButton to="/jogos" variant="primary" size="xl" icon="play">
              Vamos brincar!
            </LinkButton>
            <LinkButton to="/configuracoes" variant="soft" size="lg" icon="settings">
              Configurações
            </LinkButton>
          </div>
        </div>
        <HeroScene className={styles.heroArt} pipoClassName="bj-float" />
      </section>

      <section className={styles.games} aria-labelledby="inicio-jogos">
        <h2 id="inicio-jogos" className={styles.gamesTitle}>
          Escolha uma brincadeira
        </h2>
        <ul className={styles.gameList}>
          {GAMES.map((game) => (
            <li key={game.id}>
              <Link
                href={`/jogos/${game.slug}`}
                className={styles.tile}
                data-theme={game.theme}
                onPointerEnter={() => void game.load()}
                onFocus={() => void game.load()}
              >
                <game.Thumb className={styles.tileArt} />
                <span className={styles.tileName}>{game.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageLayout>
  );
}
