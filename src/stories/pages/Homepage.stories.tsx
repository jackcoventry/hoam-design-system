import NotificationBar from '@/components/NotificationBar/NotificationBar';
import MockSlides from '@/mocks/components/Hero.json';
import LogoCarouselData from '@/mocks/components/LogoCarousel.json';
import NotificationBarData from '@/mocks/components/NotificationBar';

import { Meta } from '@storybook/react';

import Hero, { HeroSlide } from '@/components/Hero/Hero';
import LogoCarousel from '@/components/LogoCarousel/LogoCarousel';
import NewsletterBanner from '@/components/NewsletterBanner/NewsletterBanner';
import React from 'react';

const meta: Meta = {
  title: 'Pages/Homepage',
  tags: ['autodocs'],
  args: {},
};

export default meta;

const HeroData = [MockSlides[0]];

const Template = {
  render: () => {
    return (
      <>
        <NotificationBar messages={NotificationBarData} />
        <Hero>
          {HeroData.map((slide) => (
            <HeroSlide
              key={slide.image}
              title={slide.title}
              subtitle={slide.subtitle}
              text={slide.text}
              theme={slide.theme}
              image={slide.image}
              button={slide.button}
              position={slide.position}
            />
          ))}
        </Hero>
        <LogoCarousel
          title="As featured in"
          items={LogoCarouselData}
        />
        <NewsletterBanner
          title="Connect with us"
          description="Sign up to our newsletter to receive the latest news and updates from our team."
        />
      </>
    );
  },
};

export const Default = { ...Template, args: {} };
