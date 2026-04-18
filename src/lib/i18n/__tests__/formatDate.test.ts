import { describe, expect, it } from 'vitest';

import { formatDateValue } from '@/lib/i18n/formatting/formatDate';

describe('formatDateValue', () => {
  describe('valid inputs', () => {
    it('formats a date string (default medium style)', () => {
      const result = formatDateValue('2026-04-18', 'en-GB');

      expect(result).toContain('18');
      expect(result).toMatch(/Apr|April/);
      expect(result).toContain('2026');
    });

    it('formats a Date instance', () => {
      const date = new Date('2026-04-18T00:00:00Z');
      const result = formatDateValue(date, 'en-GB');

      expect(result).toContain('18');
      expect(result).toMatch(/Apr|April/);
      expect(result).toContain('2026');
    });

    it('formats a timestamp number', () => {
      const timestamp = new Date('2026-04-18T00:00:00Z').getTime();
      const result = formatDateValue(timestamp, 'en-GB');

      expect(result).toContain('18');
      expect(result).toMatch(/Apr|April/);
      expect(result).toContain('2026');
    });
  });

  describe('options', () => {
    it('uses long dateStyle when provided', () => {
      const result = formatDateValue('2026-04-18', 'en-GB', {
        dateStyle: 'long',
      });

      expect(result).toBe('18 April 2026');
    });

    it('includes time when timeStyle is provided', () => {
      const result = formatDateValue('2026-04-18T19:30:00Z', 'en-GB', {
        dateStyle: 'long',
        timeStyle: 'short',
      });

      expect(result).toContain('18 April 2026');
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('defaults to medium dateStyle when none provided', () => {
      const result = formatDateValue('2026-04-18', 'en-GB');

      expect(result).toMatch(/Apr/);
    });
  });

  describe('locale differences', () => {
    it('formats differently for en-US', () => {
      const result = formatDateValue('2026-04-18', 'en-US', {
        dateStyle: 'long',
      });

      expect(result).toBe('April 18, 2026');
    });

    it('formats differently for en-GB', () => {
      const result = formatDateValue('2026-04-18', 'en-GB', {
        dateStyle: 'long',
      });

      expect(result).toBe('18 April 2026');
    });
  });

  describe('invalid input', () => {
    it('returns empty string for invalid date string', () => {
      const result = formatDateValue('not-a-date', 'en-GB');

      expect(result).toBe('');
    });

    it('returns empty string for NaN timestamp', () => {
      const result = formatDateValue(Number.NaN, 'en-GB');

      expect(result).toBe('');
    });
  });
});
