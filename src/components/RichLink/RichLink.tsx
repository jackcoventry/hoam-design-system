import styles from '@/components/RichLink/RichLink.module.css';

export type RichLinkProps = {
  href: string;
  image: string;
  imageAlt?: string;
  title: string;
};

export function RichLink({ href, title, image, imageAlt = '' }: Readonly<RichLinkProps>) {
  return (
    <a
      href={href}
      className={styles.root}
    >
      <span className={styles.text}>{title}</span>
      <img
        src={image}
        alt={imageAlt}
        className={styles.image}
      />
    </a>
  );
}
