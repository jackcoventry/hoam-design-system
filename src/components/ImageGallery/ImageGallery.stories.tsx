import { Meta, StoryObj } from '@storybook/react-vite';

import { ImageGallery } from '@/components/ImageGallery';
import ImageGalleryMockData from '@/mocks/components/ImageGallery';

const meta: Meta<typeof ImageGallery> = {
  title: 'Components/Image Gallery',
  component: ImageGallery,
  args: {
    images: ImageGalleryMockData,
  },
  argTypes: {
    'aria-label': {
      table: { disable: true },
    },
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
