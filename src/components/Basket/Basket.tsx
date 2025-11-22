import QuantitySelector from '@/components/QuantitySelector/QuantitySelector';
import React from 'react';

type Thumbnail = {
  src: string;
  alt?: string;
};

type BasketItemProps = {
  id: string;
  title: string;
  summary: string;
  price: number;
  thumbnail: Thumbnail;
  url: string;
  onChange: () => void;
  quantity: number;
};

function BasketItem({
  title,
  summary,
  price,
  thumbnail,
  url,
  onChange,
  quantity,
}: Readonly<BasketItemProps>) {
  return (
    <a
      href={url}
      className="hoam-basket-item"
    >
      <img
        src={thumbnail.src}
        alt={thumbnail.alt}
      />
      <div>
        <h4>{title}</h4>
        <span>{summary}</span>
      </div>
      <div>{price}</div>
      <div>
        <QuantitySelector
          onChange={onChange}
          value={quantity}
        />
      </div>
    </a>
  );
}

function Basket() {
  return <div></div>;
}

export default Basket;
