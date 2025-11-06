import ProductTile from '@/components/ProductTile/ProductTile';
import Data from '@/mocks/components/ProductTile.json';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof ProductTile> = {
  title: 'Components/ProductTile',
  component: ProductTile,
  tags: ['autodocs'],
  args: Data,
};
export default meta;

type Story = StoryObj<typeof ProductTile>;

const Template: Story = {
  render: (args) => (
    <div style={{ width: '300px' }}>
      <ProductTile {...args} />
    </div>
  ),
};

export const Default = { ...Template, args: {} };

export const OutOfStock = { ...Template, args: { inStock: false } };
