import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stack } from '@/components/Layout/Stack';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {
    gap: 'md',
    align: 'stretch',
  },
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

function Item({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      style={{
        border: '1px solid currentColor',
        padding: '0.75rem',
      }}
    >
      {children}
    </div>
  );
}

export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <Item>Heading</Item>
      <Item>Description</Item>
      <Item>Button</Item>
    </Stack>
  ),
};

export const SmallGap: Story = {
  args: {
    gap: 'sm',
  },
  render: (args) => (
    <Stack {...args}>
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Stack>
  ),
};

export const LargeGap: Story = {
  args: {
    gap: 'xl',
  },
  render: (args) => (
    <Stack {...args}>
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Stack>
  ),
};

export const CenterAligned: Story = {
  args: {
    align: 'center',
  },
  render: (args) => (
    <Stack {...args}>
      <Item>Short</Item>
      <Item>Medium width content</Item>
      <Item>Another item</Item>
    </Stack>
  ),
};
