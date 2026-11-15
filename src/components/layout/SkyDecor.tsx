import styles from './SkyDecor.module.css';

function Cloud({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 76" focusable="false">
      <g fill="#ffffff">
        <ellipse cx="50" cy="46" rx="36" ry="22" />
        <ellipse cx="90" cy="34" rx="34" ry="28" />
        <ellipse cx="122" cy="50" rx="26" ry="18" />
        <rect x="30" y="46" width="102" height="22" rx="11" />
      </g>
    </svg>
  );
}

/**
 * Nuvens de enfeite no alto da página. São só decoração: ficam fora da
 * leitura de tela e somem no modo calmo (classe global `decor`).
 */
export function SkyDecor() {
  return (
    <div className={`${styles.sky} decor`} aria-hidden="true">
      <Cloud className={styles.cloudA} />
      <Cloud className={styles.cloudB} />
      <Cloud className={styles.cloudC} />
    </div>
  );
}
