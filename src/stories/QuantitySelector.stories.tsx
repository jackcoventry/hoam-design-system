import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";

const meta: Meta<typeof QuantitySelector> = {
  title: "Components/Quantity Selector",
  component: QuantitySelector,
  tags: ["autodocs"],
  args: {},
};

export default meta;

type Story = StoryObj<typeof QuantitySelector>;

const Template: Story = {
  render: (args) => (
    <div>
      <QuantitySelector {...args} />
    </div>
  ),
};

export const Default = { ...Template, args: {} };
