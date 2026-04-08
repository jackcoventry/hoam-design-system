import type {
  ActiveChip,
  CheckboxGroup,
  FilterGroup,
  FilterOption,
  FilterRangeValue,
  FilterValue,
  RadioGroup,
  RangeGroup,
  StackAt,
} from './FilterBar.types';

export function isRangeGroup(group: FilterGroup): group is RangeGroup {
  return group.kind === 'range';
}

export function isRadioGroup(group: FilterGroup): group is RadioGroup {
  return group.kind === 'radio';
}

export function isOptionGroup(group: FilterGroup): group is CheckboxGroup | RadioGroup {
  return group.kind === 'checkbox' || group.kind === 'radio';
}

export function isSearchableGroup(group: FilterGroup): group is CheckboxGroup | RadioGroup {
  return isOptionGroup(group) && Boolean(group.searchable);
}

export function getOptionSelections(value: FilterValue, groupId: string): readonly string[] {
  return value.options[groupId] ?? [];
}

export function isOptionSelected(value: FilterValue, groupId: string, optionId: string): boolean {
  return getOptionSelections(value, groupId).includes(optionId);
}

export function getRangeValue(value: FilterValue, groupId: string): FilterRangeValue | undefined {
  return value.ranges[groupId];
}

export function setRangeValue(
  value: FilterValue,
  groupId: string,
  nextRange: FilterRangeValue
): FilterValue {
  return {
    ...value,
    ranges: {
      ...value.ranges,
      [groupId]: nextRange,
    },
  };
}

export function toggleOptionSelection(
  value: FilterValue,
  group: CheckboxGroup | RadioGroup,
  optionId: string
): FilterValue {
  const current = getOptionSelections(value, group.id);
  const isSelected = current.includes(optionId);

  if (group.kind === 'radio') {
    return {
      ...value,
      options: {
        ...value.options,
        [group.id]: isSelected ? [] : [optionId],
      },
    };
  }

  return {
    ...value,
    options: {
      ...value.options,
      [group.id]: isSelected ? current.filter((id) => id !== optionId) : [...current, optionId],
    },
  };
}

export function clearGroup(value: FilterValue, group: FilterGroup): FilterValue {
  if (isRangeGroup(group)) {
    return setRangeValue(value, group.id, {});
  }

  return {
    ...value,
    options: {
      ...value.options,
      [group.id]: [],
    },
  };
}

export function clamp(input: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, input));
}

export function getSelectedCount(group: FilterGroup, value: FilterValue): number {
  if (isRangeGroup(group)) {
    const range = getRangeValue(value, group.id);
    return range?.min != null || range?.max != null ? 1 : 0;
  }

  return getOptionSelections(value, group.id).length;
}

export function formatRangeChip(group: RangeGroup, range: FilterRangeValue): string {
  const hasMin = typeof range.min === 'number';
  const hasMax = typeof range.max === 'number';

  if (hasMin && hasMax) {
    return `£${range.min}–£${range.max}`;
  }

  if (hasMin) {
    return `From £${range.min}`;
  }

  if (hasMax) {
    return `Up to £${range.max}`;
  }

  return group.label;
}

export function buildChips(groups: readonly FilterGroup[], value: FilterValue): ActiveChip[] {
  const chips: ActiveChip[] = [];

  for (const group of groups) {
    if (isRangeGroup(group)) {
      const range = getRangeValue(value, group.id);

      if (range && (range.min != null || range.max != null)) {
        chips.push({
          key: `${group.id}-range`,
          groupId: group.id,
          groupLabel: group.label,
          label: formatRangeChip(group, range),
        });
      }

      continue;
    }

    const selectedIds = getOptionSelections(value, group.id);

    for (const optionId of selectedIds) {
      const option = group.options.find((item) => item.id === optionId);

      if (option) {
        chips.push({
          key: `${group.id}-${option.id}`,
          groupId: group.id,
          groupLabel: group.label,
          label: option.label,
        });
      }
    }
  }

  return chips;
}

export function matchesSearch(option: FilterOption, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return option.label.toLowerCase().includes(normalizedQuery);
}

export function getVisibleOptions(
  options: readonly FilterOption[],
  query: string
): readonly FilterOption[] {
  return options.filter((option) => matchesSearch(option, query));
}

export function getBreakpointPx(stackAt: StackAt): number {
  switch (stackAt) {
    case 'sm':
      return 640;
    case 'lg':
      return 1024;
    case 'md':
    default:
      return 832;
  }
}
