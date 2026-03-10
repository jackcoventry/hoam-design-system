import { Button } from '@/components/Button/Button';
import styles from '@/components/Hero/Hero.module.css';
import { HeroSlide, HeroSlideProps } from '@/components/Hero/HeroSlide';
import React, { isValidElement, ReactElement, ReactNode, useEffect, useRef } from 'react';
import type { Swiper as SwiperCore } from 'swiper';
import { A11y, Autoplay, EffectFade, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type HeroSliderProps = {
  delay?: number;
  effect?: string;
  children: React.ReactNode;
};

function isHeroSlideElement(child: ReactNode): child is ReactElement<HeroSlideProps> {
  return isValidElement(child) && child.type === HeroSlide;
}

export function HeroSlider({
  delay = 2500,
  effect = 'slide',
  children,
}: Readonly<HeroSliderProps>) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const pagRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperCore | null>(null);

  const handleBeforeInit = (swiper: SwiperCore) => {
    swiperRef.current = swiper;

    // Attach refs so Navigation/Pagination can initialize with them
    swiper.params.navigation = {
      ...(swiper.params.navigation as object),
      prevEl: prevRef.current,
      nextEl: nextRef.current,
    };

    swiper.params.pagination = {
      ...(swiper.params.pagination as object),
      el: pagRef.current,
      clickable: true,
      bulletClass: styles.bullet || '',
      bulletActiveClass: styles.bulletActive || '',
      // Has to return string
      renderBullet: (index, className) =>
        `<button type="button" class="${className}" aria-label="Go to slide ${index + 1}">
           <span class="styles.bullet-inner">${index + 1}</span>
         </button>`,
    };
  };

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    // (Re)bind navigation if needed
    if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation?.destroy();
      swiper.navigation?.init();
      swiper.navigation?.update();
    }

    // (Re)bind pagination if needed
    if (swiper.params.pagination && typeof swiper.params.pagination !== 'boolean') {
      swiper.params.pagination.el = pagRef.current;
      swiper.pagination?.destroy();
      swiper.pagination?.init();
      swiper.pagination?.update();
    }
  }, []);

  return (
    <>
      <Button
        ref={prevRef}
        type="button"
        className={styles.navBtn}
        data-direction="left"
        aria-label="Previous slide"
        icon="arrow-left"
        iconOnly
      />
      <Button
        ref={nextRef}
        type="button"
        className={styles.navBtn}
        data-direction="right"
        aria-label="Next slide"
        icon="arrow-right"
        iconOnly
      />
      <div className={styles.controls}>
        <div
          ref={pagRef}
          className="hoam-dots"
          aria-label="Slide pagination"
        />
      </div>
      <Swiper
        centeredSlides={false}
        loop={true}
        effect={effect}
        autoplay={{
          delay,
          disableOnInteraction: true,
        }}
        keyboard={{
          enabled: true,
        }}
        modules={[Autoplay, Pagination, Navigation, Keyboard, A11y, EffectFade]}
        onBeforeInit={handleBeforeInit}
        onSwiper={(s) => (swiperRef.current = s)}
      >
        {React.Children.map(children, (child) => {
          if (isHeroSlideElement(child)) {
            return <SwiperSlide>{child}</SwiperSlide>;
          } else {
            console.error('Hero component only accepts child of type HeroSlide');
          }
        })}
      </Swiper>
    </>
  );
}
