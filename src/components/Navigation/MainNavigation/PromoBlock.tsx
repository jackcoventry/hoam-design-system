import styles from '@/components/Navigation/Navigation.module.css';

type Props = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
};

export function PromoBlock({ title, subtitle, href, image = '' }: Readonly<Props>) {
  const Element = href ? 'a' : 'div';
  const interactiveProps = href
    ? {
        href,
        'data-sub-link': true,
      }
    : {};

  return (
    <Element
      {...interactiveProps}
      style={{
        backgroundImage: `url(${image})`,
      }}
      className={styles.promo}
    >
      <h4 className={styles.promoSubtitle}>{subtitle}</h4>
      <h3 className={styles.promoTitle}>{title}</h3>
    </Element>
  );
}
