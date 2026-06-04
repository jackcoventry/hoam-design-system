import { Meta, StoryObj } from '@storybook/react-vite';
import { JSX } from 'react/jsx-runtime';

import { Banner, BannerProps } from '@/components/Banner';
import { Container, Grid, GridItem } from '@/components/Layout';

const meta: Meta<typeof Banner> = {
  title: 'Components/Banner',
  component: Banner,
  args: {
    title: 'Fresh coffee, roasted weekly',
    subtitle: 'Seasonal',
    text: 'Explore espresso blends, filter roasts, and brewing essentials selected for balanced everyday cups.',
    image: '/hero/range.png',
    button: {
      url: '/shop/coffee',
      text: 'Shop coffee',
    },
  },
  argTypes: {
    title: {
      control: 'text',
    },
    subtitle: {
      control: 'text',
    },
    text: {
      control: 'text',
    },
    image: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Banner>;

const Template: Story = {
  render: (args: JSX.IntrinsicAttributes & Readonly<BannerProps>) => (
    <Container width="narrow">
      <Grid>
        <GridItem span={12}>
          <Banner {...args} />
        </GridItem>
      </Grid>
    </Container>
  ),
};

export const Default = { ...Template, args: {} };
