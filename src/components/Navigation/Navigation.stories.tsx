import { Meta, StoryObj } from '@storybook/react-vite';

import { Navigation, PromoBlock } from '@/components/Navigation';
import NavigationData from '@/mocks/components/Navigation';
import UserNavigationData from '@/mocks/components/UserNavigation';

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};
export default meta;

type Story = StoryObj<typeof Navigation>;

function DefaultStory() {
  return (
    <div style={{ height: '200vh' }}>
      <Navigation
        items={NavigationData}
        userItems={UserNavigationData}
        searchEndpoint=""
        basketEndpoint=""
      />
    </div>
  );
}

const Template: Story = {
  render: DefaultStory,
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
