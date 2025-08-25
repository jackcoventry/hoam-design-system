import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import ProductTile from "@/components/ProductTile/ProductTile";

const meta: Meta<typeof ProductTile> = {
  title: "Components/ProductTile",
  component: ProductTile,
  tags: ["autodocs"],
  args: {
    title: "Sample Product",
    productId: "sample-product",
    rating: 4.5,
    price: { amount: 100, saleAmount: 80, currency: "GBP" },
    inStock: true,
  },
};
export default meta;

type Story = StoryObj<typeof ProductTile>;

const Template: Story = {
  render: (args) => <ProductTile {...args} />,
};

export const Default = { ...Template, args: {} };

export const OutOfStock = { ...Template, args: { inStock: false } };
