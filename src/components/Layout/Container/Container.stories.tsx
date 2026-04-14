import type { Meta, StoryObj } from '@storybook/react-vite';

import { Container, type ContainerProps } from '@/components/Layout/Container';
import { DemoBlock } from '@/stories/components/DemoBlock/DemoBlock';

const meta = {
  title: 'Layout/Container',
  component: Container,
  args: {
    children: null,
    width: 'default',
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    width: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

function RenderStory(args: ContainerProps) {
  return (
    <Container width={args.width || 'default'}>
      <DemoBlock>{args.width || ''}</DemoBlock>
    </Container>
  );
}

export const Default: Story = {
  render: RenderStory,
};

export const Narrow: Story = {
  render: RenderStory,
  args: {
    width: 'narrow',
  },
};

export const Wide: Story = {
  render: RenderStory,
  args: {
    width: 'wide',
  },
};

export const Full: Story = {
  render: RenderStory,
  args: {
    width: 'full',
  },
};
