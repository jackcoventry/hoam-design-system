/** @type { import('@storybook/react-vite').StorybookConfig } */

const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // async viteFinal(config) {
  //   const { mergeConfig } = await import("vite");

  //   return mergeConfig(config, {
  //     resolve: {
  //       alias: {
  //         "@": "../src",
  //       },
  //     },
  //     esbuild: {
  //       jsx: "automatic",
  //     },
  //   });
  // },
};
export default config;
