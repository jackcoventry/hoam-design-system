import { Button } from '@/components/Button/Button';
import QuantitySelector from '@/components/QuantitySelector/QuantitySelector';
import { convertNumberToCurrency } from '@/utils/convertNumberToCurrency';
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
  const totalPrice = quantity * price;

  return (
    <tr className="hoam-basket__row">
      <td>
        <a
          href={url}
          className="hoam-basket__link"
        >
          <img
            src={thumbnail.src}
            alt={thumbnail.alt}
          />
        </a>
      </td>
      <td>
        <div className="hoam-basket__content">
          <a
            href={url}
            className="hoam-basket__link"
          >
            <h4 className="hoam-basket__title">{title}</h4>
            <span className="hoam-basket__summary">
              {convertNumberToCurrency({ value: price })}
            </span>
          </a>
          <div className="hoam-basket__controls">
            <Button
              size="small"
              title="Remove item from basket"
              icon="trash"
              iconOnly
            />
            <Button
              size="small"
              variant="secondary"
            >
              Save for later
            </Button>
          </div>
        </div>
      </td>
      <td>
        <div className="hoam-basket__quantity">
          <QuantitySelector
            onChange={onChange}
            value={quantity}
          />
        </div>
      </td>
      <td>
        <div className="hoam-basket__price">{convertNumberToCurrency({ value: totalPrice })}</div>
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
        <th scope="col">Quantity</th>
        <th scope="col">Price</th>
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
