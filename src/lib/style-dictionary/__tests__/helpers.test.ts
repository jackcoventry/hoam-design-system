import { describe, expect, it, vi, beforeEach } from 'vitest';

import { resolveReferences } from '@/utils/get';

import {
  PREFIX,
  addBreakpointOutputs,
  applyPrivateScopeFilters,
  buildBaseToken,
  buildBreakpointsCssFile,
  buildBreakpointsTsFile,
  buildFlatToken,
  buildSectionCssFile,
  buildSpacingFile,
  buildTypographyOriginalValues,
  extractFontFamily,
  extractResolvedValue,
  findGroup,
  getBreakpointEntries,
  getBreakpointNode,
  getExtensions,
  getInheritedScope,
  getLeafExtensions,
  getNodeAtPath,
  getRecordValue,
  getSpacingEntries,
  getSpacingNode,
  isBreakpointEntry,
  isPrivateToken,
  isRecord,
  isSpacingEntry,
  normaliseSpacingKey,
} from '@/lib/style-dictionary/helpers';

import type { SDConfig, StyleDictionaryToken, TokenRecord } from '@/lib/style-dictionary/types';

vi.mock('@/utils/get', () => ({
  resolveReferences: vi.fn((value: unknown) => value),
}));

const mockResolveReferences = vi.mocked(resolveReferences);

function createRawTokens(): TokenRecord {
  return {
    typography: {
      heading: {
        $extensions: {
          $group: 'content',
          scope: 'public',
        },
        hero: {
          $extensions: {
            $name: 'Hero Display',
          },
          $value: {
            fontFamily: '{font.family.base}',
            fontSize: '{font.size.900}',
            fontWeight: '{font.weight.bold}',
            lineHeight: '{line.height.tight}',
          },
        },
      },
    },
    font: {
      family: {
        base: {
          $value: ['Inter', 'system-ui', 'sans-serif'],
        },
      },
      size: {
        900: {
          $value: 'clamp(2rem, 4vw, 4rem)',
        },
      },
      weight: {
        bold: {
          $value: 700,
        },
      },
    },
    line: {
      height: {
        tight: {
          $value: 1.1,
        },
      },
    },
    spacing: {
      $type: 'dimension',
      0: {
        $value: '0',
      },
      100: {
        $value: '0.25rem',
      },
      md: {
        $value: '1rem',
      },
    },
    breakpoint: {
      $type: 'dimension',
      $extensions: {
        note: 'meta',
      },
      sm: {
        $value: '40rem',
      },
      md: {
        $value: '48rem',
      },
      lg: {
        $value: '64rem',
      },
    },
    privateGroup: {
      $extensions: {
        scope: 'private',
      },
      token: {
        $value: 'secret',
      },
    },
  };
}

function createTypographyToken(): StyleDictionaryToken {
  return {
    name: 'typography-heading-hero',
    path: ['typography', 'heading', 'hero'],
    $type: 'typography',
    $value: {
      fontFamily: '{font.family.base}',
      fontSize: '{font.size.900}',
      fontWeight: '{font.weight.bold}',
      lineHeight: '{line.height.tight}',
    },
    original: {
      $value: {
        fontFamily: '{font.family.base}',
        fontSize: '{font.size.900}',
        fontWeight: '{font.weight.bold}',
        lineHeight: '{line.height.tight}',
      },
    },
    attributes: {
      group: 'typography',
      set: 'heading',
    },
  } as StyleDictionaryToken;
}

