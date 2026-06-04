import { Meta, StoryObj } from '@storybook/react-vite';

import { ProductTile } from '@/components/ProductTile';
import Data from '@/mocks/components/ProductTile';

const meta: Meta<typeof ProductTile> = {
  title: 'Components/ProductTile',
  component: ProductTile,
  args: Data,
};
export default meta;

type Story = StoryObj<typeof ProductTile>;

const Template: Story = {
  render: (args) => (
    <div style={{ width: '350px' }}>
      <ProductTile {...args} />
    </div>
  ),
};

export const Default = { ...Template, args: {} };

export const OutOfStock = { ...Template, args: { inStock: false } };

export const NewItem = { ...Template, args: { newItem: true } };

export const LowStock = { ...Template, args: { lowStock: true } };

export const LowStockAndNew = { ...Template, args: { newItem: true, lowStock: true } };

export const LongContent: Story = {
  render: (args) => (
    <div style={{ width: '400px' }}>
      <ProductTile {...args} />
    </div>
  ),
  args: {
    title: 'Extra long single-origin espresso blend title with multiple tasting notes',
    description:
      'A deliberately long coffee description used to verify the tile keeps tasting notes, origin details, and roast information inside the card at narrow widths.',
  },
};
