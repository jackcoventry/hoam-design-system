import type { Meta, StoryObj } from "@storybook/react-vite";

import Message from "@/components/Message/Message";

const meta = {
  title: "Components/Message",
  component: Message,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InformationMessage: Story = {
  args: {
    status: "info",
    title: "Info Message",
    text: "This is an informational message.",
  },
};

export const WarningMessage: Story = {
  args: {
    status: "warning",
    title: "Warning Message",
    text: "This is a warning message.",
  },
};

export const ErrorMessage: Story = {
  args: {
    status: "error",
    title: "Error Message",
    text: "This is an error message.",
  },
};

export const SuccessMessage: Story = {
  args: {
    status: "success",
    title: "Success Message",
    text: "This is a success message.",
  },
};
