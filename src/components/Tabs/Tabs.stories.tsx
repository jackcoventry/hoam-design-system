import Tabs from '@/components/Tabs/Tabs';
import { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Tabs>;

const Template: Story = {
  render: (args) => <div></div>,
};

export const Default = { ...Template, args: {} };
