import { Meta } from '@storybook/react-vite';

import { Container, Grid, GridItem, Section, Stack } from '@/components/Layout';
import { Pagination } from '@/components/Pagination';
import { ProductTile } from '@/components/ProductTile';
import { productTile } from '@/mocks/components/ProductTile';
import BaseTemplate from '@/stories/templates/Base';

import bodyText from '@/styles/BodyText.module.css';

const meta: Meta = {
  title: 'Pages/Product Listing',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: productTile,
};
export default meta;

const productArray = [1, 2, 3];

const Template = {
  render: (args: any) => (
    <BaseTemplate>
      <Section space="2xl">
        <Container>
          <Stack gap="xl">
            <Grid>
              <GridItem>
                <div className={bodyText.root}>
                  <h1>Products</h1>
                  <p>Look at our stuff</p>
                </div>
              </GridItem>
            </Grid>
            <Grid gap="lg">
              {productArray.map((product) => (
                <GridItem
                  span={12}
                  spanLg={4}
                  key={product}
                >
                  <ProductTile {...args} />
                </GridItem>
              ))}
            </Grid>

            <Grid gap="lg">
              {productArray.map((product) => (
                <GridItem
                  span={12}
                  spanLg={4}
                  key={product}
                >
                  <ProductTile {...args} />
                </GridItem>
              ))}
            </Grid>

            <Grid>
              <GridItem span={12}>
                <Pagination
                  pageCount={5}
                  currentPage={2}
                />
              </GridItem>
            </Grid>
          </Stack>
        </Container>
      </Section>
    </BaseTemplate>
  ),
};

export const Default = { ...Template, args: {} };
