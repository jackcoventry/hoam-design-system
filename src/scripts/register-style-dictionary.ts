import merge from 'deepmerge';
import { glob } from 'glob';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';

import { resolveReferences } from '@/utils/get';
import type {
  Token,
  TokenBase,
  TokenExtensions,
  TokenOriginalValues,
  TypographyToken,
} from '@/design-tokens/types';

const PREFIX = 'hoam';

type TokenRecord = Record<string, unknown>;

type RawTypographyValue = {
  fontFamily?: unknown;
  fontSize?: unknown;
  fontWeight?: unknown;
  lineHeight?: unknown;
};

type StyleDictionaryToken = {
  name: string;
  path: string[];
  $type?: string;
  $value?: unknown;
  original?: {
    $value?: RawTypographyValue;
  };
  attributes?: {
    group?: string | null;
    set?: string | null;
  };
};

type StyleDictionaryDictionary = {
  allTokens: StyleDictionaryToken[];
};

type StyleDictionaryFormatArgs = {
  dictionary: StyleDictionaryDictionary;
};

function isRecord(value: unknown): value is TokenRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getRecordValue(obj: TokenRecord, key: string): unknown {
  return obj[key];
}

function getNodeAtPath(obj: unknown, path: string[]): TokenRecord | undefined {
  let current: unknown = obj;

  for (const key of path) {
    if (!isRecord(current)) {
      return undefined;
    }

    current = getRecordValue(current, key);
  }

  return isRecord(current) ? current : undefined;
}

function getLeafExtensions(rawTokens: TokenRecord, path: string[]): TokenExtensions | null {
  const node = getNodeAtPath(rawTokens, path);

  if (!node) {
    return null;
  }

  const extensions = getRecordValue(node, '$extensions');
  return isRecord(extensions) ? (extensions as TokenExtensions) : null;
}

function findGroup(rawTokens: TokenRecord, path: string[]): string | null {
  for (let i = path.length - 1; i >= 0; i--) {
    const node = getNodeAtPath(rawTokens, path.slice(0, i));

    if (!node) {
      continue;
    }

    const extensions = getRecordValue(node, '$extensions');

    if (!isRecord(extensions)) {
      continue;
    }

    const group = getRecordValue(extensions, '$group');

    if (typeof group === 'string') {
      return group;
    }
  }

  return null;
}

function extractResolvedValue(value: unknown): string | number | null {
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  if (isRecord(value)) {
    const nested = getRecordValue(value, '$value');

    if (typeof nested === 'string' || typeof nested === 'number') {
      return nested;
    }
  }

  return null;
}

function extractFontFamily(value: unknown): string | null {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    const parts = value.filter((item): item is string => typeof item === 'string');
    return parts.length > 0 ? parts.join(', ') : null;
  }

  if (isRecord(value)) {
    const nested = getRecordValue(value, '$value');

    if (typeof nested === 'string') {
      return nested;
    }

    if (Array.isArray(nested)) {
      const parts = nested.filter((item): item is string => typeof item === 'string');
      return parts.length > 0 ? parts.join(', ') : null;
    }
  }

  return null;
}

function buildBaseToken(token: StyleDictionaryToken, rawTokens: TokenRecord): TokenBase {
  const leafExtensions = getLeafExtensions(rawTokens, token.path);

  return {
    name: `${PREFIX}-${token.name}`,
    cssVar: `--${PREFIX}-${token.name}`,
    type: token.$type ?? null,
    value: token.$value ?? null,
    group: token.attributes?.group ?? null,
    set: token.attributes?.set ?? null,
    ...(leafExtensions ? { extensions: leafExtensions } : {}),
  };
}

function buildTypographyOriginalValues(
  token: StyleDictionaryToken,
  rawTokens: TokenRecord
): TokenOriginalValues {
  const originalTypography = token.original?.$value;

  return {
    fontFamily: extractFontFamily(resolveReferences(originalTypography?.fontFamily, rawTokens)),
    fontSize: extractResolvedValue(resolveReferences(originalTypography?.fontSize, rawTokens)),
    fontWeight: extractResolvedValue(resolveReferences(originalTypography?.fontWeight, rawTokens)),
    lineHeight: extractResolvedValue(resolveReferences(originalTypography?.lineHeight, rawTokens)),
  };
}

function buildFlatToken(token: StyleDictionaryToken, rawTokens: TokenRecord): Token {
  const baseToken = buildBaseToken(token, rawTokens);

  if (token.$type !== 'typography') {
    return baseToken;
  }

  const typographyToken: TypographyToken = {
    ...baseToken,
    type: 'typography',
    originalValues: buildTypographyOriginalValues(token, rawTokens),
  };

  return typographyToken;
}

StyleDictionary.registerFormat({
  name: 'custom/json/flat-with-meta',
  format: (args: StyleDictionaryFormatArgs) => {
    const flat: Token[] = args.dictionary.allTokens.map((token) =>
      buildFlatToken(token, rawTokens)
    );

    return JSON.stringify(flat, null, 2);
  },
});

StyleDictionary.registerFormat({
  name: 'custom/types/flat-tokens',
  format: () => {
    return `import type { Token } from '@/design-tokens/types';

declare const tokens: Token[];
export default tokens;
`;
  },
});

const tokenFiles = await glob('src/design-tokens/**/*.json');

console.log('📦 Tokens found:', tokenFiles);

const rawTokenObjects = await Promise.all(
  tokenFiles.map(async (file) => JSON.parse(await readFile(file, 'utf8')) as TokenRecord)
);

const rawTokens = rawTokenObjects.reduce<TokenRecord>(
  (acc, obj) => merge(acc, obj) as TokenRecord,
  {}
);

StyleDictionary.registerTransform({
  name: 'attribute/group',
  type: 'attribute',
  transform: (token: { path: string[] }) => {
    return { group: findGroup(rawTokens, token.path) };
  },
});

StyleDictionary.registerTransform({
  name: 'attribute/set',
  type: 'attribute',
  transform: (token: { path: string[] }) => {
    const set = token.path.length >= 2 ? (token.path.at(-2) ?? null) : null;
    return { set };
  },
});

const rawConfig = await readFile(new URL('../../style-dictionary.json', import.meta.url), 'utf-8');

const config = JSON.parse(rawConfig) as ConstructorParameters<typeof StyleDictionary>[0];
const sd = new StyleDictionary(config);

await sd.buildAllPlatforms();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputDir = resolve(__dirname, '../../src/design-tokens/build');
const declarationPath = resolve(outputDir, 'variables.d.ts');

await mkdir(outputDir, { recursive: true });
await writeFile(
  declarationPath,
  `import type { Token } from '@/design-tokens/types';

declare const tokens: Token[];
export default tokens;
`,
  'utf8'
);

console.log(`📝 Type declaration written: ${declarationPath}`);
