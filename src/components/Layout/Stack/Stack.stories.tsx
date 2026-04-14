import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stack } from '@/components/Layout/Stack';
import { DemoBlock } from '@/stories/components/DemoBlock/DemoBlock';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  args: {
    children: null,
    gap: 'md',
    align: 'stretch',
  },
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--hoam-spacing-md)' }}>
      <Stack gap="xs">
        <DemoBlock>xs / item 1</DemoBlock>
        <DemoBlock>xs / item 2</DemoBlock>
        <DemoBlock>xs / item 3</DemoBlock>
      </Stack>

      <Stack gap="sm">
        <DemoBlock>sm / item 1</DemoBlock>
        <DemoBlock>sm / item 2</DemoBlock>
        <DemoBlock>sm / item 3</DemoBlock>
      </Stack>

      <Stack gap="md">
        <DemoBlock>md / item 1</DemoBlock>
        <DemoBlock>md / item 2</DemoBlock>
        <DemoBlock>md / item 3</DemoBlock>
      </Stack>

      <Stack gap="lg">
        <DemoBlock>lg / item 1</DemoBlock>
        <DemoBlock>lg / item 2</DemoBlock>
        <DemoBlock>lg / item 3</DemoBlock>
      </Stack>

      <Stack gap="xl">
        <DemoBlock>xl / item 1</DemoBlock>
        <DemoBlock>xl / item 2</DemoBlock>
        <DemoBlock>xl / item 3</DemoBlock>
      </Stack>
    </div>
  ),
};
