import { Meta, StoryObj } from '@storybook/react-vite';

import { InfoGrid } from '@/components/InfoGrid/InfoGrid';
import { InfoGridItem } from '@/components/InfoGrid/InfoGridItem/InfoGridItem';

const meta: Meta<typeof InfoGrid> = {
  title: 'Components/Info Grid',
  component: InfoGrid,
  tags: ['autodocs'],
  args: {
    title: 'Why us?',
    description:
      'Fugiat esse consequat ad aliquip amet aliquip sed sit voluptate. Enim est culpa labore pariatur aliquip culpa mollit excepteur officia ea magna',
  },
};
export default meta;

type Story = StoryObj<typeof InfoGrid>;

const Template: Story = {
  render: (args) => (
    <div>
      <InfoGrid
        title={args.title}
        description={args.description}
      >
        <InfoGridItem
          title="Point 1"
          description={args.description}
          icon="arrow-right"
        />
        <InfoGridItem
          title="Point 2"
          description={args.description}
          icon="plus"
        />
        <InfoGridItem
          title="Point 3"
          description={args.description}
          icon="dash"
        />
      </InfoGrid>
    </div>
  ),
};

export const Default = { ...Template, args: {} };
