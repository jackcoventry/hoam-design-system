import { PromoBlockProps } from '@/components/Navigation/types';

import styles from '@/components/Navigation/MainNavigation/PromoBlock/PromoBlock.module.css';

export function PromoBlock({ title, subtitle, href, image }: Readonly<PromoBlockProps>) {
  const Element = href ? 'a' : 'div';
  const interactiveProps = href
    ? {
        href,
        'data-sub-link': true,
        'data-panel-promo': true,
      }
    : {};

  return (
    <Element
      {...interactiveProps}
      className={styles.root}
    >
      {image ? (
        <img
          className={styles.image}
          src={image}
          alt=""
        />
      ) : null}
      <span className={styles.textContent}>
        <h4 className={styles.subtitle}>{subtitle}</h4>
        <h3 className={styles.title}>{title}</h3>
      </span>
    </Element>
  );
}
