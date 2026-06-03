import clsx from 'clsx';

import { Button } from '@/components/Button';
import { Container, Grid, GridItem, Section, Stack } from '@/components/Layout';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/Banner/Banner.module.css';

export type BannerImage = {
  /** Image source URL. */
  src: string;
  /** Alternative text for the image. */
  alt: string;
};
export type BannerProps = {
  /** Main banner heading. */
  title: string;
  /** Secondary text shown above the title. */
  subtitle: string;
  /** Body copy shown in the banner. */
  text: string;
  /** Optional image shown alongside the content. */
  image: string | undefined;
  /** Call-to-action configuration for the banner. */
  button: {
    url: string;
    text: string | undefined;
  };
  /** Optional class applied to the banner root. */
  className?: string;
};

export function Banner({
  title = '',
  subtitle,
  text,
  image,
  button,
  className,
}: Readonly<BannerProps>) {
  const t = useMessages('global');

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.content}>
        <Container>
          <Grid cols={2}>
            <GridItem
              span={2}
              spanMd={image ? 1 : 2}
              className={styles.textContent}
            >
              <Section>
                <Stack
                  gap="sm"
                  className={styles.centered}
                >
                  <p className={styles.subtitle}>{subtitle}</p>
                  <h1 className={styles.title}>{title}</h1>
                  <p className={styles.text}>{text}</p>
                  <div className={styles.contentLink}>
                    <Button variant="primary">{button?.text || t.readMore}</Button>
                  </div>
                </Stack>
              </Section>
            </GridItem>

            {image && (
              <GridItem
                span={2}
                spanMd={1}
                className={styles.media}
              >
                <img
                  src={image}
                  alt=""
                />
              </GridItem>
            )}
          </Grid>
        </Container>
      </div>
    </div>
  );
}
