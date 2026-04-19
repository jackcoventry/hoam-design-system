import { Meta } from '@storybook/react-vite';

import { Banner, type BannerProps } from '@/components/Banner';
import { Button } from '@/components/Button';
import { Container, Grid, GridItem, Section, Stack } from '@/components/Layout';
import { ProductTile, type ProductTileProps } from '@/components/ProductTile';
import { productTile } from '@/mocks/components/ProductTile';
import BaseTemplate from '@/stories/templates/Base';

import typography from '@/styles/Typography.module.css';
import utils from '@/styles/Util.module.css';

const meta: Meta<ProductTileProps> = {
  title: 'Pages/Product Landing',
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    ...productTile,
  },
};
export default meta;

const productArray = [1, 2, 3];
const bannerMock = {
  title: 'Test Banner',
  subtitle: 'Test subtitle',
  text: 'Lorem ipsum',
  image: '/hero/range.png',
  button: {
    url: '/',
    text: 'Read more',
  },
} satisfies BannerProps;

const Template = {
  render: (args: ProductTileProps) => (
    <BaseTemplate>
      <Section space="2xl">
        <Container>
          <Stack gap="xl">
            <Grid>
              <GridItem>
                <Banner {...bannerMock} />
              </GridItem>
            </Grid>
            <Grid gap="lg">
              <GridItem span={12}>
                <div className={utils.justifyBetween}>
                  <h2 className={typography.heading}>Featured products</h2>
                  <Button
                    as="a"
                    href="/"
                    size="small"
                    icon="arrow-right"
                  >
                    See all
                  </Button>
                </div>
              </GridItem>

              {productArray.map((product) => (
                <GridItem
                  span={12}
                  spanLg={4}
                  key={product}
                >
                  <ProductTile {...productTile} />
                </GridItem>
              ))}
            </Grid>

            <Grid gap="lg">
              <GridItem span={12}>
                <div className={utils.justifyBetween}>
                  <h2 className={typography.heading}>New products</h2>
                  <Button
                    as="a"
                    href="/"
                    size="small"
                    icon="arrow-right"
                  >
                    See all
                  </Button>
                </div>
              </GridItem>

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
          </Stack>
        </Container>
      </Section>
    </BaseTemplate>
  ),
};

export const Default = { ...Template, args: {} };
