import { beforeEach, describe, expect, it, vi } from 'vitest';

const globMock = vi.fn();
const mergeMock = vi.fn();

const addBreakpointOutputsMock = vi.fn();
const applyPrivateScopeFiltersMock = vi.fn();
const buildBreakpointsCssFileMock = vi.fn();
const buildBreakpointsTsFileMock = vi.fn();
const buildFlatTokenMock = vi.fn();
const buildSectionCssFileMock = vi.fn();
const buildSpacingFileMock = vi.fn();
const findGroupMock = vi.fn();

const registerTransformMock = vi.fn();
const registerFormatMock = vi.fn();
const buildAllPlatformsMock = vi.fn();
const styleDictionaryConstructorMock = vi.fn();

const readFileMock = vi.fn();
const mkdirMock = vi.fn();
const writeFileMock = vi.fn();

const virtualFs = new Map<string, string>();

vi.mock('glob', () => ({
  __esModule: true,
  glob: globMock,
}));

vi.mock('deepmerge', () => ({
  __esModule: true,
  default: mergeMock,
}));

vi.mock('@/lib/style-dictionary/helpers', () => ({
  __esModule: true,
  addBreakpointOutputs: addBreakpointOutputsMock,
  applyPrivateScopeFilters: applyPrivateScopeFiltersMock,
  buildBreakpointsCssFile: buildBreakpointsCssFileMock,
  buildBreakpointsTsFile: buildBreakpointsTsFileMock,
  buildFlatToken: buildFlatTokenMock,
  buildSectionCssFile: buildSectionCssFileMock,
  buildSpacingFile: buildSpacingFileMock,
  findGroup: findGroupMock,
}));

vi.mock(import('node:fs/promises'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    default: actual,
    readFile: readFileMock,
    mkdir: mkdirMock,
    writeFile: writeFileMock,
  };
});

vi.mock('style-dictionary', () => {
  class MockStyleDictionary {
    static registerTransform = registerTransformMock;
    static registerFormat = registerFormatMock;

    constructor(config: unknown) {
      styleDictionaryConstructorMock(config);
    }

    buildAllPlatforms = buildAllPlatformsMock;
  }

  return {
    __esModule: true,
    default: MockStyleDictionary,
  };
});

