import React from "react";
import "./ProductInfo.css";

type ProductInfoProps = {
  title: string;
  productId: string;
  footnote: string;
  inStock: boolean;
};

function ProductInfo({
  title,
  productId,
  footnote,
  inStock,
}: Readonly<ProductInfoProps>) {
  return (
    <div className="hoam-product-info">
      <h1 className="hoam-product-info__title">{title}</h1>
      {/* TODO: Use form for add to cart + controls */}
    </div>
  );
}

export default ProductInfo;
