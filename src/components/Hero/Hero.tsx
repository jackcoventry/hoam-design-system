import { Carousel } from '@/components/Carousel';

import { HeroSlide, type HeroSlideProps } from './HeroSlide';

import styles from '@/components/Hero/Hero.module.css';

export type HeroProps = {
  items: HeroSlideProps[];
  'aria-label'?: string;
};

export function Hero({ items, 'aria-label': ariaLabel = 'Hero carousel' }: Readonly<HeroProps>) {
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
        getSlideKey={(item) => item.id}
        renderSlide={(item) => <HeroSlide {...item} />}
        pagination
        loop
        autoplay={{ delay: 6000 }}
        aria-label={ariaLabel}
        effect="fade"
      />
    </div>
  );
}
