import { useMemo } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { SubmitHandler } from 'react-hook-form';

import { SearchFormResult, SearchFormSchemaType } from '@/components/Form';
import { Navigation } from '@/components/Navigation';
import { useAsyncTask } from '@/utils/useAsyncTask';
import BasketData from '@/mocks/components/Basket';
import NavigationData from '@/mocks/components/Navigation';
import SearchFormData from '@/mocks/components/SearchResults';
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
  const search = useMemo(
    () => async () => {
      const response = SearchFormData as SearchFormResult[];
      await new Promise((resolve) => setTimeout(resolve, 600));
      return response;
    },
    []
  );

  const { state, run, data } = useAsyncTask(search);

  const onSubmit: SubmitHandler<SearchFormSchemaType> = async () => {
    await run();
  };

  return (
    <div style={{ height: '200vh' }}>
      <Navigation
        items={NavigationData}
        userItems={UserNavigationData}
        searchSubmit={onSubmit}
        searchData={data}
        searchState={state}
        basketData={BasketData}
      />
    </div>
  );
}

const Template: Story = {
  render: DefaultStory,
};

export const Default = { ...Template, args: {} };
