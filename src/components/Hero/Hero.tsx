import { Button } from '@/components/Button/Button';
import React from 'react';
import { A11y, Autoplay, EffectFade, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
  return (
    <Swiper
      centeredSlides={true}
      loop={true}
      effect={effect}
      autoplay={{
        delay,
        disableOnInteraction: false,
      }}
      keyboard={{
        enabled: true,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation, Keyboard, A11y, EffectFade]}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && (child as React.ReactElement<any>).type === HeroSlide) {
          return <SwiperSlide>{child}</SwiperSlide>;
        } else {
          console.error('Hero component only accepts child of type HeroSlide');
        }
      })}
    </Swiper>
  );
}

export default Hero;
export { HeroSlide };
