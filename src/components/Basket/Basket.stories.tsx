import Basket from '@/components/Basket/Basket';
import { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof Basket> = {
  title: 'Components/Basket',
  component: Basket,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Basket>;

const Template: Story = {
  render: () => (
    <div>
      <Basket />
    </div>
  ),
};

export const Default = { ...Template, args: {} };
