import { convertNumberToCurrency } from '@/utils/convertNumberToCurrency';

describe('convertNumberToCurrency', () => {
  it('formats a positive number as GBP currency by default', () => {
    const result = convertNumberToCurrency({ value: 12.5 });

    expect(result).toBe('£12.50');
  });

  it('formats a larger number correctly', () => {
    const result = convertNumberToCurrency({ value: 1234.56 });

    expect(result).toBe('£1,234.56');
  });

  it('returns undefined when value is 0', () => {
    const result = convertNumberToCurrency({ value: 0 });

    expect(result).toBeUndefined();
  });

  it('returns undefined when value is negative', () => {
    const result = convertNumberToCurrency({ value: -10 });

    expect(result).toBeUndefined();
  });

  it('uses a custom currency when provided', () => {
    const result = convertNumberToCurrency({
      value: 10,
      currency: 'USD',
    });

    // Locale is en-GB, so USD will still format like this:
    expect(result).toBe('US$10.00');
  });

  it('handles decimal precision correctly', () => {
    const result = convertNumberToCurrency({ value: 1 });

    expect(result).toBe('£1.00');
  });

  it('handles high precision input by rounding correctly', () => {
    const result = convertNumberToCurrency({ value: 1.999 });

    expect(result).toBe('£2.00');
  });
});
