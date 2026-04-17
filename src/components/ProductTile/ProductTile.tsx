import { BadgeList, BadgeListItem } from '@/components/BadgeList';
import { Button } from '@/components/Button';
import { Stack } from '@/components/Layout';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/ProductTile/ProductTile.module.css';

type ProductPrice = {
  amount: number;
  saleAmount?: number;
  currency: string;
};

type ProductImage = {
  src: string;
  alt?: string;
};

export type ProductTileProps = {
  title: string;
  productId: string;
  description: string;
  price: ProductPrice;
  inStock: boolean;
  newItem: boolean;
  lowStock: boolean;
  image: ProductImage;
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
  image,
}: Readonly<ProductTileProps>) {
  const t = useMessages('productTile');
  return (
    <Stack
      gap="sm"
      className={styles.root}
    >
      <div className={styles.imageWrapper}>
        {newItem || lowStock ? (
          <div className={styles.badges}>
            <BadgeList>
              {newItem && <BadgeListItem variant="default">{t.new}</BadgeListItem>}
              {lowStock && <BadgeListItem variant="alert">{t.lowStock}</BadgeListItem>}
            </BadgeList>
          </div>
        ) : null}
        <figure>
          <img
            src={image.src}
            alt={image.alt ?? title ?? ''}
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
            {t.save}
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
            className={styles.link}
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
          {inStock ? t.addToCart : t.outOfStock}
        </Button>
      </Stack>
    </Stack>
  );
}
