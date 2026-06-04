import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  CheckboxGroup,
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

const productFilterChipMessages = {
  minimumValueChip: (value: string) => `${value} and up`,
  maximumValueChip: (value: string) => `Up to ${value}`,
};

const formatCurrencyRangeValueMock =
  vi.fn<(min: number, max: number, locale: string, currency: string) => string>();

const formatCurrencyValueMock =
  vi.fn<(value: number, locale: string, currency: string) => string>();

vi.mock('@/lib/i18n/formatting/currency', () => ({
  formatCurrencyRangeValue: (min: number, max: number, locale: string, currency: string) =>
    formatCurrencyRangeValueMock(min, max, locale, currency),
  formatCurrencyValue: (value: number, locale: string, currency: string) =>
    formatCurrencyValueMock(value, locale, currency),
}));

describe('ProductFilters.utils', () => {
  const checkboxGroup: CheckboxGroup = {
    id: 'roast',
    label: 'Roast',
    kind: 'checkbox',
    options: [
      { id: 'light', label: 'Light Roast' },
      { id: 'dark', label: 'Dark Roast' },
    ],
    searchable: true,
    searchPlaceholder: 'Search roasts',
  };

  const nonSearchableCheckboxGroup: CheckboxGroup = {
    id: 'grinder',
    label: 'Grinder',
    kind: 'checkbox',
    options: [{ id: 'comandante', label: 'Comandante' }],
  };

  const radioGroup: RadioGroup = {
    id: 'grind',
    label: 'Grind',
    kind: 'radio',
    options: [
      { id: 'whole-bean', label: 'Whole Bean' },
      { id: 'espresso-fine', label: 'Espresso Fine' },
    ],
  };

  const rangeGroup: RangeGroup = {
    id: 'price',
    label: 'Price',
    kind: 'range',
    min: 0,
    max: 100,
    step: 5,
  };

  const baseValue: FilterValue = {
    options: {
      roast: ['light'],
      grind: ['espresso-fine'],
    },
    ranges: {
      price: {
        min: 10,
        max: 50,
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    formatCurrencyRangeValueMock.mockImplementation(
      (min, max, locale, currency) => `${currency} ${locale} ${min}-${max}`
    );

    formatCurrencyValueMock.mockImplementation(
      (value, locale, currency) => `${currency} ${locale} ${value}`
    );
  });

  describe('type guards', () => {
    it('identifies range groups', () => {
      expect(isRangeGroup(rangeGroup)).toBe(true);
      expect(isRangeGroup(checkboxGroup)).toBe(false);
      expect(isRangeGroup(radioGroup)).toBe(false);
    });

    it('identifies radio groups', () => {
      expect(isRadioGroup(radioGroup)).toBe(true);
      expect(isRadioGroup(rangeGroup)).toBe(false);
      expect(isRadioGroup(checkboxGroup)).toBe(false);
    });

    it('identifies option groups', () => {
      expect(isOptionGroup(checkboxGroup)).toBe(true);
      expect(isOptionGroup(radioGroup)).toBe(true);
      expect(isOptionGroup(rangeGroup)).toBe(false);
    });

    it('identifies searchable option groups', () => {
      expect(isSearchableGroup(checkboxGroup)).toBe(true);
      expect(isSearchableGroup(nonSearchableCheckboxGroup)).toBe(false);
      expect(isSearchableGroup(radioGroup)).toBe(false);
      expect(isSearchableGroup(rangeGroup)).toBe(false);
    });
  });

  describe('option selection helpers', () => {
    it('returns selected options for a group', () => {
      expect(getOptionSelections(baseValue, 'roast')).toEqual(['light']);
    });

    it('returns an empty array when a group has no option selections', () => {
      expect(getOptionSelections(baseValue, 'missing')).toEqual([]);
    });

    it('returns true when an option is selected', () => {
      expect(isOptionSelected(baseValue, 'roast', 'light')).toBe(true);
    });

    it('returns false when an option is not selected', () => {
      expect(isOptionSelected(baseValue, 'roast', 'dark')).toBe(false);
    });
  });

  describe('range helpers', () => {
    it('returns the current range value for a group', () => {
      expect(getRangeValue(baseValue, 'price')).toEqual({
        min: 10,
        max: 50,
      });
    });

    it('returns undefined when no range value exists for a group', () => {
      expect(getRangeValue(baseValue, 'missing')).toBeUndefined();
    });

    it('sets a range value immutably', () => {
      const result = setRangeValue(baseValue, 'price', { min: 20, max: 80 });

      expect(result).toEqual({
        options: {
          roast: ['light'],
          grind: ['espresso-fine'],
        },
        ranges: {
          price: {
            min: 20,
            max: 80,
          },
        },
      });

      expect(result).not.toBe(baseValue);
      expect(result.ranges).not.toBe(baseValue.ranges);
      expect(result.options).toBe(baseValue.options);
    });
  });

  describe('toggleOptionSelection', () => {
    it('adds an option for checkbox groups when not currently selected', () => {
      const result = toggleOptionSelection(baseValue, checkboxGroup, 'dark');

      expect(result).toEqual({
        options: {
          roast: ['light', 'dark'],
          grind: ['espresso-fine'],
        },
        ranges: {
          price: {
            min: 10,
            max: 50,
          },
        },
      });
    });

    it('removes an option for checkbox groups when currently selected', () => {
      const result = toggleOptionSelection(baseValue, checkboxGroup, 'light');

      expect(result).toEqual({
        options: {
          roast: [],
          grind: ['espresso-fine'],
        },
        ranges: {
          price: {
            min: 10,
            max: 50,
          },
        },
      });
    });

    it('selects a radio option when not currently selected', () => {
      const result = toggleOptionSelection(baseValue, radioGroup, 'whole-bean');

      expect(result).toEqual({
        options: {
          roast: ['light'],
          grind: ['whole-bean'],
        },
        ranges: {
          price: {
            min: 10,
            max: 50,
          },
        },
      });
    });

    it('clears a radio option when it is already selected', () => {
      const result = toggleOptionSelection(baseValue, radioGroup, 'espresso-fine');

      expect(result).toEqual({
        options: {
          roast: ['light'],
          grind: [],
        },
        ranges: {
          price: {
            min: 10,
            max: 50,
          },
        },
      });
    });
  });

  describe('clearGroup', () => {
    it('clears a range group by setting an empty range object', () => {
      const result = clearGroup(baseValue, rangeGroup);

      expect(result).toEqual({
        options: {
          roast: ['light'],
          grind: ['espresso-fine'],
        },
        ranges: {
          price: {},
        },
      });
    });

    it('clears an option group by setting its selections to an empty array', () => {
      const result = clearGroup(baseValue, checkboxGroup);

      expect(result).toEqual({
        options: {
          roast: [],
          grind: ['espresso-fine'],
        },
        ranges: {
          price: {
            min: 10,
            max: 50,
          },
        },
      });
    });
  });

  describe('clamp', () => {
    it('returns the input when it is within range', () => {
      expect(clamp(50, 0, 100)).toBe(50);
    });

    it('clamps values below the minimum', () => {
      expect(clamp(-10, 0, 100)).toBe(0);
    });

    it('clamps values above the maximum', () => {
      expect(clamp(110, 0, 100)).toBe(100);
    });
  });

  describe('getSelectedCount', () => {
    it('returns 1 for range groups with a minimum value', () => {
      const value: FilterValue = {
        options: {},
        ranges: {
          price: { min: 5 },
        },
      };

      expect(getSelectedCount(rangeGroup, value)).toBe(1);
    });

    it('returns 1 for range groups with a maximum value', () => {
      const value: FilterValue = {
        options: {},
        ranges: {
          price: { max: 25 },
        },
      };

      expect(getSelectedCount(rangeGroup, value)).toBe(1);
    });

    it('returns 0 for range groups with no min or max', () => {
      const value: FilterValue = {
        options: {},
        ranges: {
          price: {},
        },
      };

      expect(getSelectedCount(rangeGroup, value)).toBe(0);
    });

    it('returns 0 for range groups with no stolight range value', () => {
      const value: FilterValue = {
        options: {},
        ranges: {},
      };

      expect(getSelectedCount(rangeGroup, value)).toBe(0);
    });

    it('returns the number of selected options for option groups', () => {
      const value: FilterValue = {
        options: {
          roast: ['light', 'dark'],
        },
        ranges: {},
      };

      expect(getSelectedCount(checkboxGroup, value)).toBe(2);
    });
  });

  describe('formatRangeChip', () => {
    it('formats a full min/max currency range', () => {
      const result = formatRangeChip(
        rangeGroup,
        { min: 10, max: 50 },
        'en-GB',
        'GBP',
        productFilterChipMessages
      );

      expect(formatCurrencyRangeValueMock).toHaveBeenCalledWith(10, 50, 'en-GB', 'GBP');
      expect(result).toBe('GBP en-GB 10-50');
    });

    it('formats a minimum-only value', () => {
      const result = formatRangeChip(
        rangeGroup,
        { min: 10 },
        'en-GB',
        'GBP',
        productFilterChipMessages
      );

      expect(formatCurrencyValueMock).toHaveBeenCalledWith(10, 'en-GB', 'GBP');
      expect(result).toBe('GBP en-GB 10 and up');
    });

    it('formats a minimum-only zero value', () => {
      const result = formatRangeChip(
        rangeGroup,
        { min: 0 },
        'en-GB',
        'GBP',
        productFilterChipMessages
      );

      expect(formatCurrencyValueMock).toHaveBeenCalledWith(0, 'en-GB', 'GBP');
      expect(result).toBe('GBP en-GB 0 and up');
    });

    it('formats a maximum-only value', () => {
      const result = formatRangeChip(
        rangeGroup,
        { max: 50 },
        'en-GB',
        'GBP',
        productFilterChipMessages
      );

      expect(formatCurrencyValueMock).toHaveBeenCalledWith(50, 'en-GB', 'GBP');
      expect(result).toBe('Up to GBP en-GB 50');
    });

    it('formats a maximum-only zero value', () => {
      const result = formatRangeChip(
        rangeGroup,
        { max: 0 },
        'en-GB',
        'GBP',
        productFilterChipMessages
      );

      expect(formatCurrencyValueMock).toHaveBeenCalledWith(0, 'en-GB', 'GBP');
      expect(result).toBe('Up to GBP en-GB 0');
    });

    it('falls back to the group label when no min or max exists', () => {
      const result = formatRangeChip(rangeGroup, {}, 'en-GB', 'GBP', productFilterChipMessages);

      expect(result).toBe('Price');
      expect(formatCurrencyRangeValueMock).not.toHaveBeenCalled();
      expect(formatCurrencyValueMock).not.toHaveBeenCalled();
    });
  });

  describe('buildChips', () => {
    it('builds chips for selected range and option values', () => {
      const result = buildChips(
        [rangeGroup, checkboxGroup, radioGroup],
        baseValue,
        'en-GB',
        'GBP',
        productFilterChipMessages
      );

      expect(result).toEqual([
        {
          key: 'price-range',
          groupId: 'price',
          groupLabel: 'Price',
          label: 'GBP en-GB 10-50',
        },
        {
          key: 'roast-light',
          groupId: 'roast',
          groupLabel: 'Roast',
          label: 'Light Roast',
        },
        {
          key: 'grind-espresso-fine',
          groupId: 'grind',
          groupLabel: 'Grind',
          label: 'Espresso Fine',
        },
      ]);
    });

    it('does not build a range chip when the range exists but has no selected bounds', () => {
      const value: FilterValue = {
        options: {},
        ranges: {
          price: {},
        },
      };

      const result = buildChips([rangeGroup], value, 'en-GB', 'GBP', productFilterChipMessages);

      expect(result).toEqual([]);
    });

    it('does not build a range chip when the range is missing', () => {
      const value: FilterValue = {
        options: {},
        ranges: {},
      };

      const result = buildChips([rangeGroup], value, 'en-GB', 'GBP', productFilterChipMessages);

      expect(result).toEqual([]);
    });

    it('skips missing option ids when building chips', () => {
      const value: FilterValue = {
        options: {
          roast: ['light', 'missing'],
        },
        ranges: {},
      };

      const result = buildChips([checkboxGroup], value, 'en-GB', 'GBP', productFilterChipMessages);

      expect(result).toEqual([
        {
          key: 'roast-light',
          groupId: 'roast',
          groupLabel: 'Roast',
          label: 'Light Roast',
        },
      ]);
    });
  });

  describe('search helpers', () => {
    const option: FilterOption = {
      id: 'light',
      label: 'Light Roast',
    };

    it('matches when the query is empty', () => {
      expect(matchesSearch(option, '')).toBe(true);
    });

    it('matches when the query is only whitespace', () => {
      expect(matchesSearch(option, '   ')).toBe(true);
    });

    it('matches case-insensitively', () => {
      expect(matchesSearch(option, 'light')).toBe(true);
      expect(matchesSearch(option, 'LIGHT')).toBe(true);
      expect(matchesSearch(option, 'roast')).toBe(true);
    });

    it('returns false when the query does not match', () => {
      expect(matchesSearch(option, 'dark')).toBe(false);
    });

    it('returns only visible matching options', () => {
      const options: readonly FilterOption[] = [
        { id: 'light', label: 'Light Roast' },
        { id: 'dark', label: 'Dark Roast' },
        { id: 'green', label: 'Green Coffee Beans' },
      ];

      expect(getVisibleOptions(options, 'dark')).toEqual([{ id: 'dark', label: 'Dark Roast' }]);
    });

    it('returns all options when the query is blank', () => {
      const options: readonly FilterOption[] = [
        { id: 'light', label: 'Light Roast' },
        { id: 'dark', label: 'Dark Roast' },
      ];

      expect(getVisibleOptions(options, '   ')).toEqual(options);
    });

    it('returns an empty array when no options match', () => {
      const options: readonly FilterOption[] = [
        { id: 'light', label: 'Light Roast' },
        { id: 'dark', label: 'Dark Roast' },
      ];

      expect(getVisibleOptions(options, 'tea')).toEqual([]);
    });
  });
});
