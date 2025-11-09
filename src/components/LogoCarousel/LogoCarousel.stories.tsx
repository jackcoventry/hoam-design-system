import LogoCarousel from '@/components/LogoCarousel/LogoCarousel';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof LogoCarousel> = {
  title: 'Components/Logo Carousel',
  component: LogoCarousel,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof LogoCarousel>;

const items = [
  {
    id: 1,
    src: 'https://placehold.co/600x400?text=Logo+1',
    alt: 'Logo 1',
  },
  {
    id: 2,
    src: 'https://placehold.co/600x400?text=Logo+2',
    alt: 'Logo 2',
  },
  {
    id: 3,
    src: 'https://placehold.co/600x400?text=Logo+3',
    alt: 'Logo 3',
  },
  {
    id: 4,
    src: 'https://placehold.co/600x400?text=Logo+4',
    alt: 'Logo 4',
  },
];

const Template: Story = {
  render: () => <LogoCarousel items={items} />,
};

export const Default = { ...Template, args: {} };
