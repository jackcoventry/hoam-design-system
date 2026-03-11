import { Meta } from '@storybook/react-vite';

import { Breadcrumb } from '@/components/Breadcrumb';
import { ImageGallery } from '@/components/ImageGallery';
import { ProductInfo } from '@/components/ProductInfo';
import { RecommendedProducts } from '@/components/RecommendedProducts';
import BaseTemplate from '@/templates/Base';
import BreadcrumbData from '@/mocks/components/Breadcrumb';
import ImageGalleryMockData from '@/mocks/components/ImageGallery';
import ProductInformationMockData from '@/mocks/components/ProductInformation';
import ProductTileData from '@/mocks/components/ProductTile';

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
  render: (args: any) => {
    return (
      <BaseTemplate>
        <div className="container">
          <div className="grid gap-lg py-2xl">
            <div className="span-12">
              <Breadcrumb items={BreadcrumbData} />
            </div>
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
