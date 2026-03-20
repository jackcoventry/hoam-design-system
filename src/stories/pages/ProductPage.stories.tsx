import { Meta } from '@storybook/react-vite';

import { Breadcrumb } from '@/components/Breadcrumb';
import { ImageGallery } from '@/components/ImageGallery';
import { Container, Grid, GridItem } from '@/components/Layout';
import { ProductInfo } from '@/components/ProductInfo';
import { RecommendedProducts } from '@/components/RecommendedProducts';
import BreadcrumbData from '@/mocks/components/Breadcrumb';
import ImageGalleryMockData from '@/mocks/components/ImageGallery';
import ProductInformationMockData from '@/mocks/components/ProductInformation';
import ProductTileData from '@/mocks/components/ProductTile';
import BaseTemplate from '@/stories/templates/Base';

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
        <Container>
          <Grid gap="lg">
            <GridItem span={12}>
              <Breadcrumb items={BreadcrumbData} />
            </GridItem>
          </Grid>
          <Grid gap="lg">
            <GridItem span={12}>
              <Breadcrumb items={BreadcrumbData} />
            </GridItem>
            <GridItem
              span={12}
              spanLg={6}
            >
              <ImageGallery images={ImageGalleryMockData} />
            </GridItem>
            <GridItem
              span={12}
              spanLg={5}
              startLg={8}
            >
              <ProductInfo
                {...args}
                data={ProductInformationMockData}
              />
            </GridItem>
          </Grid>

          <RecommendedProducts
            title="Recommended products"
            products={[ProductTileData, ProductTileData, ProductTileData]}
          />
        </Container>
      </BaseTemplate>
    );
  },
};

export const Default = { ...Template, args: {} };
