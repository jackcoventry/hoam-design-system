import type { Decorator, Preview } from '@storybook/react-vite';
import { create } from 'storybook/theming';

import { ModalStackProvider } from '../src/components/Modal/ModalStackContext';

import '@/styles/_variables.css';
import '@/styles/_reset.css';
import '@/styles/_fonts.css';
import '@/styles/_global.css';
import '@/styles/_demo.css';

const withModalStack: Decorator = (Story) => (
  <ModalStackProvider>
    <Story />
  </ModalStackProvider>
);

const hoamTheme = create({
  base: 'light',
  brandTitle: 'HOAM',
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    docs: {
      theme: hoamTheme,
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [withModalStack],
};

export default preview;
