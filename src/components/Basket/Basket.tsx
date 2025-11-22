import QuantitySelector from '@/components/QuantitySelector/QuantitySelector';
import React from 'react';
import './Basket.css';

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
    <tr className="hoam-basket__row">
      <td>
        <a href={url}>
          <img
            src={thumbnail.src}
            alt={thumbnail.alt}
          />
        </a>
      </td>
      <td>
        <a href={url}>
          <h4>{title}</h4>
          <span>{summary}</span>
        </a>
        <div>
          <button>Remove</button>
          <button>Save for later</button>
        </div>
      </td>
      <td>{price}</td>
      <td>
        <QuantitySelector
          onChange={onChange}
          value={quantity}
        />
      </td>
    </tr>
  );
}

type BasketProps = {
  items: BasketItemProps[];
};

function Basket({ items = [] }: Readonly<BasketProps>) {
  return (
    <table className="hoam-basket">
      <tr className="hoam-basket__row">
        <th scope="col">Product</th>
        <th scope="col"></th>
        <th scope="col">Price</th>
        <th scope="col">Quantity</th>
      </tr>
      {items?.map((item) => {
        const { id, title, summary, price, thumbnail, url, onChange, quantity } = item;
        return (
          <BasketItem
            key={id}
            id={id}
            title={title}
            summary={summary}
            price={price}
            thumbnail={thumbnail}
            url={url}
            onChange={onChange}
            quantity={quantity}
          />
        );
      })}
    </table>
  );
}

export default Basket;
