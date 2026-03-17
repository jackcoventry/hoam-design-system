import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Loading/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  args: {
    variant: 'rectangular',
    width: '100%',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['rectangular', 'text', 'circular'],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rectangular: Story = {
  args: {
    height: '8rem',
    width: '16rem',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    width: '12rem',
  },
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: '3rem',
    height: '3rem',
  },
};

export const ArticlePreview: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '20rem' }}>
      <Skeleton height="10rem" />
      <Skeleton
        variant="text"
        width="70%"
      />
      <Skeleton
        variant="text"
        width="100%"
      />
      <Skeleton
        variant="text"
        width="90%"
      />
      <Skeleton
        variant="text"
        width="40%"
      />
    </div>
  ),
};
