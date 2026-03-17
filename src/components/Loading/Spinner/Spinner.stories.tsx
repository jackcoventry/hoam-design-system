import type { Meta, StoryObj } from '@storybook/react-vite';

import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Loading/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Loading content',
    ariaLive: 'polite',
  },
  argTypes: {
    ariaLive: {
      control: 'inline-radio',
      options: ['polite', 'off'],
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
