import clsx from 'clsx';

import { Button } from '@/components/Button';
import { QuantitySelector } from '@/components/QuantitySelector';
import { useCurrency } from '@/hooks/useCurrency';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/Basket/Basket.module.css';
import typography from '@/styles/Typography.module.css';

type Thumbnail = {
  src: string;
  alt?: string;
};

export type BasketItemProps = {
  /** Stable identifier for the basket line item. */
  id: string;
  /** Product name shown in the basket. */
  title: string;
  /** Supporting summary text shown beneath the title. */
  summary: string;
  /** Unit price for a single quantity of the item. */
  price: number;
  /** Product thumbnail shown in the basket row. */
  thumbnail: Thumbnail;
  /** Destination for the product link. */
  url: string;
  /** Called when the quantity selector changes value. */
  onChange: (value: number) => void;
  /** Current quantity for the basket item. */
  quantity: number;
};

export type BasketProps = {
  /** Basket items rendered in the table body. */
  items?: BasketItemProps[] | null;
  /** Basket subtotal shown in the footer. */
  total: number;
  /** Optional class applied to the basket table root. */
  className?: string;
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
  const t = useMessages('basket');
  const { formatCurrency } = useCurrency();

  return (
    <tr className={styles.row}>
      <td>
        <a
          href={url}
          className={styles.link}
        >
          <img
            src={thumbnail.src}
            alt={thumbnail.alt ?? ''}
          />
        </a>
      </td>
      <td>
        <div className={styles.content}>
          <a
            href={url}
            className={styles.link}
          >
            <span className={styles.title}>{title}</span>
          </a>
          <span className={styles.summary}>
            {t.price}: {formatCurrency(price)}
          </span>
          <div className={styles.controls}>
            <Button
              size="small"
              title={t.remove}
              icon="trash"
              iconOnly
            />
            <Button
              size="small"
              variant="secondary"
              icon="heart-fill"
              iconOnly
            >
              {t.save}
            </Button>
          </div>
        </div>
      </td>
      <td>
        <div className={styles.quantity}>
          <QuantitySelector
            onChange={onChange}
            value={quantity}
            aria-label={t.columnQuantity}
          />
        </div>
      </td>
      <td>
        <div className={styles.price}>
          <span className={styles.priceLabel}>{t.total}:</span>
          {formatCurrency(totalPrice)}
        </div>
      </td>
    </tr>
  );
}

export function BasketFooter({ total = 0 }: Readonly<{ total: number }>) {
  const t = useMessages('basket');
  const { formatCurrency } = useCurrency();

  return (
    <div className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={typography.heading}>
          {t.subTotal}: {formatCurrency(total)}
        </p>
        <Button
          size="small"
          variant="tertiary"
        >
          {t.checkout}
        </Button>
      </div>
    </div>
  );
}

export function Basket({ items = [], className }: Readonly<BasketProps>) {
  const t = useMessages('basket');

  return (
    <table className={clsx(styles.root, className)}>
      <thead className={styles.thead}>
        <tr className={styles.row}>
          <th scope="col">{t.columnProduct}</th>
          <th scope="col">{t.columnDetails}</th>
          <th scope="col">{t.columnQuantity}</th>
          <th scope="col">{t.columnTotal}</th>
        </tr>
      </thead>
      <tbody className={styles.tbody}>
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
      </tbody>
    </table>
  );
}
