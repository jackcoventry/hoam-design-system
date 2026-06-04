import clsx from 'clsx';

import { Button } from '@/components/Button';
import { Container, Grid, GridItem } from '@/components/Layout';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/Hero/HeroSlide.module.css';

export type HeroBackground = {
  src: string;
};

export type HeroImage = {
  /** Image source URL. */
  src: string;
  /** Alternative text for the image. */
  alt: string;
};

export type HeroSlideProps = {
  /** Stable slide identifier used as the carousel key. */
  id: string;
  /** Main slide heading. */
  title: string;
  /** Supporting heading text shown above the title. */
  subtitle: string;
  /** Body copy shown in the slide. */
  text: string;
  /** Optional decorative image background. */
  background?: HeroBackground | undefined;
  /** Optional featured image shown alongside the text content. */
  featuredImage?: HeroImage | undefined;
  /** Call-to-action configuration for the slide. */
  button: {
    url: string;
    text?: string | undefined;
  };
  /** Optional class applied to the slide root. */
  className?: string;
};

export function HeroSlide({
  title = '',
  subtitle,
  text,
  background,
  featuredImage,
  button,
  className,
}: Readonly<HeroSlideProps>) {
  const t = useMessages('global');

  return (
    <div className={clsx(styles.root, className)}>
      {background ? (
        <div className={styles.background}>
          <img
            src={background.src}
            alt=""
            className={styles.backgroundImage}
          />
        </div>
      ) : null}

      <div className={styles.content}>
        <Container>
          <Grid cols={2}>
            {featuredImage && (
              <GridItem
                span={2}
                spanLg={1}
              >
                <img
                  src={featuredImage.src}
                  alt={featuredImage.alt}
                  className={styles.media}
                />
              </GridItem>
            )}

            <GridItem
              span={2}
              spanLg={featuredImage ? 1 : 2}
              className={styles.textContent}
            >
              <p className={styles.subtitle}>{subtitle}</p>
              <h1 className={styles.title}>{title}</h1>
              <p className={styles.text}>{text}</p>
              <div className={styles.contentLink}>
                <Button
                  as="a"
                  href={button.url}
                >
                  {button.text || t.readMore}
                </Button>
              </div>
            </GridItem>
          </Grid>
        </Container>
      </div>
    </div>
  );
}
