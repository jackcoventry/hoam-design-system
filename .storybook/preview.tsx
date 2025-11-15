import React from 'react';
import type { Preview, Decorator } from '@storybook/react';
import { ModalStackProvider } from '../src/components/Modal/ModalStackContext';
import { themes } from "storybook/theming";

import "@/styles/_variables.css";
import "@/styles/_reset.css";
import "@/styles/_global.css";
import "@/styles/_grid.scss";
import "@/styles/_demo.css";

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
    docs: {
      theme: themes.hoam,
    },
  },
  decorators: [withModalStack],
};

export default preview;
