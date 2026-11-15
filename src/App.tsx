import { useEffect, useRef } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ProgressProvider } from '@/context/ProgressProvider';
import { SettingsProvider } from '@/context/SettingsProvider';
import { GamePage } from '@/pages/GamePage';
import { GamesPage } from '@/pages/GamesPage';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { SettingsPage } from '@/pages/SettingsPage';

/**
 * A cada troca de página: volta ao topo e leva o foco para o conteúdo
 * principal, para que teclado e leitores de tela comecem do lugar certo.
 */
function RouteEffects() {
  const [location] = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    document.getElementById('conteudo')?.focus({ preventScroll: true });
  }, [location]);

  return null;
}

/**
 * Rotas do site:
 *   /                 página inicial
 *   /jogos            lista de jogos
 *   /jogos/:slug      um jogo (veja src/games/registry.ts)
 *   /configuracoes    configurações e informações para a família
 */
function AppRoutes() {
  const [location] = useLocation();

  return (
    <ErrorBoundary resetKey={location}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/jogos" component={GamesPage} />
        <Route path="/jogos/:slug">{(params) => <GamePage slug={params.slug} />}</Route>
        <Route path="/configuracoes" component={SettingsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </ErrorBoundary>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <ProgressProvider>
          <RouteEffects />
          <AppRoutes />
        </ProgressProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}
