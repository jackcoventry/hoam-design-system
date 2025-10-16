import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import ColorSelector from "@/components/ColorSelector/ColorSelector";

const meta: Meta<typeof ColorSelector> = {
  title: "Components/Color Selector",
  component: ColorSelector,
  tags: ["autodocs"],
  args: {},
};

export default meta;

type Story = StoryObj<typeof ColorSelector>;

const options = [
  { label: "Red", value: "red", name: "color" },
  { label: "Blue", value: "blue", name: "color" },
  { label: "Green", value: "green", name: "color" },
];

const Template: Story = {
  render: (args) => {
    const [active, setActive] = React.useState("");

    function onChange(id: string) {
      setActive(id);
    }

    return (
      <div>
        <ColorSelector
          {...args}
          onChange={onChange}
          value={active}
          options={options}
        />
      </div>
    );
  },
};

export const Default = { ...Template, args: {} };
