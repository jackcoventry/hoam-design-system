import merge from 'deepmerge';
import { glob } from 'glob';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';

import type { Token } from '@/design-tokens/types';
import {
  addBreakpointOutputs,
  applyPrivateScopeFilters,
  buildBreakpointsCssFile,
  buildBreakpointsTsFile,
  buildFlatToken,
  buildSectionCssFile,
  buildSpacingFile,
  findGroup,
} from '@/lib/style-dictionary/helpers';
import { SDConfig, StyleDictionaryFormatArgs, TokenRecord } from '@/lib/style-dictionary/types';

const tokenFiles = await glob([
  'src/design-tokens/**/*.json',
  '!src/design-tokens/build/**/*.json',
]);

console.log('📦 Tokens found:', tokenFiles);

const rawTokenObjects = await Promise.all(
  tokenFiles.map(async (file) => JSON.parse(await readFile(file, 'utf8')) as TokenRecord)
);

const rawTokens = rawTokenObjects.reduce<TokenRecord>(
  (acc, obj) => merge(acc, obj),
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

StyleDictionary.registerFormat({
  name: 'custom/types/breakpoints',
  format: () => buildBreakpointsTsFile(rawTokens),
});

StyleDictionary.registerFormat({
  name: 'custom/css/custom-media-breakpoints',
  format: () => buildBreakpointsCssFile(rawTokens),
});

const rawConfig = await readFile(
  new URL('../../../style-dictionary.json', import.meta.url),
  'utf-8'
);

function isSDConfig(value: unknown): value is SDConfig {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const parsedConfig = JSON.parse(rawConfig) as unknown;

if (!isSDConfig(parsedConfig)) {
  throw new TypeError('Style Dictionary config must be an object.');
}

const config: SDConfig = parsedConfig;

applyPrivateScopeFilters(config, rawTokens);
addBreakpointOutputs(config);

const sd = new StyleDictionary(config);

await sd.buildAllPlatforms();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const buildDir = resolve(__dirname, '../../design-tokens/');

await mkdir(buildDir, { recursive: true });

await writeFile(resolve(buildDir, 'spacing.ts'), buildSpacingFile(rawTokens), 'utf8');

console.log(`📏 Spacing helpers written: ${resolve(buildDir, 'spacing.ts')}`);

await writeFile(
  resolve(__dirname, '../../components/Layout/Section/Section.module.css'),
  buildSectionCssFile(rawTokens),
  'utf8'
);

console.log(
  `🧩 Section CSS written: ${resolve(__dirname, '../../components/Layout/Section/Section.module.css')}`
);
