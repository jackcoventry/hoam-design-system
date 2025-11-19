import Hero, { HeroSlide } from '@/components/Hero/Hero';
import MockSlides from '@/mocks/components/Hero.json';
import { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof Hero> = {
  title: 'Components/Hero',
  component: Hero,
  tags: ['autodocs'],
  args: {
    data: MockSlides,
  },
};

export default meta;

type Story = StoryObj<typeof Hero>;

const Template: Story = {
  render: (args) => (
    <Hero effect={args.data?.length > 2 ? 'slide' : 'fade'}>
      {args.data?.map((slide) => (
        <HeroSlide
          key={slide.image}
          title={slide.title}
          subtitle={slide.subtitle}
          text={slide.text}
          theme={slide.theme}
          image={slide.image}
          video={slide.video}
          button={slide.button}
          position={slide.position}
        />
      ))}
    </Hero>
  ),
};

export const Default = { ...Template, args: {} };
export const Single = {
  ...Template,
  args: {
    data: [MockSlides[0]],
  },
};

export const Video = {
  ...Template,
  args: {
    data: [MockSlides[3]],
  },
};