describe('record helpers', () => {
  it('isRecord returns true only for plain objects', () => {
    expect(isRecord({ foo: 'bar' })).toBe(true);
    expect(isRecord(null)).toBe(false);
    expect(isRecord([])).toBe(false);
    expect(isRecord('hello')).toBe(false);
    expect(isRecord(123)).toBe(false);
  });

  it('getRecordValue returns the value for the given key', () => {
    expect(getRecordValue({ alpha: 123 }, 'alpha')).toBe(123);
    expect(getRecordValue({ alpha: 123 }, 'missing')).toBeUndefined();
  });

  it('getNodeAtPath returns the nested record at a valid path', () => {
    const rawTokens = createRawTokens();

    expect(getNodeAtPath(rawTokens, ['typography', 'heading'])).toEqual({
      $extensions: {
        $group: 'content',
        scope: 'public',
      },
      hero: {
        $extensions: {
          $name: 'Hero Display',
        },
        $value: {
          fontFamily: '{font.family.base}',
          fontSize: '{font.size.900}',
          fontWeight: '{font.weight.bold}',
          lineHeight: '{line.height.tight}',
        },
      },
    });
  });

  it('getNodeAtPath returns undefined for an invalid path or non-record leaf', () => {
    const rawTokens = createRawTokens();

    expect(getNodeAtPath(rawTokens, ['typography', 'missing'])).toBeUndefined();
    expect(getNodeAtPath(rawTokens, ['spacing', 'md', '$value'])).toBeUndefined();
  });

  it('getLeafExtensions returns leaf extensions when present', () => {
    const rawTokens = createRawTokens();

    expect(getLeafExtensions(rawTokens, ['typography', 'heading', 'hero'])).toEqual({
      $name: 'Hero Display',
    });
  });

  it('getLeafExtensions returns null when the node has no extensions', () => {
    const rawTokens = createRawTokens();

    expect(getLeafExtensions(rawTokens, ['spacing', 'md'])).toBeNull();
    expect(getLeafExtensions(rawTokens, ['missing'])).toBeNull();
  });

  it('findGroup walks upward through the path and finds the nearest $group', () => {
    const rawTokens = createRawTokens();

    expect(findGroup(rawTokens, ['typography', 'heading', 'hero'])).toBe('content');
  });

  it('findGroup returns null when no $group exists in the ancestry', () => {
    const rawTokens = createRawTokens();

    expect(findGroup(rawTokens, ['spacing', 'md'])).toBeNull();
  });
});

describe('value extraction helpers', () => {
  it('extractResolvedValue returns strings and numbers directly', () => {
    expect(extractResolvedValue('1rem')).toBe('1rem');
    expect(extractResolvedValue(700)).toBe(700);
  });

  it('extractResolvedValue returns nested $value when it is a string or number', () => {
    expect(extractResolvedValue({ $value: '2rem' })).toBe('2rem');
    expect(extractResolvedValue({ $value: 400 })).toBe(400);
  });

  it('extractResolvedValue returns null for unsupported values', () => {
    expect(extractResolvedValue({ $value: ['Inter'] })).toBeNull();
    expect(extractResolvedValue(['Inter'])).toBeNull();
    expect(extractResolvedValue(null)).toBeNull();
  });

  it('extractFontFamily returns strings directly', () => {
    expect(extractFontFamily('Inter, sans-serif')).toBe('Inter, sans-serif');
  });

  it('extractFontFamily joins string arrays', () => {
    expect(extractFontFamily(['Inter', 'system-ui', 'sans-serif'])).toBe(
      'Inter, system-ui, sans-serif'
    );
  });

  it('extractFontFamily ignores non-string array members', () => {
    expect(extractFontFamily(['Inter', 123, 'sans-serif'])).toBe('Inter, sans-serif');
  });

  it('extractFontFamily resolves nested $value strings or arrays', () => {
    expect(extractFontFamily({ $value: 'Inter, sans-serif' })).toBe('Inter, sans-serif');
    expect(extractFontFamily({ $value: ['Inter', 'system-ui'] })).toBe('Inter, system-ui');
  });

  it('extractFontFamily returns null when no valid string values exist', () => {
    expect(extractFontFamily({ $value: [1, 2, 3] })).toBeNull();
    expect(extractFontFamily(123)).toBeNull();
    expect(extractFontFamily(null)).toBeNull();
  });
});