describe('register-style-dictionary script', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    virtualFs.clear();

    globMock.mockResolvedValue(['src/design-tokens/core.json', 'src/design-tokens/semantic.json']);

    mergeMock.mockImplementation((a: Record<string, unknown>, b: Record<string, unknown>) => ({
      ...a,
      ...b,
    }));

    buildSpacingFileMock.mockReturnValue('// spacing helpers');
    buildSectionCssFileMock.mockReturnValue('/* section css */');
    buildBreakpointsCssFileMock.mockReturnValue('/* breakpoints css */');
    buildBreakpointsTsFileMock.mockReturnValue('// breakpoints ts');
    buildFlatTokenMock.mockImplementation((token) => ({
      name: token.name,
    }));

    findGroupMock.mockReturnValue('content');
    buildAllPlatformsMock.mockResolvedValue(undefined);
    mkdirMock.mockResolvedValue(undefined);

    virtualFs.set(
      'src/design-tokens/core.json',
      JSON.stringify({
        spacing: {
          0: { $value: '0' },
        },
      })
    );

    virtualFs.set(
      'src/design-tokens/semantic.json',
      JSON.stringify({
        breakpoint: {
          sm: { $value: '40rem' },
        },
      })
    );

    virtualFs.set(
      'style-dictionary.json',
      JSON.stringify({
        platforms: {
          css: {
            files: [
              {
                destination: 'tokens.css',
                format: 'css/variables',
              },
            ],
          },
        },
      })
    );

    readFileMock.mockImplementation(async (path: string | URL) => {
      const pathString = String(path);

      if (virtualFs.has(pathString)) {
        return virtualFs.get(pathString) as string;
      }

      // Handles: new URL('../../../style-dictionary.json', import.meta.url)
      if (pathString.includes('style-dictionary.json')) {
        const config = virtualFs.get('style-dictionary.json');

        if (config == null) {
          throw new Error('Missing virtual style-dictionary.json');
        }

        return config;
      }

      throw new Error(`Unexpected readFile path: ${pathString}`);
    });

    writeFileMock.mockImplementation(async (path: string | URL, contents: string) => {
      virtualFs.set(String(path), contents);
    });
  });

  it('registers transforms and formats, builds platforms, and writes generated files', async () => {
    await import('@/lib/style-dictionary/register');

    expect(globMock).toHaveBeenCalledWith([
      'src/design-tokens/**/*.json',
      '!src/design-tokens/build/**/*.json',
    ]);

    expect(readFileMock).toHaveBeenCalledTimes(3);
    expect(mergeMock).toHaveBeenCalledTimes(2);

    expect(registerTransformMock).toHaveBeenCalledTimes(2);
    expect(registerTransformMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        name: 'attribute/group',
        type: 'attribute',
        transform: expect.any(Function),
      })
    );
    expect(registerTransformMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        name: 'attribute/set',
        type: 'attribute',
        transform: expect.any(Function),
      })
    );

    expect(registerFormatMock).toHaveBeenCalledTimes(4);
    expect(registerFormatMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        name: 'custom/json/flat-with-meta',
        format: expect.any(Function),
      })
    );
    expect(registerFormatMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        name: 'custom/types/flat-tokens',
        format: expect.any(Function),
      })
    );
    expect(registerFormatMock).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        name: 'custom/types/breakpoints',
        format: expect.any(Function),
      })
    );
    expect(registerFormatMock).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        name: 'custom/css/custom-media-breakpoints',
        format: expect.any(Function),
      })
    );

    expect(applyPrivateScopeFiltersMock).toHaveBeenCalledTimes(1);
    expect(addBreakpointOutputsMock).toHaveBeenCalledTimes(1);

    expect(styleDictionaryConstructorMock).toHaveBeenCalledWith({
      platforms: {
        css: {
          files: [
            {
              destination: 'tokens.css',
              format: 'css/variables',
            },
          ],
        },
      },
    });

    expect(buildAllPlatformsMock).toHaveBeenCalledTimes(1);
    expect(mkdirMock).toHaveBeenCalledTimes(1);

    expect(buildSpacingFileMock).toHaveBeenCalledTimes(1);
    expect(buildSectionCssFileMock).toHaveBeenCalledTimes(1);

    const writtenEntries = Array.from(virtualFs.entries());

    expect(
      writtenEntries.some(
        ([path, contents]) =>
          path.endsWith('/design-tokens/spacing.ts') && contents === '// spacing helpers'
      )
    ).toBe(true);

    expect(
      writtenEntries.some(
        ([path, contents]) =>
          path.endsWith('/components/Layout/Section/Section.module.css') &&
          contents === '/* section css */'
      )
    ).toBe(true);
  });

  it('throws when the parsed Style Dictionary config is not an object', async () => {
    virtualFs.set('style-dictionary.json', JSON.stringify(['not-an-object']));

    await expect(import('@/lib/style-dictionary/register')).rejects.toThrowError(
      'Style Dictionary config must be an object.'
    );

    expect(styleDictionaryConstructorMock).not.toHaveBeenCalled();
    expect(buildAllPlatformsMock).not.toHaveBeenCalled();
    expect(writeFileMock).not.toHaveBeenCalled();
  });

  it('the attribute/group transform uses findGroup with raw tokens and token path', async () => {
    await import('@/lib/style-dictionary/register');

    const groupTransformRegistration = registerTransformMock.mock.calls.find(
      ([arg]) => arg.name === 'attribute/group'
    )?.[0];

    if (!groupTransformRegistration) {
      throw new Error('Expected attribute/group transform to be registered');
    }

    const result = groupTransformRegistration.transform({
      path: ['typography', 'heading', 'hero'],
    });

    expect(findGroupMock).toHaveBeenCalledWith(
      {
        spacing: {
          0: { $value: '0' },
        },
        breakpoint: {
          sm: { $value: '40rem' },
        },
      },
      ['typography', 'heading', 'hero']
    );

    expect(result).toEqual({ group: 'content' });
  });

  it('the attribute/set transform returns the second-last path segment', async () => {
    await import('@/lib/style-dictionary/register');

    const setTransformRegistration = registerTransformMock.mock.calls.find(
      ([arg]) => arg.name === 'attribute/set'
    )?.[0];

    if (!setTransformRegistration) {
      throw new Error('Expected attribute/set transform to be registered');
    }

    expect(
      setTransformRegistration.transform({
        path: ['typography', 'heading', 'hero'],
      })
    ).toEqual({ set: 'heading' });

    expect(
      setTransformRegistration.transform({
        path: ['root'],
      })
    ).toEqual({ set: null });
  });

  it('the custom flat JSON format maps all tokens through buildFlatToken', async () => {
    await import('@/lib/style-dictionary/register');

    const flatFormatRegistration = registerFormatMock.mock.calls.find(
      ([arg]) => arg.name === 'custom/json/flat-with-meta'
    )?.[0];

    if (!flatFormatRegistration) {
      throw new Error('Expected custom/json/flat-with-meta format to be registered');
    }

    buildFlatTokenMock
      .mockReturnValueOnce({ name: 'first-token' })
      .mockReturnValueOnce({ name: 'second-token' });

    const output = flatFormatRegistration.format({
      dictionary: {
        allTokens: [{ name: 'one' }, { name: 'two' }],
      },
    });

    expect(buildFlatTokenMock).toHaveBeenCalledTimes(2);
    expect(buildFlatTokenMock).toHaveBeenNthCalledWith(
      1,
      { name: 'one' },
      {
        spacing: {
          0: { $value: '0' },
        },
        breakpoint: {
          sm: { $value: '40rem' },
        },
      }
    );
    expect(buildFlatTokenMock).toHaveBeenNthCalledWith(
      2,
      { name: 'two' },
      {
        spacing: {
          0: { $value: '0' },
        },
        breakpoint: {
          sm: { $value: '40rem' },
        },
      }
    );

    expect(output).toBe(
      JSON.stringify([{ name: 'first-token' }, { name: 'second-token' }], null, 2)
    );
  });

  it('the breakpoint formats delegate to the helper builders', async () => {
    buildBreakpointsTsFileMock.mockReturnValue('// generated ts');
    buildBreakpointsCssFileMock.mockReturnValue('/* generated css */');

    await import('@/lib/style-dictionary/register');

    const tsFormatRegistration = registerFormatMock.mock.calls.find(
      ([arg]) => arg.name === 'custom/types/breakpoints'
    )?.[0];

    const cssFormatRegistration = registerFormatMock.mock.calls.find(
      ([arg]) => arg.name === 'custom/css/custom-media-breakpoints'
    )?.[0];

    if (!tsFormatRegistration || !cssFormatRegistration) {
      throw new Error('Expected breakpoint formats to be registered');
    }

    expect(tsFormatRegistration.format()).toBe('// generated ts');
    expect(cssFormatRegistration.format()).toBe('/* generated css */');

    expect(buildBreakpointsTsFileMock).toHaveBeenCalledWith({
      spacing: {
        0: { $value: '0' },
      },
      breakpoint: {
        sm: { $value: '40rem' },
      },
    });

    expect(buildBreakpointsCssFileMock).toHaveBeenCalledWith({
      spacing: {
        0: { $value: '0' },
      },
      breakpoint: {
        sm: { $value: '40rem' },
      },
    });
  });

  it('the flat token type format returns the expected declaration content', async () => {
    await import('@/lib/style-dictionary/register');

    const typeFormatRegistration = registerFormatMock.mock.calls.find(
      ([arg]) => arg.name === 'custom/types/flat-tokens'
    )?.[0];

    if (!typeFormatRegistration) {
      throw new Error('Expected custom/types/flat-tokens format to be registered');
    }

    expect(typeFormatRegistration.format())
      .toBe(`import type { Token } from '@/design-tokens/types';

declare const tokens: Token[];
export default tokens;
`);
  });
});
