import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import ProductTile from "@/components/ProductTile/ProductTile";
import Pagination from "@/components/Pagination/Pagination";

const meta: Meta<typeof ProductTile> = {
  title: "Pages/ProductListing",
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
      <div style={{ display: "flex", gap: "16px", paddingBottom: "64px" }}>
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
      <div style={{ display: "flex", gap: "16px", paddingBottom: "64px" }}>
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
      <Pagination pageCount={5} currentPage={2} />
    </>
  ),
};

export const Default = { ...Template, args: {} };
