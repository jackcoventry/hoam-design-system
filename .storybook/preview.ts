/** @type { import('@storybook/react-vite').Preview } */
import { themes } from "storybook/theming";
import "@/styles/_variables.css";
import "@/styles/_reset.css";
import "@/styles/_global.css";
import "@/styles/_grid.scss";
import "@/styles/_demo.css";

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
    layout: 'fullscreen',
  },
};

export default preview;
