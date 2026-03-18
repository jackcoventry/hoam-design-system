import type { Meta, StoryObj } from '@storybook/react-vite';

import { Grid } from '@/components/Layout/Grid';
import { GridItem } from '@/components/Layout/GridItem';

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  args: {
    cols: 12,
    gap: 'md',
  },
} satisfies Meta<typeof Grid>;

export default meta;

type Story = StoryObj<typeof meta>;

function Box({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      style={{
        border: '1px solid currentColor',
        minHeight: '4rem',
        padding: '1rem',
      }}
    >
      {children}
    </div>
  );
}

export const Basic: Story = {
  render: (args) => (
    <Grid {...args}>
      <GridItem
        span={12}
        spanMd={6}
        spanLg={4}
      >
        <Box>Item 1</Box>
      </GridItem>
      <GridItem
        span={12}
        spanMd={6}
        spanLg={4}
      >
        <Box>Item 2</Box>
      </GridItem>
      <GridItem
        span={12}
        spanMd={6}
        spanLg={4}
      >
        <Box>Item 3</Box>
      </GridItem>
    </Grid>
  ),
};

export const WithDifferentGap: Story = {
  args: {
    gap: 'xl',
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem span={6}>
        <Box>Left</Box>
      </GridItem>
      <GridItem span={6}>
        <Box>Right</Box>
      </GridItem>
    </Grid>
  ),
};

export const MixedSpans: Story = {
  render: (args) => (
    <Grid {...args}>
      <GridItem
        span={12}
        spanLg={8}
      >
        <Box>Main content</Box>
      </GridItem>
      <GridItem
        span={12}
        spanLg={4}
      >
        <Box>Sidebar</Box>
      </GridItem>
    </Grid>
  ),
};
