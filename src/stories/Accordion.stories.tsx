import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Accordion, {
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from "@/components/Accordion/Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    allowMultiple: { control: { type: "boolean" } },
    defaultOpenIds: { control: { type: "object" } },
  },
};
export default meta;

type Story = StoryObj<typeof Accordion>;

const Template: Story = {
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem id="one">
        <AccordionHeader>Item 1</AccordionHeader>
        <AccordionPanel>Content for item 1</AccordionPanel>
      </AccordionItem>
      <AccordionItem id="two">
        <AccordionHeader>Item 2</AccordionHeader>
        <AccordionPanel>Content for item 2</AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
};

export const Default = {
  ...Template,
  args: { allowMultiple: false, defaultOpenIds: [] },
};

export const WithDefaultOpen = {
  ...Template,
  args: { allowMultiple: true, defaultOpenIds: ["one"] },
};

export const Controlled: Story = {
  render: (args) => {
    const [openIds, setOpenIds] = useState<string[]>(["two"]);
    return (
      <Accordion {...args} openIds={openIds} onChange={setOpenIds}>
        <AccordionItem id="one">
          <AccordionHeader>Item 1</AccordionHeader>
          <AccordionPanel>Content for item 1</AccordionPanel>
        </AccordionItem>
        <AccordionItem id="two">
          <AccordionHeader>Item 2</AccordionHeader>
          <AccordionPanel>Content for item 2</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  },
  args: { allowMultiple: false, defaultOpenIds: [] },
};
