import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@/components/Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Accordion>;

const Template: Story = {
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem id="one">
        <AccordionHeader>Section 1</AccordionHeader>
        <AccordionPanel>Content 1</AccordionPanel>
      </AccordionItem>
      <AccordionItem id="two">
        <AccordionHeader>Section 2</AccordionHeader>
        <AccordionPanel>Content 2</AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
};

export const Default: Story = {
  ...Template,
  args: {
    allowMultiple: false,
  },
};

export const WithDefaultOpen: Story = {
  ...Template,
  args: {
    allowMultiple: true,
    defaultOpenIds: ['one'],
  },
};

function ControlledAccordion() {
  const [openIds, setOpenIds] = useState<string[]>(['two']);

  return (
    <Accordion
      openIds={openIds}
      onChange={setOpenIds}
    >
      <AccordionItem id="one">
        <AccordionHeader>Section 1</AccordionHeader>
        <AccordionPanel>
          Content 1 <a href="#test">Test link</a>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem id="two">
        <AccordionHeader>Section 2</AccordionHeader>
        <AccordionPanel>Content 2</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export const Controlled: Story = {
  render: () => <ControlledAccordion />,
};
