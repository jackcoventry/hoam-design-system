import ImageGallery from '@/components/ImageGallery/ImageGallery';
import ProductInfo from '@/components/ProductInfo/ProductInfo';
import RecommendedProducts from '@/components/RecommendedProducts/RecommendedProducts';
import ImageGalleryMockData from '@/mocks/components/ImageGallery.json';
import ProductInformationMockData from '@/mocks/components/ProductInformation.json';
import ProductTileData from '@/mocks/components/ProductTile.json';
import BaseTemplate from '@/templates/Base';
import { Meta } from '@storybook/react-vite';

import React from 'react';

const meta: Meta = {
  title: 'Pages/Product Page',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    ...ProductTileData,
    newItem: true,
  },
};

export default meta;

const Template = {
  render: (args) => {
    return (
      <BaseTemplate>
        <div className="container">
          <div className="grid gap-lg py-2xl">
            <div className="span-12 lg:span-6">
              <ImageGallery images={ImageGalleryMockData} />
            </div>
            <div className="span-12 lg:start-8 lg:span-5">
              <ProductInfo
                {...args}
                data={ProductInformationMockData}
              />
            </div>
          </div>

          <RecommendedProducts
            title="Recommended products"
            products={[ProductTileData, ProductTileData, ProductTileData]}
          />
        </div>
      </BaseTemplate>
    );
  },
};

export const Default = { ...Template, args: {} };
