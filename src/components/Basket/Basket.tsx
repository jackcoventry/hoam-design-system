import { Button } from '@/components/Button';
import { QuantitySelector } from '@/components/QuantitySelector';
import { convertNumberToCurrency } from '@/utils/convertNumberToCurrency';

import styles from '@/components/Basket/Basket.module.css';

type Thumbnail = {
  src: string;
  alt?: string;
};

export type BasketItemProps = {
  id: string;
  title: string;
  summary: string;
  price: number;
  thumbnail: Thumbnail;
  url: string;
  onChange: () => void;
  quantity: number;
};

export type BasketProps = {
  items: BasketItemProps[];
  total: number;
};

export function BasketItem({
  title,
  price,
  thumbnail,
  url,
  onChange,
  quantity,
}: Readonly<BasketItemProps>) {
  const totalPrice = quantity * price;

  return (
    <tr className={styles.row}>
      <td>
        <a
          href={url}
          className={styles.link}
        >
          <img
            src={thumbnail.src}
            alt={thumbnail.alt}
          />
        </a>
      </td>
      <td>
        <div className={styles.content}>
          <a
            href={url}
            className={styles.link}
          >
            <h4 className={styles.title}>{title}</h4>
            <span className={styles.summary}>{convertNumberToCurrency({ value: price })}</span>
          </a>
          <div className={styles.controls}>
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
        <div className={styles.quantity}>
          <QuantitySelector
            onChange={onChange}
            value={quantity}
          />
        </div>
      </td>
      <td>
        <div className={styles.price}>{convertNumberToCurrency({ value: totalPrice })}</div>
      </td>
    </tr>
  );
}

export function BasketFooter({ total = 0 }: Readonly<{ total: number }>) {
  return (
    <tr className={styles.footer}>
      <td>
        <div className={styles.footerContent}>
          <h4 className={styles.footerTitle}>
            Sub-total: {convertNumberToCurrency({ value: total })}
          </h4>
          <Button>Proceed to Checkout</Button>
        </div>
      </td>
    </tr>
  );
}

export function Basket({ items = [] }: Readonly<BasketProps>) {
  return (
    <table className={styles.root}>
      <tr className={styles.row}>
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
