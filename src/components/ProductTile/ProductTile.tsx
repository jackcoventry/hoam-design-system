import BadgeList, { BadgeListItem } from '@/components/BadgeList/BadgeList';
import { Button } from '@/components/Button/Button';
import React from 'react';
import './ProductTile.css';

type ProductPrice = {
  amount: number;
  saleAmount?: number;
  currency: string;
};

export type ProductTileProps = {
  title: string;
  productId: string;
  description: string;
  price: ProductPrice;
  inStock: boolean;
  newItem: boolean;
  lowStock: boolean;
};

function formatPrice(value = 0, currency = 'GBP') {
  const amount = value;
  const result = amount.toLocaleString('en-GB', {
    style: 'currency',
    currency: currency,
  });
  return result;
}

function ProductTile({
  title,
  productId,
  description,
  price,
  inStock,
  lowStock,
  newItem,
}: Readonly<ProductTileProps>) {
  return (
    <div className="hoam-product-tile">
      <div className="hoam-product-tile__image-wrapper">
        {newItem || lowStock ? (
          <div className="hoam-product-tile__badges">
            <BadgeList>{newItem && <BadgeListItem>NEW</BadgeListItem>}</BadgeList>
          </div>
        ) : null}
        <figure>
          <img
            src="https://images.unsplash.com/photo-1685384338018-1774719d5b69?auto=format&fit=crop&q=80&w=600&h=600"
            alt={title}
            className="hoam-product-tile__image"
          />
        </figure>
      </div>
      <h2 className="hoam-product-tile__title">
        <a
          href={`#${productId}`}
          className="hoam-product-tile__link"
        >
          <span role="text">{title}</span>
        </a>
      </h2>
      {description && <span className="hoam-product-tile__description">{description}</span>}
      <p>
        <span
          className="hoam-product-tile__price"
          data-price-status="current"
        >
          {formatPrice(price?.saleAmount || price?.amount, price?.currency)}
        </span>
        {!!price?.saleAmount && (
          <span
            className="hoam-product-tile__price"
            data-price-status="previous"
          >
            {formatPrice(price?.amount, price?.currency)}
          </span>
        )}
      </p>
      <div>
        <Button
          disabled={!inStock}
          className="hoam-product-tile__button"
        >
          {inStock ? 'Add to cart' : 'Out of stock'}
        </Button>
      </div>
    </div>
  );
}

export default ProductTile;
