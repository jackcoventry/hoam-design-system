import { resolveReferences } from '@/utils/get';
import type {
  Token,
  TokenBase,
  TokenExtensions,
  TokenOriginalValues,
  TypographyToken,
} from '@/design-tokens/types';

import {
  BreakpointEntry,
  SDConfig,
  SpacingEntry,
  StyleDictionaryToken,
  TokenRecord,
} from './types';

export const PREFIX = 'hoam';

export function isRecord(value: unknown): value is TokenRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getRecordValue(obj: TokenRecord, key: string): unknown {
  return obj[key];
}

export function getNodeAtPath(obj: unknown, path: string[]): TokenRecord | undefined {
  let current: unknown = obj;

  for (const key of path) {
    if (!isRecord(current)) {
      return undefined;
    }

    current = getRecordValue(current, key);
  }

  return isRecord(current) ? current : undefined;
}

export function getLeafExtensions(rawTokens: TokenRecord, path: string[]): TokenExtensions | null {
  const node = getNodeAtPath(rawTokens, path);

  if (!node) {
    return null;
  }

  const extensions = getRecordValue(node, '$extensions');
  return isRecord(extensions) ? (extensions as TokenExtensions) : null;
}

export function findGroup(rawTokens: TokenRecord, path: string[]): string | null {
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

export function extractResolvedValue(value: unknown): string | number | null {
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

export function extractFontFamily(value: unknown): string | null {
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

export function buildBaseToken(token: StyleDictionaryToken, rawTokens: TokenRecord): TokenBase {
  const leafExtensions = getLeafExtensions(rawTokens, token.path);
  const inheritedScope = getInheritedScope(rawTokens, token.path);

  const extensions: TokenExtensions | undefined =
    leafExtensions || inheritedScope
      ? {
          ...leafExtensions,
          ...(inheritedScope ? { scope: inheritedScope } : {}),
        }
      : undefined;

  return {
    name: `${PREFIX}-${token.name}`,
    cssVar: `--${PREFIX}-${token.name}`,
    type: token.$type ?? null,
    value: token.$value ?? null,
    group: token.attributes?.group ?? null,
    set: token.attributes?.set ?? null,
    ...(extensions ? { extensions } : {}),
  };
}

export function buildTypographyOriginalValues(
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

export function buildFlatToken(token: StyleDictionaryToken, rawTokens: TokenRecord): Token {
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

export function getSpacingNode(rawTokens: TokenRecord): TokenRecord | null {
  const spacing = getRecordValue(rawTokens, 'spacing');
  return isRecord(spacing) ? spacing : null;
}

export function normaliseSpacingKey(key: string): string {
  return key === '0' ? 'none' : key;
}

export function isSpacingEntry(entry: [string, unknown]): entry is [string, TokenRecord] {
  const [key, value] = entry;
  return key !== '$type' && isRecord(value);
}

export function getSpacingEntries(rawTokens: TokenRecord): SpacingEntry[] {
  const spacingNode = getSpacingNode(rawTokens);

  if (!spacingNode) {
    return [];
  }

  return Object.entries(spacingNode)
    .filter(isSpacingEntry)
    .map(([tokenKey, value]) => {
      const rawValue = getRecordValue(value, '$value');

      if (typeof rawValue !== 'string') {
        throw new TypeError(`Expected spacing token "${tokenKey}" to have a string $value.`);
      }

      return {
        key: normaliseSpacingKey(tokenKey),
        tokenKey,
        value: rawValue,
      };
    });
}

function startsWithNumber(str: string) {
  if (!str || str.length === 0) return false;
  return /\d/.test(str.charAt(0));
}

export function buildSpacingFile(rawTokens: TokenRecord): string {
  const spacingEntries = getSpacingEntries(rawTokens);

  if (spacingEntries.length === 0) {
    throw new Error('No spacing tokens found.');
  }

  const spacingMapEntries = spacingEntries
    .map((entry) => {
      const mapValue =
        entry.key === 'none'
          ? entry.value
          : `var(--${PREFIX}-spacing-${entry.tokenKey}, ${entry.value})`;

      const key = startsWithNumber(entry.key) ? `'${entry.key}'` : entry.key;

      return `  ${key}: '${mapValue}',`;
    })
    .join('\n');

  return `/**
 * Do not edit directly, this file was auto-generated.
 */

export const spacingMap = {
${spacingMapEntries}
} as const;

export type Spacing = keyof typeof spacingMap;

export function mapGapToValue(gap: Spacing): string {
  return spacingMap[gap];
}
`;
}

export function getBreakpointNode(rawTokens: TokenRecord): TokenRecord | null {
  const breakpoint = getRecordValue(rawTokens, 'breakpoint');
  return isRecord(breakpoint) ? breakpoint : null;
}

export function isBreakpointEntry(entry: [string, unknown]): entry is [string, TokenRecord] {
  const [key, value] = entry;
  return key !== '$type' && key !== '$extensions' && isRecord(value);
}

export function getBreakpointEntries(rawTokens: TokenRecord): BreakpointEntry[] {
  const breakpointNode = getBreakpointNode(rawTokens);

  if (!breakpointNode) {
    return [];
  }

  return Object.entries(breakpointNode)
    .filter(isBreakpointEntry)
    .map(([tokenKey, value]) => {
      const rawValue = getRecordValue(value, '$value');

      if (typeof rawValue !== 'string') {
        throw new TypeError(`Expected breakpoint token "${tokenKey}" to have a string $value.`);
      }

      return {
        key: tokenKey,
        value: rawValue,
      };
    });
}

export function buildBreakpointsTsFile(rawTokens: TokenRecord): string {
  const breakpointEntries = getBreakpointEntries(rawTokens);

  if (breakpointEntries.length === 0) {
    throw new Error('No breakpoint tokens found.');
  }

  const upEntries = breakpointEntries
    .map((entry) => `    ${entry.key.toUpperCase()}: '${entry.value}',`)
    .join('\n');

  const keys = breakpointEntries.map((entry) => `'${entry.key.toUpperCase()}'`).join(' | ');

  return `export const BREAKPOINTS = {
  UP: {
${upEntries}
  },
} as const;

export type BreakpointUpKey = ${keys};
`;
}

export function buildBreakpointsCssFile(rawTokens: TokenRecord): string {
  const breakpointEntries = getBreakpointEntries(rawTokens);

  if (breakpointEntries.length === 0) {
    throw new Error('No breakpoint tokens found.');
  }

  return breakpointEntries
    .map(
      (entry, index) =>
        `@custom-media --${PREFIX}-breakpoint-${entry.key}-up (min-width: ${entry.value});${
          index === breakpointEntries.length - 1
            ? `
`
            : ''
        }`
    )
    .join('\n');
}

export function buildSectionCssFile(rawTokens: TokenRecord): string {
  const spacingEntries = getSpacingEntries(rawTokens);

  if (spacingEntries.length === 0) {
    throw new Error('No spacing tokens found.');
  }

  return spacingEntries
    .map((entry, index) => {
      const value =
        entry.key === 'none'
          ? entry.value
          : `var(--${PREFIX}-spacing-${entry.tokenKey}, ${entry.value})`;

      return `.root[data-space="${entry.key}"] {
  padding-block: ${value};
}${
        index === spacingEntries.length - 1
          ? `
`
          : ''
      }`;
    })
    .join('\n\n');
}

export function getExtensions(node: TokenRecord | undefined): TokenRecord | null {
  if (!node) {
    return null;
  }

  const extensions = getRecordValue(node, '$extensions');
  return isRecord(extensions) ? extensions : null;
}

export function getInheritedScope(rawTokens: TokenRecord, path: string[]): string | null {
  for (let i = path.length; i >= 0; i--) {
    const node = getNodeAtPath(rawTokens, path.slice(0, i));

    if (!node) {
      continue;
    }

    const extensions = getExtensions(node);

    if (!extensions) {
      continue;
    }

    const scope = getRecordValue(extensions, 'scope');

    if (typeof scope === 'string') {
      return scope;
    }
  }

  return null;
}

export function isPrivateToken(rawTokens: TokenRecord, path: string[]): boolean {
  return getInheritedScope(rawTokens, path) === 'private';
}

export function applyPrivateScopeFilters(config: SDConfig, rawTokens: TokenRecord): void {
  const platforms = config.platforms;

  if (!platforms) {
    return;
  }

  for (const platform of Object.values(platforms)) {
    if (!platform.files) {
      continue;
    }

    for (const file of platform.files) {
      const isCssOutput = typeof file.destination === 'string' && file.destination.endsWith('.css');

      if (!isCssOutput) {
        continue;
      }

      file.filter = (token: { path: string[] }) => !isPrivateToken(rawTokens, token.path);
    }
  }
}

export function addBreakpointOutputs(config: SDConfig): void {
  const cssPlatform = config.platforms?.css;

  if (!cssPlatform) {
    return;
  }

  cssPlatform.files ??= [];

  cssPlatform.files.push(
    {
      destination: 'breakpoints.css',
      format: 'custom/css/custom-media-breakpoints',
    },
    {
      destination: 'breakpoints.ts',
      format: 'custom/types/breakpoints',
    }
  );
}
