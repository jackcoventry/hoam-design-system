import { Meta, StoryObj } from '@storybook/react-vite';
import { JSX } from 'react/jsx-runtime';

import { Banner, BannerProps } from '@/components/Banner';
import { Container, Grid, GridItem } from '@/components/Layout';

const meta: Meta<typeof Banner> = {
  title: 'Components/Banner',
  component: Banner,
  tags: ['autodocs'],
  args: {
    title: 'Test Banner',
    subtitle: 'Test subtitle',
    text: 'Lorem ipsum',
    theme: 'default',
    image: '/hero/range.png',
    button: {
      url: '/',
      text: 'Read more',
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
    theme: {
      control: 'inline-radio',
      options: ['default', 'pink', 'sky'],
    },
    image: {
      control: 'text',
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
