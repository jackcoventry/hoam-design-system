import NotificationBar from '@/components/NotificationBar/NotificationBar';
import MockSlides from '@/mocks/components/Hero.json';
import NotificationBarData from '@/mocks/components/NotificationBar';

import { Meta } from '@storybook/react';

import Hero, { HeroSlide } from '@/components/Hero/Hero';
import React from 'react';

const meta: Meta = {
  title: 'Pages/Homepage',
  tags: ['autodocs'],
  args: {},
};

export default meta;

const HeroData = [MockSlides[0]];

const Template = {
  render: (args) => {
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

        <div className="container">
          <div className="grid gap-lg py-2xl"></div>
        </div>
      </>
    );
  },
};

export const Default = { ...Template, args: {} };
