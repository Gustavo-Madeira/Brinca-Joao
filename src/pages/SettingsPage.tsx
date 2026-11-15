import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { TopBar } from '@/components/layout/TopBar';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { Button, LinkButton } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Feedback } from '@/components/ui/Feedback';
import { Icon } from '@/components/ui/Icon';
import { GAMES } from '@/games/registry';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useProgress } from '@/hooks/useProgress';
import { useSettings } from '@/hooks/useSettings';
import { clearAllStorage } from '@/utils/storage';
import styles from './SettingsPage.module.css';

const FAMILY_NOTES = [
  'Os sons começam desligados e nada toca sozinho.',
  'Não há relógio nem pontuação: cada criança brinca no seu ritmo.',
  'Errar não tem bronca. É só tentar de novo, quantas vezes quiser.',
  'Sem anúncios, sem cadastro e sem coleta de dados. As escolhas ficam só neste aparelho.',
  'No celular ou tablet, adicione o site à tela inicial para abrir em tela cheia.',
];

/** Configurações completas, com um cantinho de informações para a família. */
export function SettingsPage() {
  useDocumentTitle('Configurações');
  const { resetSettings } = useSettings();
  const { progress, resetProgress } = useProgress();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [erased, setErased] = useState(false);

  const played = GAMES.map((game) => ({ game, count: progress.plays[game.id] ?? 0 })).filter(
    (item) => item.count > 0,
  );

  function eraseEverything() {
    clearAllStorage();
    resetSettings();
    resetProgress();
    setConfirmOpen(false);
    setErased(true);
  }

  return (
    <PageLayout topBar={<TopBar />} narrow>
      <header className={styles.header}>
        <h1 className={styles.heading}>Configurações</h1>
        <p className={styles.lead}>Deixe o Brinca João do seu jeito.</p>
      </header>

      <SettingsPanel />

      <section className={styles.family} aria-labelledby="familia-titulo">
        <h2 id="familia-titulo" className={styles.sectionTitle}>
          Para a família
        </h2>
        <ul className={styles.notes}>
          {FAMILY_NOTES.map((note) => (
            <li key={note} className={styles.note}>
              <Icon name="heart" size={1.125} className={styles.noteIcon} />
              <span>{note}</span>
            </li>
          ))}
        </ul>

        <h3 className={styles.subTitle}>Brincadeiras concluídas neste aparelho</h3>
        {played.length > 0 ? (
          <ul className={styles.plays}>
            {played.map(({ game, count }) => (
              <li key={game.id} className={styles.play}>
                <span>{game.title}</span>
                <span className={styles.playCount}>
                  <Icon name="star" size={1.125} className={styles.playStar} />
                  {count} {count === 1 ? 'vez' : 'vezes'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Ainda não há brincadeiras concluídas. Vamos começar?</p>
        )}

        <div className={styles.erase}>
          <Button variant="soft" icon="trash" onClick={() => setConfirmOpen(true)}>
            Apagar dados deste aparelho
          </Button>
          <Feedback
            tone="neutro"
            message={erased ? 'Pronto! Tudo voltou ao começo.' : ''}
            className={styles.eraseStatus}
          />
        </div>
      </section>

      <div className={styles.footerAction}>
        <LinkButton to="/jogos" variant="primary" size="lg" icon="play">
          Ir para os jogos
        </LinkButton>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Apagar os dados?"
        confirmLabel="Sim, apagar"
        confirmIcon="trash"
        onConfirm={eraseEverything}
        onCancel={() => setConfirmOpen(false)}
      >
        <p>
          As configurações, o progresso e o desenho salvo neste aparelho serão apagados. Não dá
          para desfazer.
        </p>
      </ConfirmDialog>
    </PageLayout>
  );
}
