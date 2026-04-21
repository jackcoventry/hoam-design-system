export type FilterOption = {
  /** Stable identifier for the filter option. */
  id: string;
  /** Visible label shown for the option. */
  label: string;
  /** Optional result count shown alongside the option. */
  count?: number;
  /** Prevents the option from being selected. */
  disabled?: boolean;
};

export type CheckboxGroup = {
  /** Stable identifier for the filter group. */
  id: string;
  /** Visible group label. */
  label: string;
  /** Renders the group as a multi-select checkbox list. */
  kind: 'checkbox';
  /** Available options for the group. */
  options: readonly FilterOption[];
  /** Enables client-side searching within the options. */
  searchable?: boolean;
  /** Placeholder text for the searchable input. */
  searchPlaceholder?: string;
};

export type RadioGroup = {
  /** Stable identifier for the filter group. */
  id: string;
  /** Visible group label. */
  label: string;
  /** Renders the group as a single-select radio list. */
  kind: 'radio';
  /** Available options for the group. */
  options: readonly FilterOption[];
  /** Enables client-side searching within the options. */
  searchable?: boolean;
  /** Placeholder text for the searchable input. */
  searchPlaceholder?: string;
};

export type RangeGroup = {
  /** Stable identifier for the filter group. */
  id: string;
  /** Visible group label. */
  label: string;
  /** Renders the group as a min/max range selector. */
  kind: 'range';
  /** Minimum allowed numeric value. */
  min: number;
  /** Maximum allowed numeric value. */
  max: number;
  /** Increment used by the range controls. */
  step?: number;
  /** Optional override for the minimum field label. */
  minLabel?: string;
  /** Optional override for the maximum field label. */
  maxLabel?: string;
};

export type FilterGroup = CheckboxGroup | RadioGroup | RangeGroup;

export type FilterRangeValue = {
  /** Selected minimum bound. */
  min?: number;
  /** Selected maximum bound. */
  max?: number;
};

export type FilterValue = {
  /** Selected option ids grouped by filter id. */
  options: Record<string, readonly string[] | undefined>;
  /** Selected ranges grouped by filter id. */
  ranges: Record<string, FilterRangeValue | undefined>;
};

export type SortOption = {
  /** Submitted sort value. */
  value: string;
  /** Visible sort label. */
  label: string;
};

export type ActiveChip = {
  key: string;
  groupId: string;
  groupLabel: string;
  label: string;
};

export type FilterBarProps = {
  /** Accessible title for the filter toolbar. */
  title?: string;
  /** Filter groups rendered in the sidebar. */
  groups: readonly FilterGroup[];
  /** Current selected filter state. */
  value: FilterValue;
  /** Called whenever the selected filter state changes. */
  onChange: (nextValue: FilterValue) => void;
  /** Optional apply handler for consumers that batch filter updates. */
  onApply?: (value: FilterValue) => void;
  /** Optional handler for clearing all filters at once. */
  onClearAll?: () => void;
  /** Adds custom class names to the filter bar root. */
  className?: string;
  /** Label for the sort control. */
  sortLabel?: string;
  /** Sort options shown in the sort select. */
  sortOptions?: readonly SortOption[];
  /** Currently selected sort value. */
  sortValue?: string;
  /** Called when the selected sort option changes. */
  onSortChange?: (nextSortValue: string) => void;
};
