import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import VariantSelector from "@/components/VariantSelector/VariantSelector";

const meta: Meta<typeof VariantSelector> = {
  title: "Components/Variant Selector",
  component: VariantSelector,
  tags: ["autodocs"],
  args: {},
};

export default meta;

type Story = StoryObj<typeof VariantSelector>;

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
        <VariantSelector
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
