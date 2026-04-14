import type { Meta, StoryObj } from '@storybook/react-vite';

import { Section } from '@/components/Layout/Section';
import { Stack } from '@/components/Layout/Stack';
import { spacingMap } from '@/design-tokens/spacing';
import { DemoBlock } from '@/stories/components/DemoBlock/DemoBlock';

const meta = {
  title: 'Layout/Section',
  component: Section,
  args: {
    children: null,
    space: 'xl',
  },
  argTypes: {
    children: {
      table: { disable: true },
    },
    as: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Reference: Story = {
  render: () => (
    <div>
      <Stack gap="none">
        <Section space="none">
          <DemoBlock>No space</DemoBlock>
        </Section>

        <Section space="2xs">
          <DemoBlock>2x Extra small</DemoBlock>
        </Section>

        <Section space="xs">
          <DemoBlock>Extra small</DemoBlock>
        </Section>

        <Section space="sm">
          <DemoBlock>Small</DemoBlock>
        </Section>

        <Section space="md">
          <DemoBlock>Medium</DemoBlock>
        </Section>

        <Section space="lg">
          <DemoBlock>Large</DemoBlock>
        </Section>

        <Section space="xl">
          <DemoBlock>Extra large</DemoBlock>
        </Section>

        <Section space="2xl">
          <DemoBlock>2x Extra large</DemoBlock>
        </Section>

        <Section space="3xl">
          <DemoBlock>3x Extra large</DemoBlock>
        </Section>

        <Section space="4xl">
          <DemoBlock>4x Extra large</DemoBlock>
        </Section>
      </Stack>
    </div>
  ),
  argTypes: {
    space: {
      table: { disable: true },
    },
  },
};

export const SingleSection: Story = {
  args: {
    space: 'xl',
  },
  argTypes: {
    space: {
      control: 'select',
      options: Object.keys(spacingMap),
    },
  },
  render: (args) => (
    <div>
      <Section {...args}>
        <DemoBlock>{`space="${args.space}"`} </DemoBlock>
      </Section>
    </div>
  ),
};
