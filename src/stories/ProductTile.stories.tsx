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
    footnote: "A short description of the product.",
    price: { amount: 100, saleAmount: 80, currency: "GBP" },
    inStock: true,
  },
};
export default meta;

type Story = StoryObj<typeof ProductTile>;

const Template: Story = {
  render: (args) => (
    <div style={{ width: "300px" }}>
      <ProductTile {...args} />
    </div>
  ),
};

export const Default = { ...Template, args: {} };

export const OutOfStock = { ...Template, args: { inStock: false } };
