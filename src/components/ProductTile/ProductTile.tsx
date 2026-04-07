import clsx from 'clsx';

import { BadgeList, BadgeListItem } from '@/components/BadgeList';
import { Button } from '@/components/Button';
import { Stack } from '@/components/Layout';

import styles from '@/components/ProductTile/ProductTile.module.css';
import utils from '@/styles/Util.module.css';

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

export function ProductTile({
  title,
  productId,
  description,
  price,
  inStock,
  lowStock,
  newItem,
}: Readonly<ProductTileProps>) {
  return (
    <Stack
      gap="sm"
      className={styles.root}
    >
      <div className={styles.imageWrapper}>
        {newItem || lowStock ? (
          <div className={styles.badges}>
            <BadgeList>
              {newItem && <BadgeListItem>NEW</BadgeListItem>}
              {lowStock && <BadgeListItem>LOW STOCK</BadgeListItem>}
            </BadgeList>
          </div>
        ) : null}
        <figure>
          <img
            src="https://images.unsplash.com/photo-1685384338018-1774719d5b69?auto=format&fit=crop&q=80&w=600&h=600"
            alt={title}
            className={styles.image}
          />
        </figure>
        <span className={styles.save}>
          <Button
            size="small"
            variant="secondary"
            icon="heart-fill"
            iconOnly
          >
            Save for later
          </Button>
        </span>
      </div>
      <Stack
        gap="xs"
        className={styles.content}
      >
        <h2 className={styles.title}>
          <a
            href={`#${productId}`}
            className={clsx(styles.link, utils.focus)}
          >
            <span>{title}</span>
          </a>
        </h2>
        {description && <span className={styles.description}>{description}</span>}
        <p>
          <span
            className={styles.price}
            data-price-status="current"
          >
            {formatPrice(price?.saleAmount || price?.amount, price?.currency)}
          </span>
          {!!price?.saleAmount && (
            <span
              className={styles.price}
              data-price-status="previous"
            >
              {formatPrice(price?.amount, price?.currency)}
            </span>
          )}
        </p>
        <Button
          disabled={!inStock}
          className={styles.button}
          size="small"
        >
          {inStock ? 'Add to cart' : 'Out of stock'}
        </Button>
      </Stack>
    </Stack>
  );
}
