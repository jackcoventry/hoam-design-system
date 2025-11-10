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

const navItems = [
  {
    id: 'shop',
    label: 'Shop',
    href: '/shop',
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    href: '/subscriptions',
  },
  {
    id: 'our-story',
    label: 'Our Story',
    href: '/our-story',
  },
];

const Template: Story = {
  render: () => (
    <div>
      <Navigation items={navItems} />
    </div>
  ),
};

export const Default = { ...Template, args: {} };
