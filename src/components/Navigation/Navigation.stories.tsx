import { Meta, StoryObj } from '@storybook/react-vite';

import { Navigation } from '@/components/Navigation';
import BasketItemData from '@/mocks/components/Basket';
import NavigationData from '@/mocks/components/Navigation';
import UserNavigationData from '@/mocks/components/UserNavigation';

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};
export default meta;

type Story = StoryObj<typeof Navigation>;

const Template: Story = {
  render: (args) => (
    <div style={{ height: '200vh' }}>
      <Navigation
        items={NavigationData}
        userItems={UserNavigationData}
        basketItemData={BasketItemData}
        {...(args.variant === undefined ? {} : { variant: args.variant })}
      />
    </div>
  ),
};

export const Default = { ...Template, args: {} };

export const Fixed = {
  ...Template,
  parameters: {
    layout: 'fullscreen',
  },
  globals: {
    backgrounds: { value: 'dark' },
  },
  args: {
    variant: 'fixed',
  },
};
