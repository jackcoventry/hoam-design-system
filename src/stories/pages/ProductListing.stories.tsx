import { Meta } from '@storybook/react-vite';

import { Container, Grid, GridItem, Stack } from '@/components/Layout';
import { Pagination } from '@/components/Pagination';
import { ProductTile } from '@/components/ProductTile';
import { productTile } from '@/mocks/components/ProductTile';
import BaseTemplate from '@/stories/templates/Base';

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
      <Container>
        <Stack gap="xl">
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
    </BaseTemplate>
  ),
};

export const Default = { ...Template, args: {} };
