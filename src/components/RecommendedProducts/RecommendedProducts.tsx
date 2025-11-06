import ProductTile, { ProductTileProps } from '@/components/ProductTile/ProductTile';
import React from 'react';
import './RecommendedProducts.css';

type RecommendedProductsProps = {
  title: string;
  description?: string;
  products: ProductTileProps[];
};

function RecommendedProducts({ title, description, products }: Readonly<RecommendedProductsProps>) {
  return (
    <div className="hoam-recommended-products | py-2xl">
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
          {products?.map((product) => (
            <div
              key={product.productId}
              className="span-12 lg:span-4"
            >
              <ProductTile {...product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecommendedProducts;
