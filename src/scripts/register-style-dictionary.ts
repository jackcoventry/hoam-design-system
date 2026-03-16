import merge from 'deepmerge';
import { glob } from 'glob';
import { readFile } from 'node:fs/promises';
import StyleDictionary from 'style-dictionary';

import { resolveReferences } from '../utils/get';

const PREFIX = 'hoam';

type TokenRecord = Record<string, unknown>;

type StyleDictionaryToken = {
  name: string;
  path: string[];
  $type?: string;
  $value?: unknown;
  original?: {
    $value?: {
      fontFamily?: unknown;
      fontSize?: unknown;
      fontWeight?: unknown;
      lineHeight?: unknown;
    };
  };
  attributes?: {
    group?: string | null;
    set?: string | null;
  };
};

type FlatToken = {
  name: string;
  cssVar: string;
  type: string | null;
  value: unknown;
  group: string | null;
  set: string | null;
  originalValues?: {
    fontFamily: string | null;
    fontSize: string | number | null;
    fontWeight: string | number | null;
    lineHeight: string | number | null;
  };
};

function isRecord(value: unknown): value is TokenRecord {
  return typeof value === 'object' && value !== null;
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

function findGroup(rawTokens: TokenRecord, path: string[]): string | null {
  for (let i = path.length - 1; i >= 0; i--) {
    const node = getNodeAtPath(rawTokens, path.slice(0, i));

    if (!node) continue;

    const extensions = getNodeAtPath(node, ['$extensions']);
    const group = extensions ? getRecordValue(extensions, '$group') : undefined;

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

StyleDictionary.registerFormat({
  name: 'custom/json/flat-with-meta',
  format: (args) => {
    const dictionary = args.dictionary as { allTokens: StyleDictionaryToken[] };
    const allTokens = dictionary.allTokens;

    const flat: FlatToken[] = allTokens.map((token) => {
      const baseToken: FlatToken = {
        name: `${PREFIX}-${token.name}`,
        cssVar: `--${PREFIX}-${token.name}`,
        type: token.$type ?? null,
        value: token.$value ?? null,
        group: token.attributes?.group ?? null,
        set: token.attributes?.set ?? null,
      };

      if (token.$type !== 'typography') {
        return baseToken;
      }

      const originalTypography = token.original?.$value;

      return {
        ...baseToken,
        originalValues: {
          fontFamily: extractFontFamily(
            resolveReferences(originalTypography?.fontFamily, rawTokens)
          ),
          fontSize: extractResolvedValue(
            resolveReferences(originalTypography?.fontSize, rawTokens)
          ),
          fontWeight: extractResolvedValue(
            resolveReferences(originalTypography?.fontWeight, rawTokens)
          ),
          lineHeight: extractResolvedValue(
            resolveReferences(originalTypography?.lineHeight, rawTokens)
          ),
        },
      };
    });

    return JSON.stringify(flat, null, 2);
  },
});

const rawConfig = await readFile(new URL('../../style-dictionary.json', import.meta.url), 'utf-8');

const config = JSON.parse(rawConfig) as ConstructorParameters<typeof StyleDictionary>[0];
const sd = new StyleDictionary(config);

await sd.buildAllPlatforms();
