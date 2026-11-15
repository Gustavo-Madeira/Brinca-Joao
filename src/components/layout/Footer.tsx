import styles from './Footer.module.css';

/** Rodapé discreto com a homenagem que deu origem ao projeto. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.dedication}>Feito com amor para João Lucas 💙</p>
      <p className={styles.note}>Sem anúncios, sem cadastro e sem coleta de dados.</p>
    </footer>
  );
}
