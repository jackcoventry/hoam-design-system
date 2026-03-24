import { useState } from 'react';
import type { Meta } from '@storybook/react-vite';

import type { AccordionProps } from '@/components/Accordion';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@/components/Accordion';

type AccordionStoryArgs = AccordionProps & {
  sectionOneHeader: string;
  sectionOneContent: string;
  sectionTwoHeader: string;
  sectionTwoContent: string;
};

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: {
    allowMultiple: false,
    sectionOneHeader: 'Description',
    sectionOneContent:
      'Ut minim mollit officia ad adipiscing velit duis duis fugiat. Reprehenderit voluptate dolore laboris esse in adipiscing adipiscing voluptate anim laboris qui reprehenderit eiusmod eiusmod incididunt occaecat excepteur mollit. Ad labore irure amet sit aliquip veniam pariatur veniam laboris nostrud nulla ullamco. Adipiscing veniam dolore cupidatat qui ad exercitation elit labore velit et aliquip adipiscing occaecat fugiat consequat esse sint nulla ea. Excepteur anim cillum culpa ullamco labore commodo veniam ut dolor excepteur irure duis voluptate proident ex in velit qui anim.',
    sectionTwoHeader: 'Returns Policy',
    sectionTwoContent:
      'Ut minim mollit officia ad adipiscing velit duis duis fugiat. Reprehenderit voluptate dolore laboris esse in adipiscing adipiscing voluptate anim laboris qui reprehenderit eiusmod eiusmod incididunt occaecat excepteur mollit. Ad labore irure amet sit aliquip veniam pariatur veniam laboris nostrud nulla ullamco. Adipiscing veniam dolore cupidatat qui ad exercitation elit labore velit et aliquip adipiscing occaecat fugiat consequat esse sint nulla ea. Excepteur anim cillum culpa ullamco labore commodo veniam ut dolor excepteur irure duis voluptate proident ex in velit qui anim.',
  },
  argTypes: {
    sectionOneHeader: {
      control: 'text',
    },
    sectionOneContent: {
      control: 'text',
    },
    sectionTwoHeader: {
      control: 'text',
    },
    sectionTwoContent: {
      control: 'text',
    },
    collapseLabel: {
      control: 'text',
    },
    expandLabel: {
      control: 'text',
    },
    showToggleAll: {
      control: 'boolean',
    },
    className: {
      control: false,
    },
    defaultOpenIds: {
      control: false,
    },
  },
  render: ({
    sectionOneHeader,
    sectionOneContent,
    sectionTwoHeader,
    sectionTwoContent,
    ...args
  }) => (
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
  ),
} satisfies Meta<AccordionStoryArgs>;

export default meta;

export const Default = {};

export const WithDefaultOpen = {
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

export const Controlled = {
  render: () => <ControlledAccordion />,
};
