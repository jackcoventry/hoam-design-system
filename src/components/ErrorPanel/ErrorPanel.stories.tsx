import { Meta, StoryObj } from '@storybook/react-vite';

import { ErrorPanel } from '@/components/ErrorPanel';
import { Container, Grid, GridItem } from '@/components/Layout';

const meta: Meta<typeof ErrorPanel> = {
  title: 'Components/Error Panel',
  component: ErrorPanel,
  args: {},
  argTypes: {
    returnLabel: {
      table: { disable: true },
    },
    returnUrl: {
      table: { disable: true },
    },
  },
};
export default meta;

type Story = StoryObj<typeof ErrorPanel>;

const Template: Story = {
  render: () => (
    <Container>
      <Grid>
        <GridItem
          span={12}
          spanMd={8}
          startMd={3}
          spanLg={6}
          startLg={4}
        >
          <ErrorPanel message="Relax! Something went wrong!" />
        </GridItem>
      </Grid>
    </Container>
  ),
};

export const Default = { ...Template, args: {} };
