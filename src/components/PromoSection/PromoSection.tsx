import { Button } from '@/components/Button';
import { Container, Grid, GridItem } from '@/components/Layout';

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
    <GridItem
      span={12}
      spanLg={5}
    >
      <img
        src={imageUrl}
        alt={title}
        className={styles.image}
      />
    </GridItem>
  );

  const contentText = () => (
    <GridItem
      span={12}
      spanLg={6}
    >
      <div className={styles.content}>
        {subtitle && <h3 className={styles.subtitle}>{subtitle}</h3>}
        {title && <h2 className={styles.title}>{title}</h2>}
        {description && <p className={styles.description}>{description}</p>}
        {linkUrl && linkText && <Button className={styles.button}>{linkText}</Button>}
      </div>
    </GridItem>
  );

  return (
    <div className={styles.root}>
      <Container>
        <Grid>
          {alignment === 'left' ? (
            <>
              {contentImage()}
              {/* spacer */}
              <GridItem spanLg={1} />
              {contentText()}
            </>
          ) : (
            <>
              {contentText()}
              {/* spacer */}
              <GridItem spanLg={1} />
              {contentImage()}
            </>
          )}
        </Grid>
      </Container>
    </div>
  );
}
