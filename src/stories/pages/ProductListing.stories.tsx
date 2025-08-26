import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import ProductTile from "@/components/ProductTile/ProductTile";

const meta: Meta<typeof ProductTile> = {
  title: "Pages/ProductListing",
  //   component: ProductTile,
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
    <>
      <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
        <div>
          <ProductTile {...args} />
        </div>
        <div>
          <ProductTile {...args} />
        </div>
        <div>
          <ProductTile {...args} />
        </div>
      </div>
      <div style={{ display: "flex", gap: "16px" }}>
        <div>
          <ProductTile {...args} />
        </div>
        <div>
          <ProductTile {...args} />
        </div>
        <div>
          <ProductTile {...args} />
        </div>
      </div>
    </>
  ),
};

export const Default = { ...Template, args: {} };
