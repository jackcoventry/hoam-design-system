import { vi } from 'vitest';

vi.mock('@/styles/variables.json', () => ({
  default: [
    { name: 'color-primary', value: '#ff0000' },
    { name: 'spacing-sm', value: '8px' },
    { name: 'duplicate', value: 'first' },
    { name: 'duplicate', value: 'second' },
  ],
}));

import getTokenByName from '@/utils/getTokenByName';

describe('getTokenByName', () => {
  it('returns the token value when the token exists', () => {
    expect(getTokenByName('color-primary')).toBe('#ff0000');
  });

  it('returns undefined when the token does not exist', () => {
    expect(getTokenByName('non-existent-token')).toBeUndefined();
  });

  it('returns undefined when no token name is provided', () => {
    expect(getTokenByName()).toBeUndefined();
  });

  it('matches tokens by exact name (case-sensitive)', () => {
    expect(getTokenByName('Color-Primary')).toBeUndefined();
  });

  it('returns the first match when duplicate token names exist', () => {
    expect(getTokenByName('duplicate')).toBe('first');
  });
});
