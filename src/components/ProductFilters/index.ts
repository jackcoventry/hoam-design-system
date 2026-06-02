/** Props and helper types for product filtering controls. */
export type {
  ActiveChip,
  FilterBarProps,
  FilterGroup,
  FilterOption,
  FilterRangeValue,
  FilterValue,
  RangeGroup,
  SortOption,
} from '@/components/ProductFilters/ProductFilters.types';
export type {
  CheckboxGroup as ProductFilterCheckboxGroup,
  RadioGroup as ProductFilterRadioGroup,
} from '@/components/ProductFilters/ProductFilters.types';
/** Product filtering controls and panel primitives. */
export { FilterBarOptionPanel } from '@/components/ProductFilters/FilterBarOptionPanel';
export { FilterBarRangePanel } from '@/components/ProductFilters/FilterBarRangePanel';
export { FilterBar } from '@/components/ProductFilters/ProductFilters';
/** Product filter utility helpers. */
export {
  buildChips,
  clamp,
  clearGroup,
  formatRangeChip,
  getOptionSelections,
  getRangeValue,
  getSelectedCount,
  getVisibleOptions,
  isOptionGroup,
  isOptionSelected,
  isRadioGroup,
  isRangeGroup,
  isSearchableGroup,
  matchesSearch,
  setRangeValue,
  toggleOptionSelection,
} from '@/components/ProductFilters/ProductFilters.utils';
