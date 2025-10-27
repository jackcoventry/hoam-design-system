import ImageGallery from '@/components/ImageGallery/ImageGallery';
import ProductInfo from '@/components/ProductInfo/ProductInfo';
import ImageGalleryMockData from '@/mocks/components/ImageGallery.json';
import ProductInformationMockData from '@/mocks/components/ProductInformation.json';
import { Meta, StoryObj } from '@storybook/react';

import React from 'react';

const meta: Meta<typeof ProductInfo> = {
  title: 'Pages/Product Page',
  tags: ['autodocs'],
  args: {
    title: 'Sample Product',
    description: 'This is a sample product used to demonstrate the ProductInfo component.',
    productId: 'sample-product',
    price: { amount: 100, saleAmount: 80, currency: 'GBP' },
    inStock: true,
  },
};
export default meta;

type Story = StoryObj<typeof ProductInfo>;

const Template: Story = {
  render: (args) => {
    return (
      <div className="container">
        <div className="grid gap-lg py-2xl">
          <div className="span-12 lg:span-5">
            <ImageGallery images={ImageGalleryMockData} />
          </div>
          <div className="span-12 lg:start-7 lg:span-6">
            <ProductInfo
              {...args}
              data={ProductInformationMockData}
            />
          </div>
        </div>
      </div>
    );
  },
};

export const Default = { ...Template, args: {} };
