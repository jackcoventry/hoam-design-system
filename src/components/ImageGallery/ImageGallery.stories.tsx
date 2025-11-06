import ImageGallery from '@/components/ImageGallery/ImageGallery';
import ImageGalleryMockData from '@/mocks/components/ImageGallery.json';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof ImageGallery> = {
  title: 'Components/Image Gallery',
  component: ImageGallery,
  tags: ['autodocs'],
  args: {
    images: ImageGalleryMockData,
  },
};

export default meta;

type Story = StoryObj<typeof ImageGallery>;

const Template: Story = {
  render: (args) => (
    <div
      style={{
        maxWidth: 800,
      }}
    >
      <ImageGallery {...args} />
    </div>
  ),
};

export const Default = { ...Template, args: {} };
