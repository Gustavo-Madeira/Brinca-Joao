import { DIFFICULTIES } from '@/config/difficulty';
import { LevelDots } from '@/components/ui/LevelDots';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import type { SegmentOption } from '@/components/ui/SegmentedControl';
import type { Difficulty } from '@/types';

const OPTIONS: ReadonlyArray<SegmentOption<Difficulty>> = DIFFICULTIES.map((item) => ({
  value: item.id,
  label: item.label,
  symbol: <LevelDots level={item.level} />,
}));

interface DifficultyPickerProps {
  value: Difficulty;
  onChange: (value: Difficulty) => void;
}

/** Seletor dos três níveis. Trocar de nível é sempre opcional. */
export function DifficultyPicker({ value, onChange }: DifficultyPickerProps) {
  return (
    <SegmentedControl legend="Nível" options={OPTIONS} value={value} onChange={onChange} compact />
  );
}
