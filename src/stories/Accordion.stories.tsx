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

// Default
// Uncontrolled mode
// All panels start collapsed
// Only one panel can be open at a time so you can click to open a panel, which closes any other open panel.
export const Default = {
  ...Template,
  args: {
    allowMultiple: false,
    defaultOpenIds: [],
  },
};

// WithDefaultOpen
// Uncontrolled mode
// Panel “one” is expanded initially; the other remains collapsed
// Because allowMultiple: true, clicking to open “two” won’t auto‑close “one.”
export const WithDefaultOpen = {
  ...Template,
  args: {
    allowMultiple: true,
    defaultOpenIds: ["one"],
  },
};

// Controlled
// Clicking headers calls back into the story’s setOpenIds, so you see how to integrate this component in a fully controlled scenario.
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
  args: {
    allowMultiple: false,
    defaultOpenIds: [],
  },
};
