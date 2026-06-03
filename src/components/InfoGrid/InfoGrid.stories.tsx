import { Meta, StoryObj } from '@storybook/react-vite';

import { InfoGrid } from '@/components/InfoGrid';
import { InfoGridItem } from '@/components/InfoGrid/InfoGridItem/InfoGridItem';

const meta: Meta<typeof InfoGrid> = {
  title: 'Components/Info Grid',
  component: InfoGrid,
  parameters: {
    a11y: {
      options: {
        rules: {
          'color-contrast': { enabled: false },
        },
      },
    },
  },
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
          title={args.title}
          description={args.description}
          icon="arrow-right"
        />
        <InfoGridItem
          title={args.title}
          description={args.description}
          icon="plus"
        />
        <InfoGridItem
          title={args.title}
          description={args.description}
          icon="dash"
        />
      </InfoGrid>
    </div>
  ),
};

export const Default = { ...Template, args: {} };
