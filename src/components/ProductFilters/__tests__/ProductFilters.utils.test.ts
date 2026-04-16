import { describe, expect, it } from 'vitest';

import type {
  CheckboxGroup,
  FilterGroup,
  FilterOption,
  FilterValue,
  RadioGroup,
  RangeGroup,
} from '@/components/ProductFilters/ProductFilters.types';
import {
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

describe('ProductFilters.utils', () => {
  const checkboxGroup: CheckboxGroup = {
    id: 'colour',
    label: 'Colour',
    kind: 'checkbox',
    options: [
      { id: 'red', label: 'Red' },
      { id: 'blue', label: 'Blue' },
    ],
  };

  const searchableCheckboxGroup: CheckboxGroup = {
    ...checkboxGroup,
    searchable: true,
    searchPlaceholder: 'Search colours',
  };

  const radioGroup: RadioGroup = {
    id: 'size',
    label: 'Size',
    kind: 'radio',
    options: [
      { id: 's', label: 'Small' },
      { id: 'm', label: 'Medium' },
    ],
  };

  const rangeGroup: RangeGroup = {
    id: 'price',
    label: 'Price',
    kind: 'range',
    min: 0,
    max: 500,
    step: 10,
  };

  const groups: readonly FilterGroup[] = [checkboxGroup, radioGroup, rangeGroup];

  const value: FilterValue = {
    options: {
      colour: ['red'],
      size: ['m'],
    },
    ranges: {
      price: { min: 50, max: 200 },
    },
  };

  describe('type guards', () => {
    it('identifies range groups', () => {
      expect(isRangeGroup(rangeGroup)).toBe(true);
      expect(isRangeGroup(checkboxGroup)).toBe(false);
      expect(isRangeGroup(radioGroup)).toBe(false);
    });

    it('identifies radio groups', () => {
      expect(isRadioGroup(radioGroup)).toBe(true);
      expect(isRadioGroup(checkboxGroup)).toBe(false);
      expect(isRadioGroup(rangeGroup)).toBe(false);
    });

    it('identifies option groups', () => {
      expect(isOptionGroup(checkboxGroup)).toBe(true);
      expect(isOptionGroup(radioGroup)).toBe(true);
      expect(isOptionGroup(rangeGroup)).toBe(false);
    });

    it('identifies searchable option groups only when searchable is truthy', () => {
      expect(isSearchableGroup(searchableCheckboxGroup)).toBe(true);
      expect(isSearchableGroup(checkboxGroup)).toBe(false);
      expect(isSearchableGroup(radioGroup)).toBe(false);
      expect(isSearchableGroup(rangeGroup)).toBe(false);
    });
  });

  describe('selection helpers', () => {
    it('returns option selections for a group', () => {
      expect(getOptionSelections(value, 'colour')).toEqual(['red']);
      expect(getOptionSelections(value, 'size')).toEqual(['m']);
    });

    it('returns an empty array when no option selections exist for a group', () => {
      expect(getOptionSelections(value, 'brand')).toEqual([]);
    });

    it('checks whether an option is selected', () => {
      expect(isOptionSelected(value, 'colour', 'red')).toBe(true);
      expect(isOptionSelected(value, 'colour', 'blue')).toBe(false);
      expect(isOptionSelected(value, 'missing', 'red')).toBe(false);
    });

    it('returns the range value for a group', () => {
      expect(getRangeValue(value, 'price')).toEqual({ min: 50, max: 200 });
    });

    it('returns undefined when no range value exists for a group', () => {
      expect(getRangeValue(value, 'weight')).toBeUndefined();
    });

    it('sets a range value immutably', () => {
      const next = setRangeValue(value, 'price', { min: 100, max: 300 });

      expect(next).toEqual({
        options: {
          colour: ['red'],
          size: ['m'],
        },
        ranges: {
          price: { min: 100, max: 300 },
        },
      });

      expect(next).not.toBe(value);
      expect(next.ranges).not.toBe(value.ranges);
      expect(value.ranges.price).toEqual({ min: 50, max: 200 });
    });
  });

  describe('toggleOptionSelection', () => {
    it('adds a checkbox option when it is not already selected', () => {
      const next = toggleOptionSelection(
        {
          options: { colour: ['red'] },
          ranges: {},
        },
        checkboxGroup,
        'blue'
      );

      expect(next.options.colour).toEqual(['red', 'blue']);
    });

    it('removes a checkbox option when it is already selected', () => {
      const next = toggleOptionSelection(
        {
          options: { colour: ['red', 'blue'] },
          ranges: {},
        },
        checkboxGroup,
        'red'
      );

      expect(next.options.colour).toEqual(['blue']);
    });

    it('selects a radio option when it is not already selected', () => {
      const next = toggleOptionSelection(
        {
          options: { size: ['s'] },
          ranges: {},
        },
        radioGroup,
        'm'
      );

      expect(next.options.size).toEqual(['m']);
    });

    it('clears a radio option when it is already selected', () => {
      const next = toggleOptionSelection(
        {
          options: { size: ['m'] },
          ranges: {},
        },
        radioGroup,
        'm'
      );

      expect(next.options.size).toEqual([]);
    });

    it('creates a new checkbox selection array when the group has no current value', () => {
      const next = toggleOptionSelection(
        {
          options: {},
          ranges: {},
        },
        checkboxGroup,
        'red'
      );

      expect(next.options.colour).toEqual(['red']);
    });

    it('creates a new radio selection array when the group has no current value', () => {
      const next = toggleOptionSelection(
        {
          options: {},
          ranges: {},
        },
        radioGroup,
        's'
      );

      expect(next.options.size).toEqual(['s']);
    });
  });

  describe('clearGroup', () => {
    it('clears a range group by setting it to an empty object', () => {
      const next = clearGroup(value, rangeGroup);

      expect(next.ranges.price).toEqual({});
      expect(next.options).toEqual(value.options);
    });

    it('clears an option group by setting it to an empty array', () => {
      const next = clearGroup(value, checkboxGroup);

      expect(next.options.colour).toEqual([]);
      expect(next.ranges).toEqual(value.ranges);
    });

    it('clears a radio group by setting it to an empty array', () => {
      const next = clearGroup(value, radioGroup);

      expect(next.options.size).toEqual([]);
    });
  });

  describe('clamp', () => {
    it('returns the input when it is within bounds', () => {
      expect(clamp(5, 1, 10)).toBe(5);
    });

    it('clamps values below the minimum', () => {
      expect(clamp(-1, 1, 10)).toBe(1);
    });

    it('clamps values above the maximum', () => {
      expect(clamp(999, 1, 10)).toBe(10);
    });
  });

  describe('getSelectedCount', () => {
    it('counts selected options for option groups', () => {
      expect(getSelectedCount(checkboxGroup, value)).toBe(1);
      expect(getSelectedCount(radioGroup, value)).toBe(1);
    });

    it('returns zero for option groups with no selections', () => {
      expect(
        getSelectedCount(checkboxGroup, {
          options: {},
          ranges: {},
        })
      ).toBe(0);
    });

    it('returns 1 for a range group when min exists', () => {
      expect(
        getSelectedCount(rangeGroup, {
          options: {},
          ranges: {
            price: { min: 10 },
          },
        })
      ).toBe(1);
    });

    it('returns 1 for a range group when max exists', () => {
      expect(
        getSelectedCount(rangeGroup, {
          options: {},
          ranges: {
            price: { max: 100 },
          },
        })
      ).toBe(1);
    });

    it('returns 1 for a range group when both min and max exist', () => {
      expect(getSelectedCount(rangeGroup, value)).toBe(1);
    });

    it('returns 0 for a range group when neither min nor max exists', () => {
      expect(
        getSelectedCount(rangeGroup, {
          options: {},
          ranges: {
            price: {},
          },
        })
      ).toBe(0);
    });

    it('returns 0 for a range group when the range is missing', () => {
      expect(
        getSelectedCount(rangeGroup, {
          options: {},
          ranges: {},
        })
      ).toBe(0);
    });
  });

  describe('formatRangeChip', () => {
    it('formats a chip when both min and max exist', () => {
      expect(formatRangeChip(rangeGroup, { min: 50, max: 200 })).toBe('£50–£200');
    });

    it('formats a chip when only min exists', () => {
      expect(formatRangeChip(rangeGroup, { min: 50 })).toBe('From £50');
    });

    it('formats a chip when only max exists', () => {
      expect(formatRangeChip(rangeGroup, { max: 200 })).toBe('Up to £200');
    });

    it('falls back to the group label when neither min nor max exists', () => {
      expect(formatRangeChip(rangeGroup, {})).toBe('Price');
    });
  });

  describe('buildChips', () => {
    it('builds chips for selected checkbox, radio, and range filters', () => {
      expect(buildChips(groups, value)).toEqual([
        {
          key: 'colour-red',
          groupId: 'colour',
          groupLabel: 'Colour',
          label: 'Red',
        },
        {
          key: 'size-m',
          groupId: 'size',
          groupLabel: 'Size',
          label: 'Medium',
        },
        {
          key: 'price-range',
          groupId: 'price',
          groupLabel: 'Price',
          label: '£50–£200',
        },
      ]);
    });

    it('skips option ids that do not exist in the group options', () => {
      const nextValue: FilterValue = {
        options: {
          colour: ['missing'],
        },
        ranges: {},
      };

      expect(buildChips([checkboxGroup], nextValue)).toEqual([]);
    });

    it('skips range chips when neither min nor max is present', () => {
      const nextValue: FilterValue = {
        options: {},
        ranges: {
          price: {},
        },
      };

      expect(buildChips([rangeGroup], nextValue)).toEqual([]);
    });

    it('builds a range chip when only min is present', () => {
      const nextValue: FilterValue = {
        options: {},
        ranges: {
          price: { min: 100 },
        },
      };

      expect(buildChips([rangeGroup], nextValue)).toEqual([
        {
          key: 'price-range',
          groupId: 'price',
          groupLabel: 'Price',
          label: 'From £100',
        },
      ]);
    });

    it('builds a range chip when only max is present', () => {
      const nextValue: FilterValue = {
        options: {},
        ranges: {
          price: { max: 250 },
        },
      };

      expect(buildChips([rangeGroup], nextValue)).toEqual([
        {
          key: 'price-range',
          groupId: 'price',
          groupLabel: 'Price',
          label: 'Up to £250',
        },
      ]);
    });

    it('returns an empty array when nothing is selected', () => {
      expect(
        buildChips(groups, {
          options: {},
          ranges: {},
        })
      ).toEqual([]);
    });
  });

  describe('search helpers', () => {
    const options: readonly FilterOption[] = [
      { id: 'red', label: 'Red' },
      { id: 'blue', label: 'Blue' },
      { id: 'green', label: 'Dark Green' },
    ];

    const redOption = options[0];
    const greenOption = options[2];

    if (!redOption || !greenOption) {
      throw new Error('Expected test options to exist');
    }

    it('matches all options when the query is empty', () => {
      expect(matchesSearch(redOption, '')).toBe(true);
      expect(matchesSearch(redOption, '   ')).toBe(true);
    });

    it('matches case-insensitively', () => {
      expect(matchesSearch(greenOption, 'green')).toBe(true);
      expect(matchesSearch(greenOption, 'GREEN')).toBe(true);
      expect(matchesSearch(greenOption, 'dark')).toBe(true);
    });

    it('returns false when the option label does not include the query', () => {
      expect(matchesSearch(redOption, 'green')).toBe(false);
    });

    it('filters visible options based on the query', () => {
      expect(getVisibleOptions(options, 'green')).toEqual([{ id: 'green', label: 'Dark Green' }]);
    });

    it('returns all options when the query is empty', () => {
      expect(getVisibleOptions(options, '')).toEqual(options);
    });

    it('returns an empty array when nothing matches', () => {
      expect(getVisibleOptions(options, 'purple')).toEqual([]);
    });
  });
});
