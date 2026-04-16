import { describe, expect, it } from 'vitest';

import { clamp } from '@/utils/clamp';

describe('clamp', () => {
  it('returns the number when it is within the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps to the minimum when the number is below the range', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps to the maximum when the number is above the range', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('returns the minimum when n equals min', () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it('returns the maximum when n equals max', () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });

  describe('non-finite min', () => {
    it('ignores min when it is Infinity', () => {
      expect(clamp(5, Infinity, 10)).toBe(5);
      expect(clamp(20, Infinity, 10)).toBe(10);
    });

    it('ignores min when it is -Infinity', () => {
      expect(clamp(5, -Infinity, 10)).toBe(5);
    });

    it('ignores min when it is NaN', () => {
      expect(clamp(5, Number.NaN, 10)).toBe(5);
      expect(clamp(20, Number.NaN, 10)).toBe(10);
    });
  });

  describe('non-finite max', () => {
    it('ignores max when it is Infinity', () => {
      expect(clamp(5, 0, Infinity)).toBe(5);
      expect(clamp(-10, 0, Infinity)).toBe(0);
    });

    it('ignores max when it is -Infinity', () => {
      expect(clamp(5, 0, -Infinity)).toBe(5);
    });

    it('ignores max when it is NaN', () => {
      expect(clamp(5, 0, Number.NaN)).toBe(5);
      expect(clamp(-10, 0, Number.NaN)).toBe(0);
    });
  });

  it('returns the original value when both min and max are non-finite', () => {
    expect(clamp(5, Number.NaN, Number.NaN)).toBe(5);
    expect(clamp(5, Infinity, -Infinity)).toBe(5);
  });

  it('handles negative ranges correctly', () => {
    expect(clamp(-5, -10, -1)).toBe(-5);
    expect(clamp(-20, -10, -1)).toBe(-10);
    expect(clamp(0, -10, -1)).toBe(-1);
  });

  it('handles reversed ranges (min > max) predictably', () => {
    // current behaviour: applies min first, then max
    expect(clamp(5, 10, 0)).toBe(0);
  });

  it('returns NaN when n is NaN', () => {
    expect(clamp(Number.NaN, 0, 10)).toBeNaN();
  });
});
