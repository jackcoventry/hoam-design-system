import { Meta, StoryObj } from '@storybook/react-vite';

import { BodyText } from '@/components/Common/BodyText';
import { type TabProps, Tabs } from '@/components/Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {},
  argTypes: {
    title: {
      table: { disable: true },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

const TABS: TabProps[] = [
  {
    id: 'tasting-notes',
    label: 'Tasting notes',
    content: (
      <BodyText>
        <p>
          Expect milk chocolate, soft caramel, and a gentle citrus lift from our house espresso
          blend.
        </p>
        <p>
          Filter roasts lean brighter, with stone fruit, honey, and floral aromatics depending on
          the origin.
        </p>
        <p>
          Each bag includes roast level, origin, and brew guidance so the first cup is easy to dial
          in.
        </p>
      </BodyText>
    ),
  },
  {
    id: 'brew-guide',
    label: 'Brew guide',
    content: (
      <BodyText>
        <p>
          Start with 18g of coffee to 36g of espresso, or use a 1:16 ratio for pour-over and French
          press.
        </p>
        <p>
          Grind finer for espresso, medium for filter, and coarse for immersion brewers such as
          French press.
        </p>
        <p>
          Rest freshly roasted beans for a few days before brewing to unlock better sweetness and
          crema.
        </p>
      </BodyText>
    ),
  },
  {
    id: 'delivery',
    label: 'Delivery',
    content: (
      <BodyText>
        <p>
          Coffee is roasted weekly and dispatched quickly so beans arrive fresh and ready for your
          preferred brew method.
        </p>
        <p>
          Subscription orders can be paused, skipped, or changed between espresso, filter, and decaf
          selections.
        </p>
        <p>
          Brewing equipment and accessories ship with the same care as coffee, using recyclable
          packing where possible.
        </p>
      </BodyText>
    ),
  },
];

const Template: Story = {
  render: (args) => (
    <Tabs
      title={args.title}
      items={TABS}
      layout={args.layout}
      mode={args.mode}
    />
  ),
};

export const Default = {
  ...Template,
  args: {
    title: 'Vertical tabs',
  },
};

export const Horizontal = {
  ...Template,
  args: {
    title: 'Horizontal tabs',
    layout: 'horizontal',
  },
};

export const Automatic = {
  ...Template,
  args: {
    title: 'Automatic tabs',
    mode: 'automatic',
  },
};
