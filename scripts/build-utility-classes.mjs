import StyleDictionary from "style-dictionary";
import { readFile } from "fs/promises";
import { glob } from "glob";

console.log("📦 Tokens found:", await glob("src/design-tokens/**/*.json"));

StyleDictionary.registerFormat({
  name: "custom/css/classes",
  format: ({ allTokens }) => {
    console.log("✅ Formatter running with", allTokens.length, "tokens");

    return allTokens
      .map((prop) => {
        const className = prop.name.replace(/\./g, "-");
        const type = prop.$type;
        const value = prop.$value;

        switch (type) {
          case "color":
            return `.${className} { color: ${value}; }`;

          default:
            // console.warn(`⚠️ Unhandled token type: ${type} (${className})`);
            return null;
        }
      })
      .filter(Boolean) // Remove skipped/null entries
      .join("\n");
  },
});

StyleDictionary.registerFormat({
  name: "custom/json/flat-with-meta",
  format: ({ allTokens }) => {
    const flat = allTokens.map((token) => ({
      name: "hoam-" + token.name,
      cssVar: "--hoam-" + token.name,
      type: token.$type ?? null,
      value: token.$value,
      displayName: token.$metadata?.displayName ?? null,
      description: token.$metadata?.description ?? null,
    }));

    return JSON.stringify(flat, null, 2);
  },
});

const raw = await readFile(
  new URL("../style-dictionary.json", import.meta.url),
  "utf-8"
);
const config = JSON.parse(raw);
const sd = new StyleDictionary(config);

// await sd.buildPlatform("cssClasses");
await sd.buildAllPlatforms();
