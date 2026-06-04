import { Meta, StoryObj } from '@storybook/react-vite';
import { SubmitHandler } from 'react-hook-form';

import { SearchFormSchemaType } from '@/components/Form';
import { Navigation } from '@/components/Navigation';
import { navigateToStory } from '@/utils/navigateToStory';
import BasketData from '@/mocks/components/Basket';
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
  },
};
export default meta;

type Story = StoryObj<typeof Navigation>;

function DefaultStory() {
  const onSubmit: SubmitHandler<SearchFormSchemaType> = () => {
    navigateToStory('Pages/Search Results', 'Default');
  };

  return (
    <div style={{ height: '200vh' }}>
      <Navigation
        items={NavigationData}
        userItems={UserNavigationData}
        searchSubmit={onSubmit}
        basketData={BasketData}
      />
    </div>
  );
}

const Template: Story = {
  render: DefaultStory,
};

export const Default = { ...Template, args: {} };
