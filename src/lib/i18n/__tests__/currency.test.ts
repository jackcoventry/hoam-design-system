import { describe, expect, it } from 'vitest';

import { formatCurrencyRangeValue, formatCurrencyValue } from '@/lib/i18n/formatting/currency';

describe('formatCurrencyValue', () => {
  it('formats a value using the provided locale and currency', () => {
    expect(formatCurrencyValue(1234.56, 'en-GB', 'GBP')).toBe('£1,234.56');
  });

  it('formats a value using zero fraction digits when requested', () => {
    expect(
      formatCurrencyValue(10, 'en-GB', 'GBP', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    ).toBe('£10');
  });

  it('formats USD correctly for en-US', () => {
    expect(
      formatCurrencyValue(25, 'en-US', 'USD', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    ).toBe('$25');
  });
});

describe('formatCurrencyRangeValue', () => {
  it('formats a min and max range', () => {
    expect(
      formatCurrencyRangeValue(10, 100, 'en-GB', 'GBP', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    ).toBe('£10–£100');
  });

  it('formats only a minimum value when max is undefined', () => {
    expect(
      formatCurrencyRangeValue(10, undefined, 'en-GB', 'GBP', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    ).toBe('£10');
  });

  it('formats only a maximum value when min is undefined', () => {
    expect(
      formatCurrencyRangeValue(undefined, 100, 'en-GB', 'GBP', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    ).toBe('£100');
  });

  it('returns an empty string when min and max are both undefined', () => {
    expect(formatCurrencyRangeValue(undefined, undefined, 'en-GB', 'GBP')).toBe('');
  });
});
