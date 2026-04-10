import { useLayoutEffect, useRef, useState } from 'react';

import { Container, Grid, GridItem, Section, Stack } from '@/components/Layout';

import styles from '@/components/LogoCarousel/LogoCarousel.module.css';

type LogoCarouselItem = {
  id: number;
  src: string;
  alt?: string;
};

export type LogoCarouselProps = {
  title?: string;
  items: LogoCarouselItem[];
  pauseOnHover?: boolean;
  'aria-label'?: string;
};

const MIN_REPEAT = 2;

function getRepeatCount(containerWidth: number, sequenceWidth: number): number {
  if (containerWidth <= 0 || sequenceWidth <= 0) {
    return MIN_REPEAT;
  }

  return Math.max(MIN_REPEAT, Math.ceil((containerWidth * 2) / sequenceWidth));
}

export function LogoCarousel({
  title,
  items,
  pauseOnHover = true,
  'aria-label': ariaLabel,
}: Readonly<LogoCarouselProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [repeat, setRepeat] = useState(MIN_REPEAT);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const rail = railRef.current;

    if (!container || !rail) {
      return;
    }

    const firstSequence = rail.querySelector(`.${styles.sequence}`);

    if (!firstSequence) {
      return;
    }

    const images = Array.from(firstSequence.querySelectorAll('img'));

    if (images.length === 0) {
      return;
    }

    let pending = images.length;
    const cleanupFns: Array<() => void> = [];

    const measure = () => {
      const nextRepeat = getRepeatCount(container.clientWidth, firstSequence.scrollWidth);
      setRepeat((current) => (current === nextRepeat ? current : nextRepeat));
    };

    const onImageReady = () => {
      pending -= 1;

      if (pending === 0) {
        measure();
      }
    };

    images.forEach((image) => {
      if (image.complete) {
        onImageReady();
        return;
      }

      const handleLoad = () => onImageReady();
      const handleError = () => onImageReady();

      image.addEventListener('load', handleLoad, { once: true });
      image.addEventListener('error', handleError, { once: true });

      cleanupFns.push(() => {
        image.removeEventListener('load', handleLoad);
        image.removeEventListener('error', handleError);
      });
    });

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, [items]);

  const sequences = Array.from({ length: repeat }, (_, index) => (
    <ul
      key={index}
      className={`${styles.sequence} ${index > 0 ? styles.sequenceClone : ''}`}
      aria-hidden={index > 0 || undefined}
    >
      {items.map((item) => (
        <li
          key={`${index}-${item.id}`}
          className={styles.item}
        >
          <img
            src={item.src}
            alt={item.alt || `Logo ${item.id}`}
            loading="eager"
            decoding="async"
          />
        </li>
      ))}
    </ul>
  ));

  return (
    <Section
      space="2xl"
      className={styles.root}
    >
      <div
        ref={containerRef}
        data-pause={pauseOnHover ? 'true' : 'false'}
        aria-label={ariaLabel}
        className={styles.wrapper}
      >
        <Stack gap="lg">
          <Container>
            {title ? (
              <Grid>
                <GridItem span={12}>
                  <div className={styles.content}>
                    <h2 className={styles.title}>{title}</h2>
                  </div>
                </GridItem>
              </Grid>
            ) : null}
          </Container>

          <div
            ref={railRef}
            className={styles.rail}
          >
            {sequences}
          </div>
        </Stack>
      </div>
    </Section>
  );
}
