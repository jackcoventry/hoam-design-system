import { get, resolveReferences } from '@/utils/get';

describe('get', () => {
  const data = {
    user: {
      profile: {
        name: 'Jamie',
        age: 30,
      },
      active: true,
      score: 0,
      empty: null,
    },
    items: [{ id: 1 }, { id: 2 }],
  };

  it('returns a nested value for a valid dot path', () => {
    expect(get<string>(data, 'user.profile.name')).toBe('Jamie');
  });

  it('returns undefined for a missing path', () => {
    expect(get(data, 'user.profile.email')).toBeUndefined();
  });

  it('returns the default value for a missing path', () => {
    expect(get(data, 'user.profile.email', 'unknown')).toBe('unknown');
  });

  it('returns the default value when traversal breaks before the end of the path', () => {
    expect(get(data, 'user.profile.name.first', 'fallback')).toBe('fallback');
  });

  it('returns undefined when obj is not an object', () => {
    expect(get('hello', 'user.profile.name')).toBeUndefined();
  });

  it('returns the value even when it is falsey like 0', () => {
    expect(get<number>(data, 'user.score')).toBe(0);
  });

  it('returns the default value when the resolved value is null', () => {
    expect(get(data, 'user.empty', 'fallback')).toBe('fallback');
  });

  it('can access array indices via dot notation', () => {
    expect(get<number>(data, 'items.1.id')).toBe(2);
  });

  it('returns undefined for an empty path that does not exist as a key', () => {
    expect(get(data, '')).toBeUndefined();
  });
});

describe('resolveReferences', () => {
  it('returns primitive values unchanged', () => {
    expect(resolveReferences('hello')).toBe('hello');
    expect(resolveReferences(42)).toBe(42);
    expect(resolveReferences(true)).toBe(true);
    expect(resolveReferences(null)).toBe(null);
  });

  it('resolves a simple top-level reference', () => {
    const input = {
      name: 'Jamie',
      label: '{name}',
    };

    expect(resolveReferences(input)).toEqual({
      name: 'Jamie',
      label: 'Jamie',
    });
  });

  it('resolves nested references', () => {
    const input = {
      user: {
        profile: {
          name: 'Jamie',
        },
      },
      greeting: '{user.profile.name}',
    };

    expect(resolveReferences(input)).toEqual({
      user: {
        profile: {
          name: 'Jamie',
        },
      },
      greeting: 'Jamie',
    });
  });

  it('resolves references inside arrays', () => {
    const input = {
      title: 'Coffee',
      items: ['{title}', '{title} beans'],
    };

    expect(resolveReferences(input)).toEqual({
      title: 'Coffee',
      items: ['Coffee', '{title} beans'],
    });
  });

  it('resolves references to objects', () => {
    const input = {
      palette: {
        primary: '#000',
        secondary: '#fff',
      },
      theme: '{palette}',
    };

    expect(resolveReferences(input)).toEqual({
      palette: {
        primary: '#000',
        secondary: '#fff',
      },
      theme: {
        primary: '#000',
        secondary: '#fff',
      },
    });
  });

  it('resolves nested references recursively', () => {
    const input = {
      colors: {
        base: '#111111',
        primary: '{colors.base}',
      },
      button: {
        background: '{colors.primary}',
      },
    };

    expect(resolveReferences(input)).toEqual({
      colors: {
        base: '#111111',
        primary: '#111111',
      },
      button: {
        background: '#111111',
      },
    });
  });

  it('leaves non-reference strings unchanged', () => {
    const input = {
      title: 'Hello',
      text: 'Value is {title}',
    };

    expect(resolveReferences(input)).toEqual({
      title: 'Hello',
      text: 'Value is {title}',
    });
  });

  it('returns undefined for missing references', () => {
    const input = {
      title: '{missing.path}',
    };

    expect(resolveReferences(input)).toEqual({
      title: undefined,
    });
  });

  it('uses the original root object when resolving deeply nested values', () => {
    const input = {
      tokens: {
        spacing: {
          sm: '8px',
        },
      },
      component: {
        gap: '{tokens.spacing.sm}',
      },
    };

    expect(resolveReferences(input)).toEqual({
      tokens: {
        spacing: {
          sm: '8px',
        },
      },
      component: {
        gap: '8px',
      },
    });
  });
});
