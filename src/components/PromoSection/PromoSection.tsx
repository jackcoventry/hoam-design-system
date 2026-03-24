import { Button } from '@/components/Button';
import { Container, Grid, GridItem, Stack } from '@/components/Layout';

import styles from '@/components/PromoSection/PromoSection.module.css';

export type PromoSectionProps = {
  title: string;
  subtitle?: string | undefined;
  description?: string | undefined;
  linkUrl?: string | undefined;
  linkText?: string | undefined;
  imageUrl?: string | undefined;
  alignment?: 'left' | 'right' | undefined;
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
  const imageBlock = imageUrl ? (
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
  ) : null;

  const textBlock = (
    <GridItem
      span={12}
      spanLg={6}
    >
      <Stack
        gap="md"
        className={styles.content}
      >
        {subtitle ? <h3 className={styles.subtitle}>{subtitle}</h3> : null}
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
        {linkUrl && linkText ? (
          <Button
            as="a"
            href={linkUrl}
            className={styles.button}
          >
            {linkText}
          </Button>
        ) : null}
      </Stack>
    </GridItem>
  );

  const spacer = (
    <GridItem
      spanLg={1}
      aria-hidden="true"
    />
  );

  return (
    <div className={styles.root}>
      <Container>
        <Grid>
          {alignment === 'left' ? (
            <>
              {imageBlock}
              {imageBlock ? spacer : null}
              {textBlock}
            </>
          ) : (
            <>
              {textBlock}
              {imageBlock ? spacer : null}
              {imageBlock}
            </>
          )}
        </Grid>
      </Container>
    </div>
  );
}
