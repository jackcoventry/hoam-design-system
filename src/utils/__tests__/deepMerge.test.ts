import { describe, expect, it } from 'vitest';

import { deepMerge } from '@/utils/deepMerge';

describe('deepMerge', () => {
  it('returns the base object when override is not provided', () => {
    const base = {
      title: 'Base',
      count: 1,
    };

    const result = deepMerge(base);

    expect(result).toBe(base);
  });

  it('returns the base object when override is undefined', () => {
    const base = {
      title: 'Base',
      count: 1,
    };

    const result = deepMerge(base, undefined);

    expect(result).toBe(base);
  });

  it('overrides shallow primitive values', () => {
    const base = {
      title: 'Base',
      count: 1,
      active: false,
    };

    const result = deepMerge(base, {
      title: 'Updated',
      count: 2,
      active: true,
    });

    expect(result).toEqual({
      title: 'Updated',
      count: 2,
      active: true,
    });
  });

  it('merges nested plain objects recursively', () => {
    const base = {
      title: 'Base',
      options: {
        theme: 'light',
        compact: false,
      },
    };

    const result = deepMerge(base, {
      options: {
        compact: true,
      },
    });

    expect(result).toEqual({
      title: 'Base',
      options: {
        theme: 'light',
        compact: true,
      },
    });
  });

  it('merges multiple nested levels recursively', () => {
    const base = {
      settings: {
        layout: {
          width: 'wide',
          sidebar: {
            open: true,
            position: 'left',
          },
        },
      },
    };

    const result = deepMerge(base, {
      settings: {
        layout: {
          sidebar: {
            open: false,
          },
        },
      },
    });

    expect(result).toEqual({
      settings: {
        layout: {
          width: 'wide',
          sidebar: {
            open: false,
            position: 'left',
          },
        },
      },
    });
  });

  it('does not overwrite values with undefined in the override', () => {
    const base = {
      title: 'Base',
      count: 1,
      options: {
        compact: false,
      },
    };

    const override = {
      title: undefined,
      options: {
        compact: undefined,
      },
    } as unknown as Parameters<typeof deepMerge<typeof base>>[1];

    const result = deepMerge(base, override);

    expect(result).toEqual({
      title: 'Base',
      count: 1,
      options: {
        compact: false,
      },
    });
  });

  it('replaces arrays instead of merging them', () => {
    const base = {
      items: ['a', 'b', 'c'],
    };

    const result = deepMerge(base, {
      items: ['x'],
    });

    expect(result).toEqual({
      items: ['x'],
    });
  });

  it('replaces nested arrays instead of merging them', () => {
    const base = {
      config: {
        items: [1, 2, 3],
      },
    };

    const result = deepMerge(base, {
      config: {
        items: [9, 8],
      },
    });

    expect(result).toEqual({
      config: {
        items: [9, 8],
      },
    });
  });

  it('replaces plain object values with non-object override values', () => {
    const base = {
      config: {
        theme: 'light',
      },
    };

    const result = deepMerge(base, {
      config: 'disabled' as never,
    });

    expect(result).toEqual({
      config: 'disabled',
    });
  });

  it('replaces non-object base values with object override values', () => {
    const base = {
      config: 'disabled',
    };

    const result = deepMerge(base, {
      config: {
        theme: 'light',
      } as never,
    });

    expect(result).toEqual({
      config: {
        theme: 'light',
      },
    });
  });

  it('preserves function values from the override', () => {
    const baseHandler = () => 'base';
    const overrideHandler = () => 'override';

    const base = {
      onClick: baseHandler,
    };

    const result = deepMerge(base, {
      onClick: overrideHandler,
    });

    expect(result.onClick).toBe(overrideHandler);
    expect(result.onClick()).toBe('override');
  });

  it('preserves untouched base values when only one nested field changes', () => {
    const base = {
      name: 'Base',
      options: {
        a: 1,
        b: 2,
        c: 3,
      },
    };

    const result = deepMerge(base, {
      options: {
        b: 20,
      },
    });

    expect(result).toEqual({
      name: 'Base',
      options: {
        a: 1,
        b: 20,
        c: 3,
      },
    });
  });

  it('returns a new top-level object when override is provided', () => {
    const base = {
      title: 'Base',
      options: {
        compact: false,
      },
    };

    const result = deepMerge(base, {
      title: 'Updated',
    });

    expect(result).not.toBe(base);
    expect(result).toEqual({
      title: 'Updated',
      options: {
        compact: false,
      },
    });
  });

  it('does not mutate the original base object', () => {
    const base = {
      title: 'Base',
      options: {
        compact: false,
      },
    };

    const result = deepMerge(base, {
      options: {
        compact: true,
      },
    });

    expect(base).toEqual({
      title: 'Base',
      options: {
        compact: false,
      },
    });

    expect(result).toEqual({
      title: 'Base',
      options: {
        compact: true,
      },
    });
  });

  it('handles null values in the base correctly', () => {
    const base = {
      value: null,
    };

    const result = deepMerge(base, {
      value: 'updated' as never,
    });

    expect(result).toEqual({
      value: 'updated',
    });
  });

  it('handles null values in the override correctly', () => {
    const base = {
      value: 'base',
      nested: {
        label: 'hello',
      },
    };

    const result = deepMerge(base, {
      value: null as never,
      nested: null as never,
    });

    expect(result).toEqual({
      value: null,
      nested: null,
    });
  });

  it('merges empty nested override objects without changing base values', () => {
    const base = {
      settings: {
        theme: 'light',
        density: 'comfortable',
      },
    };

    const result = deepMerge(base, {
      settings: {},
    });

    expect(result).toEqual({
      settings: {
        theme: 'light',
        density: 'comfortable',
      },
    });
  });
});
