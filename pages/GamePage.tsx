import { Suspense } from 'react';
import { Pipo } from '@/components/brand/Pipo';
import { PageLayout } from '@/components/layout/PageLayout';
import { TopBar } from '@/components/layout/TopBar';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { getGameBySlug } from '@/games/registry';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { NotFoundPage } from './NotFoundPage';
import styles from './GamePage.module.css';

function GameLoading() {
  return (
    <div className={styles.loading} role="status">
      <Pipo className={styles.loadingPipo} floating />
      <p>Preparando a brincadeira…</p>
    </div>
  );
}

/** Tela de um jogo: barra com "Voltar", nome do jogo e configurações; depois, a brincadeira. */
export function GamePage({ slug }: { slug: string }) {
  const game = getGameBySlug(slug);
  useDocumentTitle(game ? game.title : 'Página não encontrada');

  if (!game) return <NotFoundPage />;

  const Game = game.Component;

  return (
    <PageLayout topBar={<TopBar variant="jogo" title={game.title} />} showFooter={false}>
      <div className={styles.game} data-theme={game.theme}>
        <ErrorBoundary resetKey={game.id}>
          <Suspense fallback={<GameLoading />}>
            <Game game={game} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </PageLayout>
  );
}
