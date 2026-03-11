import { Meta, StoryObj } from '@storybook/react-vite';

import { Basket } from '@/components/Basket';
import items from '@/mocks/components/Basket';

const meta: Meta<typeof Basket> = {
  title: 'Components/Basket',
  component: Basket,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Basket>;

const Template: Story = {
  render: () => {
    // Just to give element of realism
    const total = items?.reduce((acc, item) => {
      const result = item.price * item.quantity;
      return result + acc;
    }, 0);
    return (
      <div>
        <Basket
          items={items}
          total={total}
        />
      </div>
    );
  },
};

export const Default = { ...Template, args: {} };
