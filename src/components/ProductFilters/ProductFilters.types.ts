export type FilterOption = {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
};

export type CheckboxGroup = {
  id: string;
  label: string;
  kind: 'checkbox';
  options: readonly FilterOption[];
  searchable?: boolean;
  searchPlaceholder?: string;
};

export type RadioGroup = {
  id: string;
  label: string;
  kind: 'radio';
  options: readonly FilterOption[];
  searchable?: boolean;
  searchPlaceholder?: string;
};

export type RangeGroup = {
  id: string;
  label: string;
  kind: 'range';
  min: number;
  max: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
};

export type FilterGroup = CheckboxGroup | RadioGroup | RangeGroup;

export type FilterRangeValue = {
  min?: number;
  max?: number;
};

export type FilterValue = {
  options: Record<string, readonly string[] | undefined>;
  ranges: Record<string, FilterRangeValue | undefined>;
};

export type SortOption = {
  value: string;
  label: string;
};

export type ActiveChip = {
  key: string;
  groupId: string;
  groupLabel: string;
  label: string;
};

export type FilterBarProps = {
  title?: string;
  groups: readonly FilterGroup[];
  value: FilterValue;
  onChange: (nextValue: FilterValue) => void;
  onApply?: (value: FilterValue) => void;
  onClearAll?: () => void;
  className?: string;
  sortLabel?: string;
  sortOptions?: readonly SortOption[];
  sortValue?: string;
  onSortChange?: (nextSortValue: string) => void;
};
