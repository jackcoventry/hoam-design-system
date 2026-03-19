import { describe, expect, it } from 'vitest';

import { formatISODate, formatReadableDate, parseLooseDate } from '../convertDates';

describe('parseLooseDate', () => {
  it('returns a Date for a valid ISO-like string', () => {
    const result = parseLooseDate('2025-03-12');

    if (!result) {
      throw TypeError('Date invalid');
    }

    expect(result).not.toBeNull();
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(2); // March (0-based)
    expect(result.getDate()).toBe(12);
  });

  it('returns a Date for a natural language string', () => {
    const result = parseLooseDate('12 March 2025');

    if (!result) {
      throw TypeError('Date invalid');
    }

    expect(result).not.toBeNull();
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(2);
    expect(result.getDate()).toBe(12);
  });

  it('trims whitespace and still parses', () => {
    const result = parseLooseDate('   March 12, 2025   ');

    if (!result) {
      throw TypeError('Date invalid');
    }

    expect(result).not.toBeNull();
    expect(result.getFullYear()).toBe(2025);
  });

  it('returns null for an invalid date string', () => {
    const result = parseLooseDate('not a date at all');
    expect(result).toBeNull();
  });
});

describe('formatReadableDate', () => {
  it("formats a date as 'dd MMMM yyyy' in en-GB", () => {
    const date = new Date(2025, 2, 12); // 12 March 2025 (months 0-based)
    const formatted = formatReadableDate(date);

    expect(formatted).toBe('12 March 2025');
  });
});

describe('formatISO', () => {
  it("formats a date as 'YYYY-MM-DD'", () => {
    const date = new Date(Date.UTC(2025, 2, 12)); // 12 March 2025
    const formatted = formatISODate(date);

    expect(formatted).toBe('2025-03-12');
  });
});

describe('integration: loose string → readable + ISO', () => {
  it('converts a loose string into both formats correctly', () => {
    const input = '12 March 2025';
    const parsed = parseLooseDate(input);

    expect(parsed).not.toBeNull();
    if (!parsed) return;

    const human = formatReadableDate(parsed);
    const iso = formatISODate(parsed);

    expect(human).toBe('12 March 2025');
    expect(iso).toBe('2025-03-12');
  });
});
