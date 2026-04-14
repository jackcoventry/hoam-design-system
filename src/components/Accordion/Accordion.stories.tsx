import { JSX, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import type { AccordionProps } from '@/components/Accordion';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@/components/Accordion';

type AccordionStoryArgs = Omit<AccordionProps, 'children'> & {
  sectionOneHeader: string;
  sectionOneContent: string;
  sectionTwoHeader: string;
  sectionTwoContent: string;
};

function renderAccordion({
  sectionOneHeader,
  sectionOneContent,
  sectionTwoHeader,
  sectionTwoContent,
  ...args
}: AccordionStoryArgs) {
  return (
    <Accordion {...args}>
      <AccordionItem id="one">
        <AccordionHeader>{sectionOneHeader}</AccordionHeader>
        <AccordionPanel>{sectionOneContent}</AccordionPanel>
      </AccordionItem>

      <AccordionItem id="two">
        <AccordionHeader>{sectionTwoHeader}</AccordionHeader>
        <AccordionPanel>{sectionTwoContent}</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

function ControlledAccordion({
  sectionOneHeader,
  sectionOneContent,
  sectionTwoHeader,
  sectionTwoContent,
  ...args
}: AccordionStoryArgs) {
  const [openIds, setOpenIds] = useState<string[]>(['two']);

  return (
    <Accordion
      {...args}
      openIds={openIds}
      onChange={setOpenIds}
    >
      <AccordionItem id="one">
        <AccordionHeader>{sectionOneHeader}</AccordionHeader>
        <AccordionPanel>{sectionOneContent}</AccordionPanel>
      </AccordionItem>

      <AccordionItem id="two">
        <AccordionHeader>{sectionTwoHeader}</AccordionHeader>
        <AccordionPanel>{sectionTwoContent}</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

const meta = {
  title: 'Components/Accordion',
  component: Accordion as unknown as (props: AccordionStoryArgs) => JSX.Element,
  args: {
    allowMultiple: false,
    sectionOneHeader: 'Description',
    sectionOneContent:
      'Ut minim mollit officia ad adipiscing velit duis duis fugiat. Reprehenderit voluptate dolore laboris esse in adipiscing adipiscing voluptate anim laboris qui reprehenderit eiusmod eiusmod incididunt occaecat excepteur mollit.',
    sectionTwoHeader: 'Returns Policy',
    sectionTwoContent:
      'Ut minim mollit officia ad adipiscing velit duis duis fugiat. Reprehenderit voluptate dolore laboris esse in adipiscing adipiscing voluptate anim laboris qui reprehenderit eiusmod eiusmod incididunt occaecat excepteur mollit.',
    showToggleAll: true,
  },
  argTypes: {
    allowMultiple: {
      control: 'boolean',
      type: { name: 'boolean' },
      description: 'Allows more than one section to stay open at once.',
    },
    sectionOneHeader: {
      control: 'text',
      type: { name: 'string' },
      description: 'Heading for the first accordion section.',
    },
    sectionOneContent: {
      control: 'text',
      type: { name: 'string' },
      description: 'Content for the first accordion section.',
    },
    sectionTwoHeader: {
      control: 'text',
      type: { name: 'string' },
      description: 'Heading for the second accordion section.',
    },
    sectionTwoContent: {
      control: 'text',
      type: { name: 'string' },
      description: 'Content for the second accordion section.',
    },
    showToggleAll: {
      control: 'boolean',
      type: { name: 'boolean' },
      description:
        'Shows a control that expands or collapses all sections; only if allowMultiple is enabled.',
    },
    className: {
      table: { disable: true },
    },
    defaultOpenIds: {
      table: { disable: true },
    },
    openIds: {
      table: { disable: true },
    },
    onChange: {
      table: { disable: true },
    },
  },
} satisfies Meta<AccordionStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: renderAccordion,
};

export const WithDefaultOpen: Story = {
  args: {
    allowMultiple: true,
    defaultOpenIds: ['one'],
  },
  render: renderAccordion,
};

export const Controlled: Story = {
  render: (args) => <ControlledAccordion {...args} />,
};
