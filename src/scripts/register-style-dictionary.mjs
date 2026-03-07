import merge from 'deepmerge';
import { glob } from 'glob';
import { readFile } from 'node:fs/promises';
import StyleDictionary from 'style-dictionary';
import { PREFIX } from '../constants/index.js';
import { resolveReferences } from '../utils/get.js';

// Load and merge all token files for reference
const tokenFiles = await glob('src/design-tokens/**/*.json');

console.log('📦 Tokens found:', tokenFiles);

const rawTokenObjects = await Promise.all(
  tokenFiles.map(async (file) => JSON.parse(await readFile(file, 'utf8')))
);

// Deep merge all token trees into one rawTokens object
const rawTokens = rawTokenObjects.reduce((acc, obj) => merge(acc, obj), {});
function getNodeAtPath(obj, path) {
  return path.reduce((acc, key) => acc?.[key], obj);
}

function findGroup(path) {
  for (let i = path.length - 1; i >= 0; i--) {
    const node = getNodeAtPath(rawTokens, path.slice(0, i));
    if (node?.$extensions?.$group) {
      return node.$extensions.$group;
    }
  }
  return null;
}

// Custom transform to add 'group' attribute
// Group is determined by the first occurrence of $extensions.$group in the token path
StyleDictionary.registerTransform({
  name: 'attribute/group',
  type: 'attribute',
  matcher: () => true,
  transform: (token) => {
    const group = findGroup(token.path);
    return { group };
  },
});

// Custom transform to add 'set' attribute
// Set is determined by the second last segment of the token path
// This assumes the path is structured such that the set is always the second last segment
StyleDictionary.registerTransform({
  name: 'attribute/set',
  type: 'attribute',
  matcher: () => true,
  transform: (token) => {
    const set = token.path.length >= 2 ? token.path[token.path.length - 2] : null; // TODO: maybe tweak these parameter to exclude unnecessary data
    return { set };
  },
});

// Format to output tokens as flat JSON with metadata
StyleDictionary.registerFormat({
  name: 'custom/json/flat-with-meta',
  format: ({ allTokens }) => {
    const flat = allTokens.map((token) => ({
      name: `${PREFIX}-${token.name}`,
      cssVar: `--${PREFIX}-${token.name}`, // TODO: do i need this duplication?
      type: token.$type ?? null,
      value: token.$value,
      group: token.attributes?.group ?? null,
      set: token.attributes?.set ?? null,
      ...(token.$type === 'typography' && {
        originalValues: {
          fontFamily:
            resolveReferences(token.original?.$value?.fontFamily, rawTokens)?.$value.join(', ') ??
            null,
          fontSize:
            typeof resolveReferences(token.original?.$value?.fontSize, rawTokens)?.$value ===
            'object'
              ? resolveReferences(token.original?.$value?.fontSize, rawTokens)?.$value?.$value
              : (resolveReferences(token.original?.$value?.fontSize, rawTokens)?.$value ?? null),
          fontWeight:
            resolveReferences(token.original?.$value?.fontWeight, rawTokens)?.$value ?? null,
          lineHeight:
            resolveReferences(token.original?.$value?.lineHeight, rawTokens)?.$value ?? null,
        },
      }),
    }));

    return JSON.stringify(flat, null, 2);
  },
});

const raw = await readFile(new URL('../../style-dictionary.json', import.meta.url), 'utf-8');
const config = JSON.parse(raw);
const sd = new StyleDictionary(config);

await sd.buildAllPlatforms();
