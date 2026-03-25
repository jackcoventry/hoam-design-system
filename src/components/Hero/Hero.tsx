import { Carousel } from '@/components/Carousel';

import { HeroSlide, type HeroSlideProps } from './HeroSlide';

import styles from '@/components/Hero/Hero.module.css';

export type HeroProps = {
  items: HeroSlideProps[];
};

export function Hero({ items }: Readonly<HeroProps>) {
  return (
    <div className={styles.root}>
      <Carousel
        slides={items}
        getSlideKey={(item) => item.id}
        renderSlide={(item) => <HeroSlide {...item} />}
        navigation
        pagination
        loop
        autoplay={{ delay: 6000 }}
        ariaLabel="Hero carousel"
      />
    </div>
  );
}
