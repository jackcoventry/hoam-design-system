import { Button } from '@/components/Button/Button';
import React, { useEffect, useRef } from 'react';
import type { Swiper as SwiperCore } from 'swiper';
import { A11y, Autoplay, EffectFade, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/a11y';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '@/components/Common/Dots.css';
import './Hero.css';

type HeroSlideProps = {
  title: string;
  subtitle: string;
  text: string;
  image: string;
  theme: string;
  position: string;
  button: { url: string; text?: string };
};

function HeroSlide({
  title,
  subtitle,
  text,
  image,
  theme = 'default',
  button,
  position = 'left',
}: Readonly<HeroSlideProps>) {
  return (
    <div
      className="hoam-hero__slide"
      data-position={position}
      data-theme={theme}
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div className="hoam-hero__content">
        <p className="hoam-hero__subtitle">{subtitle}</p>
        <h1 className="hoam-hero__title">{title}</h1>
        <p className="hoam-hero__text">{text}</p>
        <div className="hoam-hero__content-link">
          <Button variant={theme === 'default' ? 'primary' : 'secondary'}>
            {button?.text || 'Read more'}
          </Button>
        </div>
      </div>
    </div>
  );
}

type HeroProps = {
  delay?: number;
  effect?: string;
  children: React.ReactNode;
};

function Hero({ delay = 2500, effect = 'slide', children }: Readonly<HeroProps>) {
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
      bulletClass: 'hoam-dots__bullet',
      bulletActiveClass: 'hoam-dots__bullet:active',
      // Has to return string
      renderBullet: (index, className) =>
        `<button type="button" class="${className}" aria-label="Go to slide ${index + 1}">
           <span class="hoam-dots__bullet-inner">${index + 1}</span>
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
    <div className="hoam-hero">
      <Button
        ref={prevRef}
        type="button"
        className="hoam-hero__nav-btn"
        data-direction="left"
        aria-label="Previous slide"
        icon="arrow-left"
        iconOnly
      />
      <Button
        ref={nextRef}
        type="button"
        className="hoam-hero__nav-btn"
        data-direction="right"
        aria-label="Next slide"
        icon="arrow-right"
        iconOnly
      />
      <div className="hoam__hero-controls">
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
          if (
            React.isValidElement(child) &&
            (child as React.ReactElement<any>).type === HeroSlide
          ) {
            return <SwiperSlide>{child}</SwiperSlide>;
          } else {
            console.error('Hero component only accepts child of type HeroSlide');
          }
        })}
      </Swiper>
    </div>
  );
}

export default Hero;
export { HeroSlide };
