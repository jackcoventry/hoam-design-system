/** @type { import('@storybook/react-vite').Preview } */
import { themes } from "storybook/theming";
import "@/styles/_variables.css";

const preview = {
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
};

export default preview;
