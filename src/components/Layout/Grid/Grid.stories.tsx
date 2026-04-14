import type { Meta, StoryObj } from '@storybook/react-vite';

import { Grid } from '@/components/Layout/Grid';
import { GridItem } from '@/components/Layout/GridItem';
import { DemoBlock } from '@/stories/components/DemoBlock/DemoBlock';

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

export const Default: Story = {
  render: () => {
    const DEMO_1 = 1;
    const DEMO_2 = 2;
    const DEMO_3 = 3;
    const DEMO_4 = 4;
    const DEMO_5 = 12;
    return (
      <div style={{ display: 'grid', gap: 'var(--hoam-spacing-md)' }}>
        <Grid>
          {[...new Array(DEMO_1).keys()].map((item) => (
            <GridItem
              key={item}
              span={12}
            >
              <DemoBlock>Column</DemoBlock>
            </GridItem>
          ))}
        </Grid>

        <Grid>
          {[...new Array(DEMO_2).keys()].map((item) => (
            <GridItem
              key={item}
              span={12}
              spanLg={6}
            >
              <DemoBlock>Column</DemoBlock>
            </GridItem>
          ))}
        </Grid>

        <Grid>
          {[...new Array(DEMO_3).keys()].map((item) => (
            <GridItem
              span={12}
              spanLg={4}
              key={item}
            >
              <DemoBlock>Column</DemoBlock>
            </GridItem>
          ))}
        </Grid>

        <Grid>
          {[...new Array(DEMO_4).keys()].map((item) => (
            <GridItem
              key={item}
              span={12}
              spanMd={6}
              spanLg={3}
            >
              <DemoBlock>Column</DemoBlock>
            </GridItem>
          ))}
        </Grid>

        <Grid>
          {[...new Array(DEMO_5).keys()].map((item) => (
            <GridItem
              key={item}
              span={6}
              spanSm={4}
              spanMd={3}
              spanLg={2}
              spanXl={1}
            >
              <DemoBlock>Column</DemoBlock>
            </GridItem>
          ))}
        </Grid>
      </div>
    );
  },
};

export const Start: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--hoam-spacing-md)' }}>
      <Grid>
        <GridItem
          span={12}
          start={1}
          spanMd={6}
          startMd={4}
        >
          <DemoBlock>Column</DemoBlock>
        </GridItem>
      </Grid>

      <Grid>
        <GridItem
          span={6}
          start={7}
          spanMd={4}
          startMd={5}
        >
          <DemoBlock>Column</DemoBlock>
        </GridItem>
      </Grid>

      <Grid>
        <GridItem
          span={6}
          start={1}
          spanMd={3}
          startMd={10}
        >
          <DemoBlock>Column</DemoBlock>
        </GridItem>
      </Grid>
    </div>
  ),
};
