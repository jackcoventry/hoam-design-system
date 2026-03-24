import { Meta, StoryObj } from '@storybook/react-vite';

import { ProductTile } from '@/components/ProductTile';
import Data from '@/mocks/components/ProductTile';

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

export const NewItem = { ...Template, args: { newItem: true } };

export const LowStock = { ...Template, args: { lowStock: true } };

export const LowStockAndNew = { ...Template, args: { newItem: true, lowStock: true } };
