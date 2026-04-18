import React from 'react';
import clsx from 'clsx';
import {
  A11y,
  Autoplay,
  EffectFade,
  Keyboard,
  Navigation,
  Pagination,
  Scrollbar,
} from 'swiper/modules';
import type { SwiperProps } from 'swiper/react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useMessages } from '@/hooks/useMessages';

import styles from './Carousel.module.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';

type CarouselAutoplay =
  | boolean
  | {
      delay?: number;
      disableOnInteraction?: boolean;
    };

type CarouselEffect = 'slide' | 'fade';

export type CarouselProps<T> = {
  slides: T[];
  getSlideKey: (slide: T, index: number) => React.Key;
  renderSlide: (slide: T, index: number) => React.ReactNode;
  className?: string;
  slideClassName?: string;
  navigation?: boolean;
  pagination?: boolean;
  scrollbar?: boolean;
  loop?: boolean;
  centeredSlides?: boolean;
  autoplay?: CarouselAutoplay;
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  breakpoints?: SwiperProps['breakpoints'];
  'aria-label'?: string;
  effect?: CarouselEffect;
  keyboard?: boolean;
  swiperProps?: Omit<
    SwiperProps,
    | 'modules'
    | 'children'
    | 'a11y'
    | 'navigation'
    | 'pagination'
    | 'scrollbar'
    | 'loop'
    | 'centeredSlides'
    | 'slidesPerView'
    | 'spaceBetween'
    | 'breakpoints'
    | 'autoplay'
    | 'effect'
    | 'keyboard'
    | 'fadeEffect'
  >;
};

export function Carousel<T>({
  slides,
  getSlideKey,
  renderSlide,
  className,
  slideClassName,
  navigation = false,
  pagination = false,
  scrollbar = false,
  loop = false,
  centeredSlides = false,
  autoplay = false,
  slidesPerView = 1,
  spaceBetween = 16,
  breakpoints,
  'aria-label': ariaLabel,
  effect = 'slide',
  keyboard = true,
  swiperProps,
}: Readonly<CarouselProps<T>>) {
  const t = useMessages('carousel');
  const modules = [A11y, Keyboard];

  if (navigation) modules.push(Navigation);
  if (pagination) modules.push(Pagination);
  if (scrollbar) modules.push(Scrollbar);
  if (autoplay) modules.push(Autoplay);
  if (effect === 'fade') modules.push(EffectFade);

  const resolvedAutoplay =
    autoplay === true
      ? {
          delay: 5000,
          disableOnInteraction: false,
        }
      : autoplay
        ? {
            delay: autoplay.delay ?? 5000,
            disableOnInteraction: autoplay.disableOnInteraction ?? false,
          }
        : null;

  return (
    <div className={clsx(styles.root, className)}>
      <Swiper
        modules={modules}
        a11y={{
          enabled: true,
          containerMessage: ariaLabel ?? t.label,
        }}
        navigation={navigation}
        pagination={pagination ? { clickable: true } : false}
        scrollbar={scrollbar ? { draggable: true } : false}
        loop={loop}
        centeredSlides={centeredSlides}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        effect={effect}
        {...(keyboard ? { keyboard: { enabled: true } } : {})}
        {...(effect === 'fade' ? { fadeEffect: { crossFade: true } } : {})}
        {...(resolvedAutoplay ? { autoplay: resolvedAutoplay } : {})}
        {...(breakpoints ? { breakpoints } : {})}
        {...swiperProps}
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={getSlideKey(slide, index)}
            className={slideClassName}
          >
            {renderSlide(slide, index)}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
