import { Basket, BasketFooter } from '@/components';
import items from '@/mocks/components/Basket';
import BaseTemplate from '@/templates/Base';
import { Meta } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Pages/Basket',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};
export default meta;

const Template = {
  render: () => {
    const total = items?.reduce((acc, item) => {
      const result = item.price * item.quantity;
      return result + acc;
    }, 0);
    return (
      <BaseTemplate>
        <div className="container | py-2xl">
          <div className="grid">
            <div className="span-12 lg:span-10 lg:start-2">
              <h1>Your basket</h1>
              <Basket
                items={items}
                total={total}
              />

              <BasketFooter total={total} />
            </div>
          </div>
        </div>
      </BaseTemplate>
    );
  },
};

export const Default = { ...Template, args: {} };
