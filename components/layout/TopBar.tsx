import { useState } from 'react';
import { Link } from 'wouter';
import { Logo } from '@/components/brand/Logo';
import { SettingsDialog } from '@/components/settings/SettingsDialog';
import { IconButton, LinkButton } from '@/components/ui/Button';
import styles from './TopBar.module.css';

interface TopBarProps {
  /**
   * `site`: logotipo e atalho para os jogos.
   * `jogo`: botão de voltar e o nome do jogo, sem distrações.
   */
  variant?: 'site' | 'jogo';
  /** Nome do jogo (vira o título principal da página no modo `jogo`). */
  title?: string;
  /** Esconde o atalho "Jogos" quando a pessoa já está na lista de jogos. */
  hideGamesLink?: boolean;
}

/**
 * Barra do topo. Fica sempre no mesmo lugar e com os mesmos botões, para a
 * navegação ser previsível: voltar à esquerda, configurações à direita.
 */
export function TopBar({ variant = 'site', title, hideGamesLink }: TopBarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        {variant === 'jogo' ? (
          <>
            <LinkButton to="/jogos" variant="soft" icon="arrowLeft" aria-label="Voltar para os jogos">
              Voltar
            </LinkButton>
            <h1 className={styles.title}>{title}</h1>
          </>
        ) : (
          <Link href="/" className={styles.home} aria-label="Brinca João, página inicial">
            <Logo size="sm" />
          </Link>
        )}

        <div className={styles.actions}>
          {variant === 'site' && !hideGamesLink && (
            // Em telas estreitas este atalho some (a página já traz um botão para os jogos).
            <LinkButton to="/jogos" variant="soft" icon="grid" className={styles.gamesLink}>
              Jogos
            </LinkButton>
          )}
          <IconButton
            icon="settings"
            label="Configurações"
            aria-haspopup="dialog"
            onClick={() => setSettingsOpen(true)}
          />
        </div>
      </div>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </header>
  );
}
