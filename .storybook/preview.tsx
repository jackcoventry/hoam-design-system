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

const withTheme: Decorator = (Story, context) => {
  const { theme } = context.globals;

  document.body.dataset.theme = String(theme);

  return <Story />;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Page / product theme',
      defaultValue: 'default',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default' },
          { value: 'hot', title: 'Hot' },
          { value: 'cold', title: 'Cold' },
          { value: 'spirit', title: 'Spirit' },
          { value: 'wise', title: 'Wise' },
        ],
      },
    },
  },
  decorators: [withModalStack, withTheme],
};

export default preview;
