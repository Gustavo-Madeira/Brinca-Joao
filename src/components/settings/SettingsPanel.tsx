import { DIFFICULTIES } from '@/config/difficulty';
import { SIZES } from '@/config/settings';
import { LevelDots } from '@/components/ui/LevelDots';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import type { SegmentOption } from '@/components/ui/SegmentedControl';
import { SwitchRow } from '@/components/ui/Switch';
import { useProgress } from '@/hooks/useProgress';
import { useSettings } from '@/hooks/useSettings';
import type { Difficulty, ElementSize } from '@/types';
import { playSound } from '@/utils/audio';
import styles from './SettingsPanel.module.css';

const SIZE_SYMBOL_REM: Record<ElementSize, number> = { normal: 1, grande: 1.3, enorme: 1.65 };

const SIZE_OPTIONS: ReadonlyArray<SegmentOption<ElementSize>> = SIZES.map((size) => ({
  value: size.id,
  label: size.label,
  symbol: (
    <span style={{ fontSize: `${SIZE_SYMBOL_REM[size.id]}rem`, fontWeight: 800, lineHeight: 1 }}>
      A
    </span>
  ),
}));

const LEVEL_OPTIONS: ReadonlyArray<SegmentOption<Difficulty>> = DIFFICULTIES.map((item) => ({
  value: item.id,
  label: item.label,
  symbol: <LevelDots level={item.level} />,
}));

/**
 * Os ajustes do site. Tudo vale na hora e fica salvo só neste aparelho.
 * É usado tanto no diálogo rápido (engrenagem) quanto na página de configurações.
 */
export function SettingsPanel() {
  const { settings, updateSettings, prefersReducedMotion } = useSettings();
  const { clearGameLevels } = useProgress();

  const animationsLocked = prefersReducedMotion || settings.calmMode;
  let animationsDescription = 'Movimentos suaves nas brincadeiras.';
  if (prefersReducedMotion) {
    animationsDescription = 'Seu aparelho pede menos movimento. As animações ficam desligadas.';
  } else if (settings.calmMode) {
    animationsDescription = 'O modo calmo deixa as animações desligadas.';
  }

  function handleSound(next: boolean) {
    updateSettings({ sound: next });
    // Uma amostra curtinha, para a pessoa saber como é o som que acabou de ligar.
    if (next) playSound('acerto', { volume: settings.calmMode ? 0.55 : 1 });
  }

  function handleDifficulty(next: Difficulty) {
    updateSettings({ difficulty: next });
    // O nível inicial passa a valer para todos os jogos.
    clearGameLevels();
  }

  return (
    <div className={styles.panel}>
      <SwitchRow
        icon={settings.sound ? 'soundOn' : 'soundOff'}
        label="Sons"
        description="Sons suaves e voz. Começam sempre desligados."
        checked={settings.sound}
        onChange={handleSound}
      />
      <SwitchRow
        icon="sparkle"
        label="Animações"
        description={animationsDescription}
        checked={settings.animations && !animationsLocked}
        disabled={animationsLocked}
        onChange={(next) => updateSettings({ animations: next })}
      />
      <SwitchRow
        icon="calm"
        label="Modo calmo"
        description="Menos movimento, menos enfeites e sons mais baixos."
        checked={settings.calmMode}
        onChange={(next) => updateSettings({ calmMode: next })}
      />

      <div className={styles.group}>
        <SegmentedControl
          legend="Tamanho"
          description="Deixa botões, letras e figuras maiores."
          options={SIZE_OPTIONS}
          value={settings.size}
          onChange={(next) => updateSettings({ size: next })}
        />
      </div>

      <div className={styles.group}>
        <SegmentedControl
          legend="Nível dos jogos"
          description="Nível em que os jogos começam. Dá para mudar dentro de cada jogo."
          options={LEVEL_OPTIONS}
          value={settings.difficulty}
          onChange={handleDifficulty}
        />
      </div>
    </div>
  );
}
