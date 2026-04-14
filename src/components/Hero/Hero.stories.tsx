import { Meta, StoryObj } from '@storybook/react-vite';

import { Hero } from '@/components/Hero';
import MockSlides from '@/mocks/components/Hero';

type HeroStoryArgs = React.ComponentProps<typeof Hero> & {
  data: typeof MockSlides;
};

const meta: Meta<HeroStoryArgs> = {
  title: 'Components/Hero',
  component: Hero,
  args: {
    data: MockSlides,
  },
  argTypes: {
    'aria-label': {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {
  render: (args) => <Hero items={args.data} />,
};

export const Default = { ...Template };
export const Single = {
  ...Template,
  args: {
    data: [MockSlides[0]],
  },
};

export const Video = {
  ...Template,
  args: {
    data: [MockSlides[3]],
  },
};
