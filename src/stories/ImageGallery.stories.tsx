import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import ImageGallery from "@/components/ImageGallery/ImageGallery";

const meta: Meta<typeof ImageGallery> = {
  title: "Components/ImageGallery",
  component: ImageGallery,
  tags: ["autodocs"],
  args: {
    images: [
      {
        src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
        alt: "Mountains at dusk",
      },
      {
        src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
        alt: "Ocean waves",
      },
      {
        src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
        alt: "Forest path",
      },
      {
        src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop",
        alt: "Desert road",
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof ImageGallery>;

const Template: Story = {
  render: (args) => (
    <div style={{ width: "600px" }}>
      <ImageGallery {...args} />
    </div>
  ),
};

export const Default = { ...Template, args: {} };
