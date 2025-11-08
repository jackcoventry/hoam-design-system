import NotificationBar from '@/components/NotificationBar/NotificationBar';
import NotificationBarData from '@/mocks/components/NotificationBar';
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

const Template: Story = {
  render: (args) => <NotificationBar messages={NotificationBarData} />,
};

export const Default = { ...Template, args: {} };
