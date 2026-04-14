import { Meta, StoryObj } from '@storybook/react-vite';

import { Navigation } from '@/components/Navigation';
import NavigationData from '@/mocks/components/Navigation';
import UserNavigationData from '@/mocks/components/UserNavigation';

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
  argTypes: {
    items: {
      table: { disable: true },
    },
    userItems: {
      table: { disable: true },
    },
    searchEndpoint: {
      table: { disable: true },
    },
    basketEndpoint: {
      table: { disable: true },
    },
  },
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
