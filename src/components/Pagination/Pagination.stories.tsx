import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Pagination from "@/components/Pagination/Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: {
    pageCount: 6,
    currentPage: 1,
  },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

const Template: Story = {
  render: (args) => (
    <div>
      <Pagination {...args} />
    </div>
  ),
};

export const Default = { ...Template, args: {} };
