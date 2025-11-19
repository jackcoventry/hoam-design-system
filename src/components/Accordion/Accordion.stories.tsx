import Accordion, { AccordionItem } from '@/components/Accordion/Accordion';
import { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Accordion>;

const Template: Story = {
  render: (args) => (
    <Accordion
      {...args}
      defaultOpenIds={[]}
    >
      <AccordionItem id="one">
        <div>Section 1</div>
        <div>Content 1</div>
      </AccordionItem>
      <AccordionItem id="two">
        <div>Section 2</div>
        <div>Content 2</div>
      </AccordionItem>
    </Accordion>
  ),
};

export const Default = { ...Template, args: { allowMultiple: false } };
export const WithDefaultOpen = {
  ...Template,
  args: { allowMultiple: true, defaultOpenIds: ['one'] },
};
export const Controlled: Story = {
  render: () => {
    const [openIds, setOpenIds] = useState(['two']);
    return (
      <Accordion
        openIds={openIds}
        onChange={setOpenIds}
        accordionTitle="Controlled Accordion"
      >
        <AccordionItem id="one">
          <div>Section 1</div>
          <div>
            Content 1 <a href="#">Test link</a>
          </div>
        </AccordionItem>
        <AccordionItem id="two">
          <div>Section 2</div>
          <div>Content 2</div>
        </AccordionItem>
      </Accordion>
    );
  },
};
