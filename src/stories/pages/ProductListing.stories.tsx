import { Pagination, ProductTile } from '@/components';
import Data from '@/mocks/components/ProductTile';
import BaseTemplate from '@/templates/Base';
import { Meta } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Pages/Product Listing',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: Data,
};
export default meta;

const productArray = [1, 2, 3];

const Template = {
  render: (args: any) => (
    <BaseTemplate>
      <div className="container">
        <div className="grid gap-lg mb-2xl">
          {productArray.map((product) => (
            <div
              className="span-12 lg:span-4"
              key={product}
            >
              <ProductTile {...args} />
            </div>
          ))}
        </div>
        <div className="grid gap-lg mb-xl">
          {productArray.map((product) => (
            <div
              className="span-12 lg:span-4"
              key={product}
            >
              <ProductTile {...args} />
            </div>
          ))}
        </div>

        <div className="grid pt-2xl">
          <div className="span-12">
            <Pagination
              pageCount={5}
              currentPage={2}
            />
          </div>
        </div>
      </div>
    </BaseTemplate>
  ),
};

export const Default = { ...Template, args: {} };
