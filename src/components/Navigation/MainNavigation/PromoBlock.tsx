import styles from '@/components/Navigation/MainNavigation/PromoBlock.module.css';

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
        'data-top-cyclable': true,
      }
    : {};

  return (
    <Element
      {...interactiveProps}
      className={styles.root}
    >
      <img
        className={styles.image}
        src={image}
        alt=""
      />
      <span className={styles.textContent}>
        <h4 className={styles.subtitle}>{subtitle}</h4>
        <h3 className={styles.title}>{title}</h3>
      </span>
    </Element>
  );
}
