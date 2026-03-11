import {
  VariantSelector,
  VariantValue,
  type VariantSelectorProps,
} from '@/components/VariantSelector';
import ProductInformationMockData from '@/mocks/components/ProductInformation';
import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta<typeof VariantSelector> = {
  title: 'Components/Variant Selector',
  component: VariantSelector,
  tags: ['autodocs'],
  args: {},
};

export default meta;

type Story = StoryObj<typeof VariantSelector>;

function StoryTemplate(args: Readonly<VariantSelectorProps>) {
  const [active, setActive] = useState<VariantValue>('');

  function onChange(value: VariantValue) {
    setActive(value);
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
}

const Template: Story = {
  render: StoryTemplate,
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
