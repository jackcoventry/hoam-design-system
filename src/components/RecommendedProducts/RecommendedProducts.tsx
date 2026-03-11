import { ProductTile, type ProductTileProps } from '@/components/ProductTile';

import styles from '@/components/RecommendedProducts/RecommendedProducts.module.css';
import clsx from 'clsx';

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
    <div className={clsx(styles.root, 'py-2xl')}>
      {title && (
        <div className="container">
          <div className="grid gap-lg mb-xl">
            <div className="span-12">
              <h2>{title}</h2>
              {description && <p>{description}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="grid gap-lg">
          {products?.map((product, index) => {
            const id = `${product.productId}-${index}`;
            return (
              <div
                key={id}
                className="span-12 lg:span-4"
              >
                <ProductTile {...product} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
