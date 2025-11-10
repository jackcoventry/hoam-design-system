import Navigation from '@/components/Navigation/Navigation';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Navigation>;

const Template: Story = {
  render: () => (
    <div>
      <Navigation items={[]} />
    </div>
  ),
};

export const Default = { ...Template, args: {} };
