import Pagination from '@/components/Pagination/Pagination';
import ProductTile from '@/components/ProductTile/ProductTile';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof ProductTile> = {
  title: 'Pages/ProductListing',
  tags: ['autodocs'],
  args: {
    title: 'Sample Product',
    productId: 'sample-product',
    footnote: 'A short description of the product.',
    price: { amount: 100, saleAmount: 80, currency: 'GBP' },
    inStock: true,
  },
};
export default meta;

type Story = StoryObj<typeof ProductTile>;

const Template: Story = {
  render: (args) => (
    <div className="container">
      <div className="grid gap-lg mb-2xl">
        <div className="span-12 lg:span-4">
          <ProductTile {...args} />
        </div>
        <div className="span-12 lg:span-4">
          <ProductTile {...args} />
        </div>
        <div className="span-12 lg:span-4">
          <ProductTile {...args} />
        </div>
      </div>
      <div className="grid gap-lg mb-xl">
        <div className="span-12 lg:span-4">
          <ProductTile {...args} />
        </div>
        <div className="span-12 lg:span-4">
          <ProductTile {...args} />
        </div>
        <div className="span-12 lg:span-4">
          <ProductTile {...args} />
        </div>
      </div>

      <div className="grid">
        <div className="span-12">
          <Pagination
            pageCount={5}
            currentPage={2}
          />
        </div>
      </div>
    </div>
  ),
};

export const Default = { ...Template, args: {} };