describe('token builders', () => {
  beforeEach(() => {
    mockResolveReferences.mockImplementation((value: unknown) => {
      if (value === '{font.family.base}') {
        return ['Inter', 'system-ui', 'sans-serif'];
      }

      if (value === '{font.size.900}') {
        return 'clamp(2rem, 4vw, 4rem)';
      }

      if (value === '{font.weight.bold}') {
        return 700;
      }

      if (value === '{line.height.tight}') {
        return 1.1;
      }

      return value;
    });
  });

  it('buildBaseToken creates the shared token shape with prefixed names', () => {
    const rawTokens = createRawTokens();
    const token = createTypographyToken();

    expect(buildBaseToken(token, rawTokens)).toEqual({
      name: `${PREFIX}-typography-heading-hero`,
      cssVar: `--${PREFIX}-typography-heading-hero`,
      type: 'typography',
      value: token.$value,
      group: 'typography',
      set: 'heading',
      extensions: {
        $name: 'Hero Display',
        scope: 'public',
      },
    });
  });

  it('buildBaseToken omits extensions when neither leaf nor inherited scope exist', () => {
    const rawTokens = createRawTokens();

    const token = {
      name: 'spacing-md',
      path: ['spacing', 'md'],
      $type: 'dimension',
      $value: '1rem',
      attributes: {
        group: 'spacing',
        set: 'core',
      },
    } as StyleDictionaryToken;

    expect(buildBaseToken(token, rawTokens)).toEqual({
      name: `${PREFIX}-spacing-md`,
      cssVar: `--${PREFIX}-spacing-md`,
      type: 'dimension',
      value: '1rem',
      group: 'spacing',
      set: 'core',
    });
  });

  it('buildTypographyOriginalValues resolves and flattens original typography references', () => {
    const rawTokens = createRawTokens();
    const token = createTypographyToken();

    expect(buildTypographyOriginalValues(token, rawTokens)).toEqual({
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 'clamp(2rem, 4vw, 4rem)',
      fontWeight: 700,
      lineHeight: 1.1,
    });

    expect(mockResolveReferences).toHaveBeenCalledTimes(4);
  });

  it('buildFlatToken returns a typography token with originalValues', () => {
    const rawTokens = createRawTokens();
    const token = createTypographyToken();

    const result = buildFlatToken(token, rawTokens);

    expect(result).toMatchObject({
      name: `${PREFIX}-typography-heading-hero`,
      type: 'typography',
      originalValues: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 'clamp(2rem, 4vw, 4rem)',
        fontWeight: 700,
        lineHeight: 1.1,
      },
    });
  });

  it('buildFlatToken returns the base token unchanged for non-typography tokens', () => {
    const rawTokens = createRawTokens();

    const token = {
      name: 'spacing-md',
      path: ['spacing', 'md'],
      $type: 'dimension',
      $value: '1rem',
      attributes: {
        group: 'spacing',
        set: 'core',
      },
    } as StyleDictionaryToken;

    expect(buildFlatToken(token, rawTokens)).toEqual(buildBaseToken(token, rawTokens));
  });
});

describe('spacing helpers', () => {
  it('getSpacingNode returns the spacing record when present', () => {
    const rawTokens = createRawTokens();

    expect(getSpacingNode(rawTokens)).toEqual({
      $type: 'dimension',
      0: {
        $value: '0',
      },
      100: {
        $value: '0.25rem',
      },
      md: {
        $value: '1rem',
      },
    });
  });

  it('getSpacingNode returns null when spacing is missing or invalid', () => {
    expect(getSpacingNode({})).toBeNull();
    expect(getSpacingNode({ spacing: 'nope' })).toBeNull();
  });

  it('normaliseSpacingKey converts 0 to none', () => {
    expect(normaliseSpacingKey('0')).toBe('none');
    expect(normaliseSpacingKey('100')).toBe('100');
    expect(normaliseSpacingKey('md')).toBe('md');
  });

  it('isSpacingEntry excludes $type and non-record values', () => {
    expect(isSpacingEntry(['$type', 'dimension'])).toBe(false);
    expect(isSpacingEntry(['md', '1rem'])).toBe(false);
    expect(isSpacingEntry(['md', { $value: '1rem' }])).toBe(true);
  });

  it('getSpacingEntries returns all spacing tokens except metadata', () => {
    const rawTokens = createRawTokens();

    expect(getSpacingEntries(rawTokens)).toEqual([
      { key: 'none', tokenKey: '0', value: '0' },
      { key: '100', tokenKey: '100', value: '0.25rem' },
      { key: 'md', tokenKey: 'md', value: '1rem' },
    ]);
  });

  it('getSpacingEntries returns an empty array when spacing is missing', () => {
    expect(getSpacingEntries({})).toEqual([]);
  });

  it('getSpacingEntries throws when a spacing token does not have a string $value', () => {
    const rawTokens: TokenRecord = {
      spacing: {
        bad: {
          $value: 123,
        },
      },
    };

    expect(() => getSpacingEntries(rawTokens)).toThrowError(
      'Expected spacing token "bad" to have a string $value.'
    );
  });

  it('buildSpacingFile generates a typed spacing map', () => {
    const rawTokens = createRawTokens();

    expect(buildSpacingFile(rawTokens)).toBe(`/**
 * Do not edit directly, this file was auto-generated.
 */

export const spacingMap = {
  none: '0',
  '100': 'var(--${PREFIX}-spacing-100, 0.25rem)',
  md: 'var(--${PREFIX}-spacing-md, 1rem)',
} as const;

export type Spacing = keyof typeof spacingMap;

export function mapGapToValue(gap: Spacing): string {
  return spacingMap[gap];
}
`);
  });

  it('buildSpacingFile throws when no spacing tokens are found', () => {
    expect(() => buildSpacingFile({})).toThrowError('No spacing tokens found.');
  });

  it('buildSectionCssFile generates section spacing selectors', () => {
    const rawTokens = createRawTokens();

    expect(buildSectionCssFile(rawTokens)).toBe(`.root[data-space="none"] {
  padding-block: 0;
}

.root[data-space="100"] {
  padding-block: var(--${PREFIX}-spacing-100, 0.25rem);
}

.root[data-space="md"] {
  padding-block: var(--${PREFIX}-spacing-md, 1rem);
}
`);
  });

  it('buildSectionCssFile throws when no spacing tokens are found', () => {
    expect(() => buildSectionCssFile({})).toThrowError('No spacing tokens found.');
  });
});

