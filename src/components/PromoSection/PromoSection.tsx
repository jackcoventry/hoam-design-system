import { Button } from '@/components/Button';
import styles from '@/components/PromoSection/PromoSection.module.css';

export type PromoSectionProps = {
  title: string;
  subtitle?: string | undefined;
  description?: string | undefined;
  linkUrl?: string | undefined;
  linkText?: string | undefined;
  imageUrl?: string | undefined;
  alignment?: string | undefined;
};

export function PromoSection({
  title,
  subtitle,
  description,
  linkUrl,
  linkText,
  imageUrl,
  alignment = 'left',
}: Readonly<PromoSectionProps>) {
  const contentImage = () => (
    <div className="span-12 lg:span-5">
      <img
        src={imageUrl}
        alt={title}
        className={styles.image}
      />
    </div>
  );

  const contentText = () => (
    <div className="span-12 lg:span-6">
      <div className={styles.content}>
        {subtitle && <h3 className={styles.subtitle}>{subtitle}</h3>}
        {title && <h2 className={styles.title}>{title}</h2>}
        {description && <p className={styles.description}>{description}</p>}
        {linkUrl && linkText && <Button className={styles.button}>{linkText}</Button>}
      </div>
    </div>
  );

  return (
    <div className={styles.root}>
      <div className="container">
        <div className="grid">
          {alignment === 'left' ? (
            <>
              {contentImage()}
              {/* spacer */}
              <div className="lg:span-1" />
              {contentText()}
            </>
          ) : (
            <>
              {contentText()}
              {/* spacer */}
              <div className="lg:span-1" />
              {contentImage()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
