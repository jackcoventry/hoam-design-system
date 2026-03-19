import type { Meta, StoryObj } from '@storybook/react-vite';

import { Container } from '@/components/Layout/Container';
import { Section } from '@/components/Layout/Section';
import { Stack } from '@/components/Layout/Stack';

const meta = {
  title: 'Layout/Section',
  component: Section,
  tags: ['autodocs'],
  args: {
    children: null,
    space: 'xl',
  },
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

function SectionBlock({
  label,
}: Readonly<{
  label: string;
}>) {
  return (
    <Container>
      <div
        style={{
          border: '1px solid currentColor',
          borderRadius: '0.5rem',
          padding: '1rem',
          background: 'rgba(0,0,0,0.03)',
        }}
      >
        {label}
      </div>
    </Container>
  );
}

export const Reference: Story = {
  render: () => (
    <div style={{ background: 'rgba(0,0,0,0.02)' }}>
      <Stack gap="none">
        <Section space="none">
          <SectionBlock label='space="none"' />
        </Section>

        <Section space="sm">
          <SectionBlock label='space="sm"' />
        </Section>

        <Section space="md">
          <SectionBlock label='space="md"' />
        </Section>

        <Section space="lg">
          <SectionBlock label='space="lg"' />
        </Section>

        <Section space="xl">
          <SectionBlock label='space="xl"' />
        </Section>

        <Section space="2xl">
          <SectionBlock label='space="2xl"' />
        </Section>
      </Stack>
    </div>
  ),
};

export const SingleSection: Story = {
  args: {
    space: 'xl',
  },
  render: (args) => (
    <div style={{ background: 'rgba(0,0,0,0.02)' }}>
      <Section {...args}>
        <SectionBlock label={`space="${args.space}"`} />
      </Section>
    </div>
  ),
};
