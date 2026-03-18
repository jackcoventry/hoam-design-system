import type { Meta, StoryObj } from '@storybook/react-vite';

import { Grid } from '@/components/Layout/Grid';
import { GridItem } from '@/components/Layout/GridItem';

const meta = {
  title: 'Layout/GridItem',
  component: GridItem,
  tags: ['autodocs'],
} satisfies Meta<typeof GridItem>;

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

export const SpanExamples: Story = {
  render: () => (
    <Grid>
      <GridItem span={12}>
        <Box>span=12</Box>
      </GridItem>
      <GridItem span={6}>
        <Box>span=6</Box>
      </GridItem>
      <GridItem span={6}>
        <Box>span=6</Box>
      </GridItem>
      <GridItem span={4}>
        <Box>span=4</Box>
      </GridItem>
      <GridItem span={4}>
        <Box>span=4</Box>
      </GridItem>
      <GridItem span={4}>
        <Box>span=4</Box>
      </GridItem>
    </Grid>
  ),
};

export const WithStart: Story = {
  render: () => (
    <Grid>
      <GridItem
        span={12}
        spanLg={6}
        startLg={4}
      >
        <Box>Centered content using startLg=4</Box>
      </GridItem>
    </Grid>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Grid>
      <GridItem
        span={12}
        spanMd={8}
        spanLg={6}
      >
        <Box>Responsive item</Box>
      </GridItem>
      <GridItem
        span={12}
        spanMd={4}
        spanLg={6}
      >
        <Box>Responsive companion</Box>
      </GridItem>
    </Grid>
  ),
};
