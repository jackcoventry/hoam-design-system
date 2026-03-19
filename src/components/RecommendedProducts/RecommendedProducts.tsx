import { Container, Grid, GridItem, Section } from '@/components/Layout';
import { ProductTile, type ProductTileProps } from '@/components/ProductTile';

import styles from '@/components/RecommendedProducts/RecommendedProducts.module.css';

export type RecommendedProductsProps = {
  title: string;
  description?: string;
  products: ProductTileProps[];
};

export function RecommendedProducts({
  title,
  description,
  products,
}: Readonly<RecommendedProductsProps>) {
  return (
    <Section
      space="2xl"
      className={styles.root}
    >
      {title && (
        <Container>
          <Grid>
            <GridItem span={12}>
              <h2>{title}</h2>
              {description && <p>{description}</p>}
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
    </Section>
  );
}
