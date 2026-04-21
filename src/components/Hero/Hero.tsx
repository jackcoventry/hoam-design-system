import { useCallback } from 'react';
import { Carousel } from '@/components/Carousel';
import { useMessages } from '@/hooks/useMessages';

import { HeroSlide, type HeroSlideProps } from './HeroSlide';

import styles from '@/components/Hero/Hero.module.css';

export type HeroProps = {
  /** Hero slides rendered by the carousel or single-slide fallback. */
  items: HeroSlideProps[];
  /** Accessible label for the hero carousel region. */
  'aria-label'?: string;
};

export function Hero({ items, 'aria-label': ariaLabel }: Readonly<HeroProps>) {
  const t = useMessages('hero');
  const getSlideKey = useCallback((item: HeroSlideProps) => item.id, []);
  const renderSlide = useCallback((item: HeroSlideProps) => <HeroSlide {...item} />, []);

  if (items.length === 0) return null;
  if (items.length === 1) {
    const firstItem = items[0];
    if (!firstItem) return null;

    return <HeroSlide {...firstItem} />;
  }

  return (
    <div className={styles.root}>
      <Carousel
        slides={items}
        getSlideKey={getSlideKey}
        renderSlide={renderSlide}
        pagination
        loop
        autoplay={{ delay: 6000 }}
        aria-label={ariaLabel ?? t.carouselLabel}
        effect="fade"
      />
    </div>
  );
}
