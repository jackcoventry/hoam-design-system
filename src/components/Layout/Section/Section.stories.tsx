import type { Meta, StoryObj } from '@storybook/react-vite';

import { Container } from '@/components/Layout/Container';
import { Section } from '@/components/Layout/Section';

const meta = {
  title: 'Layout/Section',
  component: Section,
  tags: ['autodocs'],
  args: {
    space: 'xl',
  },
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

function DemoContent() {
  return (
    <Container>
      <div
        style={{
          border: '1px dashed currentColor',
          padding: '1rem',
        }}
      >
        Section content
      </div>
    </Container>
  );
}

export const Default: Story = {
  render: (args) => (
    <Section {...args}>
      <DemoContent />
    </Section>
  ),
};

export const Small: Story = {
  args: {
    space: 'sm',
  },
  render: (args) => (
    <Section {...args}>
      <DemoContent />
    </Section>
  ),
};

export const Large: Story = {
  args: {
    space: '2xl',
  },
  render: (args) => (
    <Section {...args}>
      <DemoContent />
    </Section>
  ),
};

export const AsDiv: Story = {
  args: {
    as: 'div',
    space: 'lg',
  },
  render: (args) => (
    <Section {...args}>
      <DemoContent />
    </Section>
  ),
};
