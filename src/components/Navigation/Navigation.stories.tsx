import Navigation from '@/components/Navigation/Navigation';
import NavigationData from '@/mocks/components/Navigation.json';
import UserNavigationData from '@/mocks/components/UserNavigation.json';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

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
  render: () => (
    <div>
      <Navigation
        items={NavigationData}
        userItems={UserNavigationData}
      />
    </div>
  ),
};

export const Default = { ...Template, args: {} };

export const Transparent = {
  ...Template,
  parameters: {
    layout: 'fullscreen',
  },
  globals: {
    backgrounds: { value: 'dark' },
  },
  args: {},
};
