import type { Meta, StoryObj } from '@storybook/react-vite';

import { Container, Grid, GridItem, Section, Stack } from '@/components/Layout';

const meta = {
  title: 'Layout/Showcase',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function Box({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      style={{
        border: '1px solid currentColor',
        padding: '1rem',
        minHeight: '4rem',
      }}
    >
      {children}
    </div>
  );
}

export const PageSectionExample: Story = {
  render: () => (
    <Section space="2xl">
      <Container>
        <Grid gap="lg">
          <GridItem
            span={12}
            spanLg={6}
          >
            <Stack gap="md">
              <Box>Eyebrow</Box>
              <Box>Heading</Box>
              <Box>Description</Box>
              <Box>Actions</Box>
            </Stack>
          </GridItem>

          <GridItem
            span={12}
            spanLg={6}
          >
            <Box>Media / image / illustration</Box>
          </GridItem>
        </Grid>
      </Container>
    </Section>
  ),
};

export const ThreeColumnExample: Story = {
  render: () => (
    <Section space="xl">
      <Container>
        <Grid gap="lg">
          <GridItem
            span={12}
            spanLg={4}
          >
            <Box>Card 1</Box>
          </GridItem>
          <GridItem
            span={12}
            spanLg={4}
          >
            <Box>Card 2</Box>
          </GridItem>
          <GridItem
            span={12}
            spanLg={4}
          >
            <Box>Card 3</Box>
          </GridItem>
        </Grid>
      </Container>
    </Section>
  ),
};

export const CenteredContentExample: Story = {
  render: () => (
    <Section space="xl">
      <Container width="wide">
        <Grid>
          <GridItem
            span={12}
            spanLg={6}
            startLg={4}
          >
            <Stack gap="md">
              <Box>Centered heading</Box>
              <Box>Centered body copy</Box>
              <Box>Centered CTA</Box>
            </Stack>
          </GridItem>
        </Grid>
      </Container>
    </Section>
  ),
};