describe('breakpoint helpers', () => {
  it('getBreakpointNode returns the breakpoint record when present', () => {
    const rawTokens = createRawTokens();

    expect(getBreakpointNode(rawTokens)).toEqual({
      $type: 'dimension',
      $extensions: {
        note: 'meta',
      },
      sm: {
        $value: '40rem',
      },
      md: {
        $value: '48rem',
      },
      lg: {
        $value: '64rem',
      },
    });
  });

  it('getBreakpointNode returns null when breakpoint is missing or invalid', () => {
    expect(getBreakpointNode({})).toBeNull();
    expect(getBreakpointNode({ breakpoint: 'nope' })).toBeNull();
  });

  it('isBreakpointEntry excludes metadata keys and non-record values', () => {
    expect(isBreakpointEntry(['$type', 'dimension'])).toBe(false);
    expect(isBreakpointEntry(['$extensions', { note: 'meta' }])).toBe(false);
    expect(isBreakpointEntry(['sm', '40rem'])).toBe(false);
    expect(isBreakpointEntry(['sm', { $value: '40rem' }])).toBe(true);
  });

  it('getBreakpointEntries returns all breakpoint tokens except metadata', () => {
    const rawTokens = createRawTokens();

    expect(getBreakpointEntries(rawTokens)).toEqual([
      { key: 'sm', value: '40rem' },
      { key: 'md', value: '48rem' },
      { key: 'lg', value: '64rem' },
    ]);
  });

  it('getBreakpointEntries returns an empty array when breakpoints are missing', () => {
    expect(getBreakpointEntries({})).toEqual([]);
  });

  it('getBreakpointEntries throws when a breakpoint token does not have a string $value', () => {
    const rawTokens: TokenRecord = {
      breakpoint: {
        md: {
          $value: 768,
        },
      },
    };

    expect(() => getBreakpointEntries(rawTokens)).toThrowError(
      'Expected breakpoint token "md" to have a string $value.'
    );
  });

  it('buildBreakpointsTsFile generates a TS constant map and union type', () => {
    const rawTokens = createRawTokens();

    expect(buildBreakpointsTsFile(rawTokens)).toBe(`export const BREAKPOINTS = {
  UP: {
    SM: '40rem',
    MD: '48rem',
    LG: '64rem',
  },
} as const;

export type BreakpointUpKey = 'SM' | 'MD' | 'LG';
`);
  });

  it('buildBreakpointsTsFile throws when no breakpoint tokens are found', () => {
    expect(() => buildBreakpointsTsFile({})).toThrowError('No breakpoint tokens found.');
  });

  it('buildBreakpointsCssFile generates custom media queries', () => {
    const rawTokens = createRawTokens();

    expect(buildBreakpointsCssFile(rawTokens))
      .toBe(`@custom-media --${PREFIX}-breakpoint-sm-up (min-width: 40rem);
@custom-media --${PREFIX}-breakpoint-md-up (min-width: 48rem);
@custom-media --${PREFIX}-breakpoint-lg-up (min-width: 64rem);
`);
  });

  it('buildBreakpointsCssFile throws when no breakpoint tokens are found', () => {
    expect(() => buildBreakpointsCssFile({})).toThrowError('No breakpoint tokens found.');
  });
});

