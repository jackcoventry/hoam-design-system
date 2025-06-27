import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss"; // Add PostCSS plugin for handling CSS
import url from "@rollup/plugin-url"; // Add URL plugin to handle non-JS assets

export default {
  input: "src/index.ts", // Input entry point
  output: [
    {
      file: "dist/index.js",
      format: "cjs", // CommonJS output
      exports: "named",
    },
    {
      file: "dist/index.es.js",
      format: "es", // ES Module output
    },
  ],
  plugins: [
    peerDepsExternal(), // Ensure peer dependencies are external
    resolve({
      extensions: [".js", ".ts", ".tsx", ".json"], // Resolve .tsx, .ts files
    }),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }), // Explicitly use the tsconfig.json
    postcss({ extract: true }), // Extract CSS into its own file
    url(), // Handle assets like images, fonts, etc.
  ],
  external: ["react", "react-dom"], // Ensure React and ReactDOM are treated as external dependencies
};
