import { useState } from 'react';
import { Meta } from '@storybook/react-vite';
import { SubmitHandler } from 'react-hook-form';

import { Breadcrumb } from '@/components/Breadcrumb';
import { ImageGallery } from '@/components/ImageGallery';
import { Container, Grid, GridItem, Section, Stack } from '@/components/Layout';
import { ProductInfo, type ProductInfoProps } from '@/components/ProductInfo';
import { ProductInformationSchemaType } from '@/components/ProductInfo/ProductInfo';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { BREAKPOINTS } from '@/styles/breakpoints';
import BreadcrumbData from '@/mocks/components/Breadcrumb';
import ImageGalleryMockData from '@/mocks/components/ImageGallery';
import ProductInformationMockData from '@/mocks/components/ProductInformation';
import { productTile } from '@/mocks/components/ProductTile';
import BaseTemplate from '@/stories/templates/Base';

const meta: Meta = {
  title: 'Pages/Product Page',
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    ...productTile,
    newItem: true,
  },
  argTypes: {
    image: {
      table: { disable: true },
    },
    socialLinks: {
      table: { disable: true },
    },
  },
};

export default meta;

function DefaultStory(args: Readonly<ProductInfoProps>) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.UP.MD})`);

  const onSubmit: SubmitHandler<ProductInformationSchemaType> = () => {
    setSubmitting(true);

    // Mimic server response time
    setTimeout(() => {
      setSubmitting(false);
    }, 2000);
  };

  return (
    <BaseTemplate>
      <Section>
        <Container>
          <Stack>
            <Grid gap="lg">
              <GridItem span={12}>
                <Breadcrumb items={BreadcrumbData} />
              </GridItem>
            </Grid>
            <Grid gap="lg">
              <GridItem
                span={12}
                spanLg={6}
                style={{
                  order: isDesktop ? 0 : 1,
                }}
              >
                <ImageGallery images={ImageGalleryMockData} />
              </GridItem>
              <GridItem
                span={12}
                spanLg={6}
                startLg={8}
                style={{
                  order: isDesktop ? 1 : 0,
                }}
              >
                <ProductInfo
                  {...args}
                  data={ProductInformationMockData}
                  onSubmit={onSubmit}
                  isSubmitting={submitting}
                />
              </GridItem>
            </Grid>
          </Stack>
        </Container>
      </Section>
    </BaseTemplate>
  );
}

const Template = {
  render: DefaultStory,
};

export const Default = { ...Template, args: {} };
