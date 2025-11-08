import NotificationBar from '@/components/NotificationBar/NotificationBar';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof NotificationBar> = {
  title: 'Components/Notification Bar',
  component: NotificationBar,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof NotificationBar>;

const messages = [
  `Sale now on! — <a href="/sale">Take me there</a>.`,
  `Free shipping on orders over £50!`,
  `Same day shipping if ordered place before 5pm!`,
];
const Template: Story = {
  render: (args) => <NotificationBar messages={messages} />,
};

export const Default = { ...Template, args: {} };
