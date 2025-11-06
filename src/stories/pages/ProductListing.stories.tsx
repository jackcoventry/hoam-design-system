import Pagination from '@/components/Pagination/Pagination';
import ProductTile from '@/components/ProductTile/ProductTile';
import Data from '@/mocks/components/ProductTile.json';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof ProductTile> = {
  title: 'Pages/Product Listing',
  tags: ['autodocs'],
  args: Data,
};
export default meta;

type Story = StoryObj<typeof ProductTile>;

const productArray = [1, 2, 3];

const Template: Story = {
  render: (args) => (
    <div className="container">
      <div className="grid gap-lg mb-2xl">
        {productArray.map((product) => (
          <div
            className="span-12 lg:span-4"
            key={product}
          >
            <ProductTile {...args} />
          </div>
        ))}
      </div>
      <div className="grid gap-lg mb-xl">
        {productArray.map((product) => (
          <div
            className="span-12 lg:span-4"
            key={product}
          >
            <ProductTile {...args} />
          </div>
        ))}
      </div>

      <div className="grid pt-2xl">
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
