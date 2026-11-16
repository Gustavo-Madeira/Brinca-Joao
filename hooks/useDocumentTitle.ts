import { useEffect } from 'react';

const SITE_NAME = 'Brinca João';

/** Atualiza o título da aba — ajuda leitores de tela a anunciar a página atual. */
export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} 💙 — Um mundo de brincadeiras`;
  }, [title]);
}
