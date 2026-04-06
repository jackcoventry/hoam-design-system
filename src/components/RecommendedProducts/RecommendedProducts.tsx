import { Container, Grid, GridItem, Section, Stack } from '@/components/Layout';
import { ProductTile, type ProductTileProps } from '@/components/ProductTile';

import styles from '@/components/RecommendedProducts/RecommendedProducts.module.css';
import bodyText from '@/styles/BodyText.module.css';

export type RecommendedProductsProps = {
  title: string;
  description?: string | undefined;
  products: ProductTileProps[];
};

export function RecommendedProducts({
  title,
  description,
  products,
}: Readonly<RecommendedProductsProps>) {
  return (
    <Section
      space="md"
      className={styles.root}
    >
      <Stack gap="lg">
        {title && (
          <Container>
            <Grid>
              <GridItem span={12}>
                <div className={bodyText.root}>
                  <h2>{title}</h2>
                  {description && <p>{description}</p>}
                </div>
              </GridItem>
            </Grid>
          </Container>
        )}

        <Container>
          <Grid>
            {products?.map((product, index) => {
              const id = `${product.productId}-${index}`;
              return (
                <GridItem
                  span={12}
                  spanLg={4}
                  key={id}
                >
                  <ProductTile {...product} />
                </GridItem>
              );
            })}
          </Grid>
        </Container>
      </Stack>
    </Section>
  );
}
