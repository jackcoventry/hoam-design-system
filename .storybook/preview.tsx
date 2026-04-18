import type { Decorator, Preview } from '@storybook/react-vite';

import { ModalStackProvider } from '../src/components/Modal/ModalStackContext';

import '@/styles/variables.css';
import '@/styles/reset.css';
import '@/styles/global.css';
import '@/styles/fonts.css';

const withModalStack: Decorator = (Story) => (
  <ModalStackProvider>
    <Story />
  </ModalStackProvider>
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [withModalStack],
};

export default preview;
