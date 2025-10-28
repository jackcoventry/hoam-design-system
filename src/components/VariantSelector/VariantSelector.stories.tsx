import VariantSelector from '@/components/VariantSelector/VariantSelector';
import ProductInformationMockData from '@/mocks/components/ProductInformation.json';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof VariantSelector> = {
  title: 'Components/Variant Selector',
  component: VariantSelector,
  tags: ['autodocs'],
  args: {},
};

export default meta;

type Story = StoryObj<typeof VariantSelector>;

const Template: Story = {
  render: (args) => {
    const [active, setActive] = React.useState('');

    function onChange(id: string) {
      setActive(id);
    }

    return (
      <div>
        <VariantSelector
          {...args}
          onChange={onChange}
          value={active}
          options={args.options}
          variant={args.variant}
          label="Option"
        />
      </div>
    );
  },
};

export const Label = {
  ...Template,
  args: {
    options: ProductInformationMockData.options.size,
    variant: 'label',
  },
};

export const Color = {
  ...Template,
  args: {
    options: ProductInformationMockData.options.color,
    variant: 'color',
  },
};

export const Image = {
  ...Template,
  args: {
    options: ProductInformationMockData.options.image,
    variant: 'image',
  },
};
