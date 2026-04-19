import { Button } from '@/components/Button';
import { Container, Grid, GridItem } from '@/components/Layout';
import { useMessages } from '@/hooks/useMessages';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

import styles from '@/components/Hero/HeroSlide.module.css';

export type HeroBackground =
  | {
      kind: 'image';
      src: string;
    }
  | {
      kind: 'video';
      src: string;
    };

export type HeroImage = {
  src: string;
  alt: string;
};

export type HeroSlideProps = {
  id: string;
  title: string;
  subtitle: string;
  text: string;
  background?: HeroBackground | undefined;
  featuredImage?: HeroImage | undefined;
  button: {
    url: string;
    text?: string | undefined;
  };
};

export function HeroSlide({
  title = '',
  subtitle,
  text,
  background,
  featuredImage,
  button,
}: Readonly<HeroSlideProps>) {
  const t = useMessages('global');
  const prefersReducedMotion = usePrefersReducedMotion();
  const videoProps = {
    muted: true,
    className: styles.video,
    ...(!prefersReducedMotion && { autoPlay: true, loop: true }),
  };

  return (
    <div className={styles.root}>
      {background ? (
        <div className={styles.background}>
          {background.kind === 'image' ? (
            <img
              src={background.src}
              alt=""
              className={styles.backgroundImage}
            />
          ) : (
            <video {...videoProps}>
              <track kind="captions" />
              <source
                src={background.src}
                type="video/mp4"
              />
            </video>
          )}
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
                <Button variant="primary">{button?.text || t.readMore}</Button>
              </div>
            </GridItem>
          </Grid>
        </Container>
      </div>
    </div>
  );
}
