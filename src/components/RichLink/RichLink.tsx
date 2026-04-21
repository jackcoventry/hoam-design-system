import styles from '@/components/RichLink/RichLink.module.css';

export type RichLinkProps = {
  /** Destination for the linked card. */
  href: string;
  /** Image source shown in the card. */
  image: string;
  /** Optional alternative text for the image. */
  imageAlt?: string;
  /** Visible title shown in the card. */
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
