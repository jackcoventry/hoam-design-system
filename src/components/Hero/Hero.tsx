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
  text: string;
  image: string;
  theme: string;
  button: { url: string; text?: string };
};

function HeroSlide({ title, text, image, theme = 'default', button }: Readonly<HeroSlideProps>) {
  return (
    <div
      className="hoam-hero__slide"
      data-theme={theme}
    >
      <h1>{title}</h1>
      <p>{text}</p>
      <img src={image} />
      <Button>{button?.text || 'Read more'}</Button>
    </div>
  );
}

type HeroProps = {
  delay?: number;
  effect: string;
  children: React.ReactNode;
};

function Hero({ delay = 2500, effect, children }: Readonly<HeroProps>) {
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