describe('scope and privacy helpers', () => {
  it('getExtensions returns null for undefined or invalid nodes', () => {
    expect(getExtensions(undefined)).toBeNull();
    expect(getExtensions({ foo: 'bar' })).toBeNull();
  });

  it('getExtensions returns the $extensions record when present', () => {
    expect(
      getExtensions({
        $extensions: {
          scope: 'private',
        },
      })
    ).toEqual({
      scope: 'private',
    });
  });

  it('getInheritedScope walks up the path and returns the nearest scope', () => {
    const rawTokens = createRawTokens();

    expect(getInheritedScope(rawTokens, ['typography', 'heading', 'hero'])).toBe('public');
    expect(getInheritedScope(rawTokens, ['privateGroup', 'token'])).toBe('private');
  });

  it('getInheritedScope returns null when no scope is found', () => {
    const rawTokens = createRawTokens();

    expect(getInheritedScope(rawTokens, ['spacing', 'md'])).toBeNull();
  });

  it('isPrivateToken returns true only for private-scoped tokens', () => {
    const rawTokens = createRawTokens();

    expect(isPrivateToken(rawTokens, ['privateGroup', 'token'])).toBe(true);
    expect(isPrivateToken(rawTokens, ['typography', 'heading', 'hero'])).toBe(false);
  });

  it('applyPrivateScopeFilters adds a filter only to css outputs', () => {
    const rawTokens = createRawTokens();

    const config: SDConfig = {
      platforms: {
        css: {
          files: [
            {
              destination: 'tokens.css',
              format: 'css/variables',
            },
            {
              destination: 'tokens.ts',
              format: 'custom/types/tokens',
            },
          ],
        },
        js: {
          files: [
            {
              destination: 'tokens.js',
              format: 'javascript/es6',
            },
          ],
        },
      },
    } as SDConfig;

    applyPrivateScopeFilters(config, rawTokens);

    const cssFile = config.platforms?.css?.files?.[0];
    const tsFile = config.platforms?.css?.files?.[1];
    const jsFile = config.platforms?.js?.files?.[0];

    expect(typeof cssFile?.filter).toBe('function');
    expect(tsFile?.filter).toBeUndefined();
    expect(jsFile?.filter).toBeUndefined();

    expect(typeof cssFile?.filter).toBe('function');

    if (typeof cssFile?.filter !== 'function') {
      throw new TypeError('Expected cssFile.filter to be a function');
    }

    expect(cssFile.filter({ path: ['privateGroup', 'token'] })).toBe(false);
    expect(cssFile.filter({ path: ['spacing', 'md'] })).toBe(true);
  });

  it('applyPrivateScopeFilters safely does nothing when platforms are missing', () => {
    const config: SDConfig = {} as SDConfig;

    expect(() => applyPrivateScopeFilters(config, createRawTokens())).not.toThrow();
  });
});

describe('config mutation helpers', () => {
  it('addBreakpointOutputs appends breakpoint css and ts outputs to the css platform', () => {
    const config: SDConfig = {
      platforms: {
        css: {
          files: [
            {
              destination: 'existing.css',
              format: 'css/variables',
            },
          ],
        },
      },
    } as SDConfig;

    addBreakpointOutputs(config);

    expect(config.platforms?.css?.files).toEqual([
      {
        destination: 'existing.css',
        format: 'css/variables',
      },
      {
        destination: 'breakpoints.css',
        format: 'custom/css/custom-media-breakpoints',
      },
      {
        destination: 'breakpoints.ts',
        format: 'custom/types/breakpoints',
      },
    ]);
  });

  it('addBreakpointOutputs initialises css files when missing', () => {
    const config: SDConfig = {
      platforms: {
        css: {},
      },
    } as SDConfig;

    addBreakpointOutputs(config);

    expect(config.platforms?.css?.files).toEqual([
      {
        destination: 'breakpoints.css',
        format: 'custom/css/custom-media-breakpoints',
      },
      {
        destination: 'breakpoints.ts',
        format: 'custom/types/breakpoints',
      },
    ]);
  });

  it('addBreakpointOutputs safely does nothing when the css platform is missing', () => {
    const config: SDConfig = {
      platforms: {},
    } as SDConfig;

    expect(() => addBreakpointOutputs(config)).not.toThrow();
    expect(config.platforms?.css).toBeUndefined();
  });
});
