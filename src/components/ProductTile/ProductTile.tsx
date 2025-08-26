import { Button } from "@/components/Button/Button";
import React from "react";
import "./ProductTile.css";

type ProductPrice = {
  amount: number;
  saleAmount?: number;
  currency: string;
};

type ProductTileProps = {
  title: string;
  productId: string;
  footnote: string;
  price: ProductPrice;
  inStock: boolean;
};

function formatPrice(value = 0, currency = "GBP") {
  const amount = value;
  const result = amount.toLocaleString("en-GB", {
    style: "currency",
    currency: currency,
  });
  return result;
}

function ProductTile({
  title,
  productId,
  footnote,
  price,
  inStock,
}: Readonly<ProductTileProps>) {
  return (
    <div className="hoam-product-tile">
      <figure className="hoam-product-tile__image-wrapper">
        <img
          src={`https://placehold.co/600x400?text=${encodeURIComponent(title)}`}
          alt={title}
          className="hoam-product-tile__image"
        />
      </figure>
      <h2 className="hoam-product-tile__title">
        <a href={`#${productId}`} className="hoam-product-tile__link">
          <span role="text">{title}</span>
        </a>
      </h2>
      {footnote && (
        <span className="hoam-product-tile__footnote">{footnote}</span>
      )}
      <p>
        <span className="hoam-product-tile__price" data-price-status="current">
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
        <Button disabled={!inStock} className="hoam-product-tile__button">
          {inStock ? "Add to cart" : "Out of stock"}
        </Button>
      </div>
    </div>
  );
}

export default ProductTile;
