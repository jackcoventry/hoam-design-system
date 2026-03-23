import { useState } from 'react';
import { Meta } from '@storybook/react-vite';
import { SubmitHandler } from 'react-hook-form';

import { Breadcrumb } from '@/components/Breadcrumb';
import { ImageGallery } from '@/components/ImageGallery';
import { Container, Grid, GridItem } from '@/components/Layout';
import { ProductInfo, type ProductInfoProps } from '@/components/ProductInfo';
import { ProductInformationSchemaType } from '@/components/ProductInfo/ProductInfo';
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

function DefaultStory(args: Readonly<ProductInfoProps>) {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onSubmit: SubmitHandler<ProductInformationSchemaType> = () => {
    setSubmitting(true);

    // Mimic server response
    setTimeout(() => {
      setSubmitting(false);
    }, 2000);
  };

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
              onSubmit={onSubmit}
              isSubmitting={submitting}
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
}

const Template = {
  render: DefaultStory,
};

export const Default = { ...Template, args: {} };
