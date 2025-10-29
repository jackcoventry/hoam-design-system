import Hero, { HeroSlide } from '@/components/Hero/Hero';
import MockSlides from '@/mocks/components/Hero.json';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof Hero> = {
  title: 'Components/Hero',
  component: Hero,
  tags: ['autodocs'],
  args: {},
};

export default meta;

type Story = StoryObj<typeof Hero>;

const Template: Story = {
  render: (args) => (
    <Hero effect={MockSlides.length > 3 ? 'slide' : 'fade'}>
      {MockSlides?.map((slide) => (
        <HeroSlide
          key={slide.image}
          title={slide.title}
          text={slide.text}
          theme={slide.theme}
          image={slide.image}
          button={slide.button}
        />
      ))}
    </Hero>
  ),
};

export const Default = { ...Template, args: {} };
