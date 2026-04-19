import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-vitest', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal(config) {
    if (config.plugins) {
      config.plugins = config.plugins.filter((plugin) => {
        return !(
          plugin &&
          typeof plugin === 'object' &&
          'name' in plugin &&
          plugin.name === 'vite:dts'
        );
      });
    }

    return mergeConfig(config, {
      define: {
        __STORYBOOK__: 'true',
      },
      build: {
        chunkSizeWarningLimit: 1500,
      },
    });
  },
};

export default config;
