import StyleDictionary from "style-dictionary";
import { readFile } from "fs/promises";
import { glob } from "glob";
import merge from "deepmerge";
import { PREFIX } from "../constants/index.js";

// Load and merge all token files for reference
const tokenFiles = await glob("src/design-tokens/**/*.json");

console.log("📦 Tokens found:", tokenFiles);

const rawTokenObjects = await Promise.all(
  tokenFiles.map(async (file) => JSON.parse(await readFile(file, "utf8")))
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

StyleDictionary.registerTransform({
  name: "attribute/group",
  type: "attribute",
  matcher: () => true,
  transform: (token) => {
    const group = findGroup(token.path);
    return { group };
  },
});

StyleDictionary.registerFormat({
  name: "custom/json/flat-with-meta",
  format: ({ allTokens }) => {
    const flat = allTokens.map((token) => ({
      name: `${PREFIX}-${token.name}`,
      cssVar: `--${PREFIX}-${token.name}`,
      type: token.$type ?? null,
      value: token.$value,
      group: token.attributes?.group ?? null,
      description: token.$extensions?.description || null,
    }));

    return JSON.stringify(flat, null, 2);
  },
});

const raw = await readFile(
  new URL("../../style-dictionary.json", import.meta.url),
  "utf-8"
);
const config = JSON.parse(raw);
const sd = new StyleDictionary(config);

// await sd.buildPlatform("cssClasses");
await sd.buildAllPlatforms();
