import { Meta, StoryObj } from '@storybook/react-vite';

import { Container, Grid, GridItem } from '@/components/Layout';
import { RichLink } from '@/components/RichLink';
import MockData from '@/mocks/components/RichLinks';

const meta: Meta<typeof RichLink> = {
  title: 'Components/Rich Link',
  component: RichLink,
  args: {},
};
export default meta;

type Story = StoryObj<typeof RichLink>;

const Template: Story = {
  render: () => {
    return (
      <Container>
        <Grid>
          {MockData?.map((item) => {
            return (
              <GridItem
                span={12}
                spanMd={6}
                spanLg={4}
                key={item.href}
              >
                <RichLink
                  title={item.title}
                  href={item.href}
                  image={item.image}
                  imageAlt={item.imageAlt}
                />
              </GridItem>
            );
          })}
        </Grid>
      </Container>
    );
  },
};

export const Default = { ...Template, args: {} };
