import { BodyText } from '@/components/Common/BodyText';
import { Container, Grid, GridItem, Section, Stack } from '@/components/Layout';
import { ProductTile, type ProductTileProps } from '@/components/ProductTile';

import styles from '@/components/RecommendedProducts/RecommendedProducts.module.css';

export type RecommendedProductsProps = {
  /** Main section heading. */
  title: string;
  /** Optional supporting copy shown above the products. */
  description?: string | undefined;
  /** Product cards rendered in the recommendation grid. */
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
                <BodyText>
                  <h2>{title}</h2>
                  {description && <p>{description}</p>}
                </BodyText>
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
