import { Meta } from '@storybook/react-vite';

import { Basket, BasketFooter } from '@/components/Basket';
import { Container, Grid, GridItem, Section } from '@/components/Layout';
import BaseTemplate from '@/templates/Base';
import items from '@/mocks/components/Basket';

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
              <GridItem
                span={12}
                spanLg={10}
                startLg={2}
              >
                <h1>Your basket</h1>
                <Basket
                  items={items}
                  total={total}
                />
                <BasketFooter total={total} />
              </GridItem>
            </Grid>
          </Container>
        </Section>
      </BaseTemplate>
    );
  },
};

export const Default = { ...Template, args: {} };
