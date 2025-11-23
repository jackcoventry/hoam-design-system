import Basket from '@/components/Basket/Basket';
import { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';

const meta: Meta<typeof Basket> = {
  title: 'Components/Basket',
  component: Basket,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Basket>;

const items = [
  {
    id: 'test-product-1',
    title: 'Trendy Bomber Jacket',
    summary: 'A fashion-forward bomber jacket to elevate your casual looks.',
    price: 62,
    thumbnail: {
      src: 'http://dummyimage.com/100x100.jpg',
      alt: 'A fashion-forward bomber jacket to elevate your casual looks',
    },
    url: '/test-product-1',
    quantity: 1,
    onChange: () => {},
  },
  {
    id: 'test-product-2',
    title: 'Fitness Jump Rope',
    summary: 'Durable jump rope for cardio workouts.',
    price: 44,
    thumbnail: {
      src: 'http://dummyimage.com/100x100.jpg',
      alt: 'Durable jump rope for cardio workouts',
    },
    url: '/test-product-2',
    quantity: 2,
    onChange: () => {},
  },
  {
    id: 'test-product-3',
    title: 'Portable Massage Table',
    summary: 'Folding massage table for professional or home use.',
    price: 41,
    thumbnail: {
      src: 'http://dummyimage.com/100x100.jpg',
      alt: 'Folding massage table for professional or home use.',
    },
    url: '/test-product-3',
    quantity: 1,
    onChange: () => {},
  },
  {
    id: 'test-product-3',
    title: 'Tomato Paste',
    summary: 'Concentrated tomato paste, great for sauces.',
    price: 85,
    thumbnail: {
      src: 'http://dummyimage.com/100x100.jpg',
      alt: 'Concentrated tomato paste, great for sauces.',
    },
    url: '/test-product-4',
    quantity: 3,
    onChange: () => {},
  },
];

const Template: Story = {
  render: () => {
    return (
      <div>
        <Basket items={items} />
      </div>
    );
  },
};

export const Default = { ...Template, args: {} };
