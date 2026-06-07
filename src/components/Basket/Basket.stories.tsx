import { Meta, StoryObj } from '@storybook/react-vite';

import { Basket } from '@/components/Basket';
import items from '@/mocks/components/Basket';

const meta: Meta<typeof Basket> = {
  title: 'Components/Basket',
  component: Basket,
  args: {
    items,
  },
  argTypes: {
    items: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {
  render: (args) => {
    const basketItems = args.items ?? [];

    const total = basketItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    return (
      <Basket
        items={basketItems}
        total={total}
      />
    );
  },
};

export const Default: Story = {
  ...Template,
  args: {
    items,
  },
};

export const NoItems: Story = {
  ...Template,
  args: {
    items: [],
  },
};
