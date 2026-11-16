import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Pipo } from '@/components/brand/Pipo';
import { Button } from './Button';
import buttonStyles from './Button.module.css';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Muda quando a rota muda: um erro em um jogo não "contamina" a próxima tela. */
  resetKey?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  resetKey?: string;
}

/**
 * Rede de proteção: se algo inesperado quebrar (um jogo que não carregou por
 * falta de internet, por exemplo), a criança vê uma tela amigável com um
 * caminho de volta, em vez de uma página em branco.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, resetKey: this.props.resetKey };

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  static getDerivedStateFromProps(
    props: ErrorBoundaryProps,
    state: ErrorBoundaryState,
  ): Partial<ErrorBoundaryState> | null {
    if (props.resetKey !== state.resetKey) {
      return { hasError: false, resetKey: props.resetKey };
    }
    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Fica só no console do navegador: o site não envia nada para lugar nenhum.
    console.error('[Brinca João] Algo inesperado aconteceu:', error, info.componentStack);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className={styles.wrap} role="alert">
        <Pipo className={styles.pipo} />
        <h1 className={styles.title}>Ops! Algo não funcionou.</h1>
        <p className={styles.text}>Não foi nada que você fez. Vamos tentar de novo?</p>
        <div className={styles.actions}>
          <Button variant="primary" size="lg" icon="restart" onClick={this.handleRetry}>
            Tentar de novo
          </Button>
          {/* Link comum (recarrega a página): o jeito mais seguro de recomeçar. */}
          <a
            className={`${buttonStyles.button} ${buttonStyles.soft} ${buttonStyles.lg}`}
            href="/"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }
}
