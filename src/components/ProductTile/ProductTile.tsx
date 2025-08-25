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
  rating: number;
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
  rating,
  price,
  inStock,
}: Readonly<ProductTileProps>) {
  return (
    <div className="hoam-product-tile">
      <img
        src={`https://placehold.co/600x400?text=${encodeURIComponent(title)}`}
        alt={title}
      />
      <h2>
        <a href={`#${productId}`} className="hoam-product-tile__link">
          <span role="text">{title}</span>
        </a>
      </h2>
      <p>Rating: {rating} / 5</p>
      <p>
        Price: {formatPrice(price.saleAmount || price.amount, price.currency)}
        {!!price.saleAmount && (
          <span style={{ textDecoration: "line-through", marginLeft: "8px" }}>
            {formatPrice(price.amount, price.currency)}
          </span>
        )}
      </p>
      <Button disabled={!inStock} className="hoam-product-tile__button">
        {inStock ? "Add to cart" : "Out of stock"}
      </Button>
    </div>
  );
}

export default ProductTile;
