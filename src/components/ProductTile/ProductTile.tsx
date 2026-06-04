import clsx from 'clsx';

import { BadgeList, BadgeListItem } from '@/components/BadgeList';
import { Button } from '@/components/Button';
import { Stack } from '@/components/Layout';
import { useCurrency } from '@/hooks/useCurrency';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/ProductTile/ProductTile.module.css';

type ProductPrice = {
  amount: number;
  saleAmount?: number;
};

type ProductImage = {
  src: string;
  alt?: string;
};

export type ProductTileProps = {
  /** Product title shown in the card. */
  title: string;
  /** Stable product identifier used to build the default link target. */
  productId: string;
  /** Supporting description shown below the title. */
  description: string;
  /** Current and optional comparison pricing. */
  price: ProductPrice;
  /** Disables the add-to-cart action when false. */
  inStock: boolean;
  /** Shows the "new" badge when true. */
  newItem: boolean;
  /** Shows the low-stock badge when true. */
  lowStock: boolean;
  /** Product image displayed at the top of the card. */
  image: ProductImage;
  /** Optional class applied to the product tile root. */
  className?: string;
};

export function ProductTile({
  title,
  productId,
  description,
  price,
  inStock,
  lowStock,
  newItem,
  image,
  className,
}: Readonly<ProductTileProps>) {
  const t = useMessages('productTile');
  const { formatCurrency } = useCurrency();

  return (
    <Stack
      gap="sm"
      className={clsx(styles.root, className)}
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
            {formatCurrency(price?.saleAmount || price?.amount)}
          </span>
          {!!price?.saleAmount && (
            <span
              className={styles.price}
              data-price-status="previous"
            >
              {formatCurrency(price?.amount)}
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
