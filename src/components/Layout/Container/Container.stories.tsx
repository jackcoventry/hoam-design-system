import type { Meta, StoryObj } from '@storybook/react-vite';

import { Container } from '@/components/Layout/Container';

const meta = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
  args: {
    width: 'default',
  },
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

function DemoBlock() {
  return (
    <div
      style={{
        border: '1px dashed currentColor',
        padding: '1rem',
      }}
    >
      Container content
    </div>
  );
}

export const Default: Story = {
  render: (args) => (
    <Container {...args}>
      <DemoBlock />
    </Container>
  ),
};

export const Narrow: Story = {
  args: {
    width: 'narrow',
  },
  render: (args) => (
    <Container {...args}>
      <DemoBlock />
    </Container>
  ),
};

export const Wide: Story = {
  args: {
    width: 'wide',
  },
  render: (args) => (
    <Container {...args}>
      <DemoBlock />
    </Container>
  ),
};

export const Full: Story = {
  args: {
    width: 'full',
  },
  render: (args) => (
    <Container {...args}>
      <DemoBlock />
    </Container>
  ),
};
