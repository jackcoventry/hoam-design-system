import type { Meta, StoryObj } from '@storybook/react-vite';

import { Grid } from '@/components/Layout/Grid';
import { GridItem } from '@/components/Layout/GridItem';

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  args: {
    children: null,
    cols: 12,
    gap: 'md',
  },
} satisfies Meta<typeof Grid>;

export default meta;

type Story = StoryObj<typeof meta>;

function Box({
  label,
}: Readonly<{
  label: string;
}>) {
  return (
    <div
      style={{
        border: '1px solid currentColor',
        borderRadius: '0.375rem',
        minHeight: '4rem',
        padding: '0.75rem',
      }}
    >
      {label}
    </div>
  );
}

export const SpanReference: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <Grid>
        <GridItem span={12}>
          <Box label="span=12" />
        </GridItem>
      </Grid>

      <Grid>
        <GridItem span={6}>
          <Box label="span=6" />
        </GridItem>
        <GridItem span={6}>
          <Box label="span=6" />
        </GridItem>
      </Grid>

      <Grid>
        <GridItem span={4}>
          <Box label="span=4" />
        </GridItem>
        <GridItem span={4}>
          <Box label="span=4" />
        </GridItem>
        <GridItem span={4}>
          <Box label="span=4" />
        </GridItem>
      </Grid>
    </div>
  ),
};

export const StartReference: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <Grid>
        <GridItem
          span={6}
          start={4}
        >
          <Box label="start=4 span=6" />
        </GridItem>
      </Grid>

      <Grid>
        <GridItem
          span={4}
          start={5}
        >
          <Box label="start=5 span=4" />
        </GridItem>
      </Grid>

      <Grid>
        <GridItem
          span={3}
          start={10}
        >
          <Box label="start=10 span=3" />
        </GridItem>
      </Grid>
    </div>
  ),
};

export const ResponsiveSpanReference: Story = {
  render: () => (
    <Grid>
      <GridItem
        span={12}
        spanMd={8}
        spanLg={6}
      >
        <Box label="span=12 → spanMd=8 → spanLg=6" />
      </GridItem>
      <GridItem
        span={12}
        spanMd={4}
        spanLg={6}
      >
        <Box label="span=12 → spanMd=4 → spanLg=6" />
      </GridItem>
    </Grid>
  ),
};

export const ResponsiveStartReference: Story = {
  render: () => (
    <Grid>
      <GridItem
        span={12}
        spanLg={6}
        startLg={4}
      >
        <Box label="span=12 → startLg=4 spanLg=6" />
      </GridItem>
    </Grid>
  ),
};
