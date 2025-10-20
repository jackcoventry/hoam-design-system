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
  { label: "Red", value: "#ff0000", name: "color", type: "color" },
  { label: "Yellow", value: "#ffff00", name: "color", type: "color" },
  {
    label: "Vitamin D Supplement",
    value: "https://placehold.co/48x48?text=Vitamin+D+Supplement",
    name: "color",
    type: "image",
  },
  { label: "Green", value: "#067c0eff", name: "color", type: "color" },
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
