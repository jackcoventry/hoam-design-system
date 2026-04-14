import type { Meta, StoryObj } from '@storybook/react-vite';

import { Container } from '@/components/Layout/Container';

const meta = {
  title: 'Layout/Container',
  component: Container,
  args: {
    children: null,
    width: 'default',
  },
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

function DemoContent({
  label,
}: Readonly<{
  label: string;
}>) {
  return (
    <div
      style={{
        border: '1px dashed currentColor',
        padding: '1rem',
      }}
    >
      {label}
    </div>
  );
}

export const Narrow: Story = {
  render: () => (
    <Container width="narrow">
      <DemoContent label='width="narrow"' />
    </Container>
  ),
};

export const Default: Story = {
  render: () => (
    <Container width="default">
      <DemoContent label='width="default"' />
    </Container>
  ),
};

export const Wide: Story = {
  render: () => (
    <Container width="wide">
      <DemoContent label='width="wide"' />
    </Container>
  ),
};

export const Full: Story = {
  render: () => (
    <Container width="full">
      <DemoContent label='width="full"' />
    </Container>
  ),
};
