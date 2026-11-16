import { Pipo } from '@/components/brand/Pipo';
import { PageLayout } from '@/components/layout/PageLayout';
import { TopBar } from '@/components/layout/TopBar';
import { LinkButton } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import styles from './NotFoundPage.module.css';

/** Endereço que não existe: uma tela amigável com caminhos de volta. */
export function NotFoundPage() {
  useDocumentTitle('Página não encontrada');

  return (
    <PageLayout topBar={<TopBar />}>
      <div className={styles.wrap}>
        <Pipo className={styles.pipo} floating />
        <h1 className={styles.title}>Ops! Essa página voou para longe.</h1>
        <p className={styles.text}>Mas os jogos continuam aqui, esperando por você.</p>
        <div className={styles.actions}>
          <LinkButton to="/jogos" variant="primary" size="lg" icon="play">
            Ver os jogos
          </LinkButton>
          <LinkButton to="/" variant="soft" size="lg" icon="home">
            Página inicial
          </LinkButton>
        </div>
      </div>
    </PageLayout>
  );
}
