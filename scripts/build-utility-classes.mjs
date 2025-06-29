import StyleDictionary from "style-dictionary";
import { readFile } from "fs/promises";
import { glob } from "glob";

// Optional: confirm file visibility
console.log("📦 Tokens found:", await glob("src/design-tokens/**/*.json"));

StyleDictionary.registerFormat({
  name: "custom/css/classes",
  format: ({ allTokens }) => {
    const output = [];

    const colorTokens = allTokens.filter((e) => e.$type === "color");
    const typographyTokens = allTokens.filter((e) => e.$type === "typography");

    console.log("typographyTokens", typographyTokens);

    // console.log("✅ Formatter running with", allTokens.length, "tokens");
    return false;

    return allTokens
      .map((prop) => {
        const className = prop.name.replace(/\./g, "-");
        const type = prop.$type;
        const value = prop.$value;

        switch (type) {
          case "color":
            return `.${className} { color: ${value}; }`;

          case "dimension":
          case "spacing":
            return `.${className} { padding: ${value}; }`; // or `gap`, `margin`, etc.

          case "typography":
            // Typography tokens are usually objects → handle each sub-prop
            return Object.entries(value)
              .map(([key, val]) => `.${className}-${key} { ${key}: ${val}; }`)
              .join("\n");

          case "fontFamily":
            return `.${className} { font-family: ${value}; }`;

          case "fontWeight":
            return `.${className} { font-weight: ${value}; }`;

          case "lineHeight":
            return `.${className} { line-height: ${value}; }`;

          case "letterSpacing":
            return `.${className} { letter-spacing: ${value}; }`;

          case "breakpoint":
          case "screen":
            return `@media (min-width: ${value}) { .${className} { display: block; } }`;

          case "icon":
            return `.${className}::before { content: "${value}"; }`;

          default:
            console.warn(`⚠️ Unhandled token type: ${type} (${className})`);
            return null;
        }
      })
      .filter(Boolean) // Remove skipped/null entries
      .join("\n");
  },
});

const raw = await readFile(
  new URL("../style-dictionary.json", import.meta.url),
  "utf-8"
);
const config = JSON.parse(raw);
const sd = new StyleDictionary(config);

await sd.buildPlatform("cssClasses");
