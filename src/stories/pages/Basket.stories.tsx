import { Meta } from '@storybook/react-vite';

import { Basket, BasketFooter } from '@/components/Basket';
import { Container, Grid, GridItem, Section } from '@/components/Layout';
import { RecommendedProducts } from '@/components/RecommendedProducts';
import items from '@/mocks/components/Basket';
import { productTile, productTileLowStock, productTileNew } from '@/mocks/components/ProductTile';
import BaseTemplate from '@/stories/templates/Base';

const meta: Meta = {
  title: 'Pages/Basket',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};
export default meta;

const Template = {
  render: () => {
    const total = items?.reduce((acc, item) => {
      const result = item.price * item.quantity;
      return result + acc;
    }, 0);
    return (
      <BaseTemplate>
        <Section space="2xl">
          <Container>
            <Grid>
              <GridItem span={12}>
                <h1>Your basket</h1>
                <Basket
                  items={items}
                  total={total}
                />
                <BasketFooter total={total} />
              </GridItem>
            </Grid>

            <RecommendedProducts
              title="Recommended products"
              products={[productTile, productTileNew, productTileLowStock]}
            />
          </Container>
        </Section>
      </BaseTemplate>
    );
  },
};

export const Default = { ...Template, args: {} };
