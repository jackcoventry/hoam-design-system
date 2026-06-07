import clsx from 'clsx';

import { Button } from '@/components/Button';
import { Container, Grid, GridItem, Stack } from '@/components/Layout';

import styles from '@/components/PromoSection/PromoSection.module.css';

export type PromoSectionProps = {
  /** Main section heading. */
  title: string;
  /** Optional eyebrow or supporting heading text. */
  subtitle?: string | undefined;
  /** Optional body copy for the promo section. */
  description?: string | undefined;
  /** Optional destination for the call-to-action button. */
  linkUrl?: string | undefined;
  /** Optional call-to-action label. */
  linkText?: string | undefined;
  /** Optional image shown alongside the content. */
  imageUrl?: string | undefined;
  /** Controls whether the image appears on the left or right. */
  alignment?: 'left' | 'right' | undefined;
  /** Optional class applied to the promo section root. */
  className?: string;
};

export function PromoSection({
  title,
  subtitle,
  description,
  linkUrl,
  linkText,
  imageUrl,
  alignment = 'left',
  className,
}: Readonly<PromoSectionProps>) {
  const imageBlock = imageUrl ? (
    <GridItem
      span={12}
      spanMd={6}
      startMd={4}
      spanLg={5}
      startLg={1}
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
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
        {linkUrl && linkText ? (
          <Button
            as="a"
            href={linkUrl}
            className={styles.button}
            variant="tertiary"
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
    <div className={clsx(styles.root, className)}>
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
