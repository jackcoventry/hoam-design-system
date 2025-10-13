import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import ProductInfo from "@/components/ProductInfo/ProductInfo";
import ImageGallery from "@/components/ImageGallery/ImageGallery";

const meta: Meta<typeof ProductInfo> = {
  title: "Pages/Product Page",
  tags: ["autodocs"],
  args: {
    title: "Sample Product",
    productId: "sample-product",
    footnote: "A short description of the product.",
    price: { amount: 100, saleAmount: 80, currency: "GBP" },
    inStock: true,
  },
};
export default meta;

type Story = StoryObj<typeof ProductInfo>;

const Template: Story = {
  render: (args) => {
    const images = [
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
    ];
    return (
      <div className="container">
        <div className="grid gap-lg">
          <div className="span-12 lg:span-5">
            <ImageGallery images={images} />
          </div>
          <div className="span-12 lg:start-7 lg:span-6">
            <ProductInfo {...args} />
          </div>
        </div>
      </div>
    );
  },
};

export const Default = { ...Template, args: {} };
