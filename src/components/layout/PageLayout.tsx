import type { MouseEvent, ReactNode } from 'react';
import { cx } from '@/utils/cx';
import { Footer } from './Footer';
import { SkyDecor } from './SkyDecor';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  /** Barra do topo da página. */
  topBar: ReactNode;
  children: ReactNode;
  /** Jogos não mostram o rodapé: a tela fica só com a brincadeira. */
  showFooter?: boolean;
  /** Largura menor para telas de leitura (configurações). */
  narrow?: boolean;
}

/** Esqueleto comum de todas as páginas: pular para o conteúdo, topo, <main> e rodapé. */
export function PageLayout({ topBar, children, showFooter = true, narrow }: PageLayoutProps) {
  function skipToContent(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const main = document.getElementById('conteudo');
    main?.focus();
    if (main && typeof main.scrollIntoView === 'function') main.scrollIntoView();
  }

  return (
    <>
      <a className={styles.skip} href="#conteudo" onClick={skipToContent}>
        Pular para o conteúdo
      </a>
      <SkyDecor />
      {topBar}
      <main id="conteudo" tabIndex={-1} className={cx(styles.main, narrow && styles.narrow)}>
        {children}
      </main>
      {showFooter && <Footer />}
    </>
  );
}
