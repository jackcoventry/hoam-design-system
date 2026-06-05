import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const componentsRoot = path.resolve(__dirname, 'src/components');

function getComponentEntryPoints() {
  return Object.fromEntries(
    fs
      .readdirSync(componentsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .flatMap((entry) => {
        const entryPath = path.resolve(componentsRoot, entry.name, 'index.ts');

        if (!fs.existsSync(entryPath)) {
          return [];
        }

        return [[`components/${entry.name}/index`, entryPath]];
      })
  );
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      entryRoot: 'src',
      insertTypesEntry: true,
      exclude: [
        '**/*.test.*',
        '**/*.spec.*',
        '**/*.stories.*',
        'src/stories/**',
        'src/mocks/**',
        'src/lib/style-dictionary/**',
        'src/scripts/**',
        '.storybook/**',
        'config/**',
      ],
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    copyPublicDir: false,
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        'hooks/index': path.resolve(__dirname, 'src/hooks/index.ts'),
        'lib/i18n/index': path.resolve(__dirname, 'src/lib/i18n/index.ts'),
        ...getComponentEntryPoints(),
      },
      cssFileName: 'index',
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        banner: '"use client";',
      },
    },
  },
});
