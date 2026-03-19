import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stack } from '@/components/Layout/Stack';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {
    children: null,
    gap: 'md',
    align: 'stretch',
  },
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

function Item({
  label,
}: Readonly<{
  label: string;
}>) {
  return (
    <div
      style={{
        border: '1px solid currentColor',
        padding: '0.75rem',
      }}
    >
      {label}
    </div>
  );
}

export const GapReference: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <Stack gap="xs">
        <Item label='gap="xs" / item 1' />
        <Item label='gap="xs" / item 2' />
        <Item label='gap="xs" / item 3' />
      </Stack>

      <Stack gap="sm">
        <Item label='gap="sm" / item 1' />
        <Item label='gap="sm" / item 2' />
        <Item label='gap="sm" / item 3' />
      </Stack>

      <Stack gap="md">
        <Item label='gap="md" / item 1' />
        <Item label='gap="md" / item 2' />
        <Item label='gap="md" / item 3' />
      </Stack>

      <Stack gap="lg">
        <Item label='gap="lg" / item 1' />
        <Item label='gap="lg" / item 2' />
        <Item label='gap="lg" / item 3' />
      </Stack>

      <Stack gap="xl">
        <Item label='gap="xl" / item 1' />
        <Item label='gap="xl" / item 2' />
        <Item label='gap="xl" / item 3' />
      </Stack>
    </div>
  ),
};

export const AlignReference: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <Stack
        gap="md"
        align="start"
      >
        <Item label='align="start"' />
        <Item label='align="start"' />
      </Stack>

      <Stack
        gap="md"
        align="center"
      >
        <Item label='align="center"' />
        <Item label='align="center"' />
      </Stack>

      <Stack
        gap="md"
        align="end"
      >
        <Item label='align="end"' />
        <Item label='align="end"' />
      </Stack>

      <Stack
        gap="md"
        align="stretch"
      >
        <Item label='align="stretch"' />
        <Item label='align="stretch"' />
      </Stack>
    </div>
  ),
};
