import Hero from '@/components/Hero/Hero';
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
  render: (args) => <Hero />,
};

export const Default = { ...Template, args: {} };
