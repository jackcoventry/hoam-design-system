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
  /** Slide data rendered by the carousel. */
  slides: T[];
  /** Returns a stable React key for each slide. */
  getSlideKey: (slide: T, index: number) => React.Key;
  /** Renders the contents of each slide. */
  renderSlide: (slide: T, index: number) => React.ReactNode;
  /** Adds custom class names to the carousel wrapper. */
  className?: string;
  /** Adds custom class names to each `SwiperSlide`. */
  slideClassName?: string;
  /** Enables previous/next navigation controls. */
  navigation?: boolean;
  /** Enables pagination bullets. */
  pagination?: boolean;
  /** Enables the draggable scrollbar. */
  scrollbar?: boolean;
  /** Repeats slides infinitely. */
  loop?: boolean;
  /** Centers the active slide within the track. */
  centeredSlides?: boolean;
  /** Enables autoplay with defaults or a custom Swiper autoplay config. */
  autoplay?: CarouselAutoplay;
  /** Number of slides shown at once, or `'auto'` for intrinsic widths. */
  slidesPerView?: number | 'auto';
  /** Spacing between slides in pixels. */
  spaceBetween?: number;
  /** Responsive Swiper breakpoint configuration. */
  breakpoints?: SwiperProps['breakpoints'];
  /** Accessible label used for the Swiper container message. */
  'aria-label'?: string;
  /** Visual transition between slides. */
  effect?: CarouselEffect;
  /** Enables keyboard interaction. */
  keyboard?: boolean;
  /** Additional Swiper props, excluding the options controlled by this wrapper. */
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
