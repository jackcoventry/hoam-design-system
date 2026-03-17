import React, { Children } from 'react';

import { HeroSlider } from '@/components/Hero/HeroSlider';

import '@/components/Common/Dots.css';
import styles from '@/components/Hero/Hero.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/a11y';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export type HeroProps = {
  children: React.ReactNode[];
};

export function Hero({ children, ...rest }: Readonly<HeroProps>) {
  return (
    <div className={styles.root}>
      {Children?.count(children) > 1 ? <HeroSlider {...rest}>{children}</HeroSlider> : children}
    </div>
  );
}
