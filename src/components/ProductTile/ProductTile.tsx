import { Button } from "@/components/Button/Button";
import React from "react";

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

function ProductTile({
  title,
  productId,
  rating,
  price,
  inStock,
}: ProductTileProps) {
  return (
    <a href={`#${productId}`} className="hoam-product-tile">
      <img
        src={`https://via.placeholder.com/150?text=${encodeURIComponent(title)}`}
        alt={title}
      />
      <h2>{title}</h2>
      <p>Rating: {rating} / 5</p>
      <p>
        Price: {price.currency} {price.saleAmount ?? price.amount}
        {price.saleAmount && (
          <span style={{ textDecoration: "line-through", marginLeft: "8px" }}>
            {price.currency} {price.amount}
          </span>
        )}
      </p>
      <p>{inStock ? "In Stock" : "Out of Stock"}</p>
      <Button disabled={!inStock}>Add to Cart</Button>
    </a>
  );
}

export default ProductTile;
