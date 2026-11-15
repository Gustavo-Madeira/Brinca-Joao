import styles from './Footer.module.css';

/** Portfólio de quem criou o site. É o único link do Brinca João que leva para fora dele. */
const CREATOR_URL = 'https://gustavomadeira-portfolio.netlify.app/';

/**
 * Rodapé discreto: a homenagem que deu origem ao projeto e o crédito do criador.
 * Ele só aparece nas páginas de navegação — as telas de jogo ficam sem rodapé,
 * para a criança não sair da brincadeira sem querer.
 */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.dedication}>Feito com amor para João Lucas 💙</p>
      <p className={styles.note}>Sem anúncios, sem cadastro e sem coleta de dados.</p>
      <p className={styles.credit}>
        Criado por{' '}
        <a className={styles.creditLink} href={CREATOR_URL} target="_blank" rel="noopener noreferrer">
          Gustavo Madeira
          <span className="sr-only"> (abre o portfólio em uma nova aba)</span>
        </a>
      </p>
    </footer>
  );
}
