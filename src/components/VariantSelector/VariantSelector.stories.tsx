import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import {
  VariantSelector,
  type VariantSelectorProps,
  VariantValue,
} from '@/components/VariantSelector';
import ProductInformationMockData from '@/mocks/components/ProductInformation';

const meta: Meta<typeof VariantSelector> = {
  title: 'Components/Variant Selector',
  component: VariantSelector,
  args: {},
  argTypes: {
    options: {
      table: { disable: true },
    },
    name: {
      table: { disable: true },
    },
    value: {
      table: { disable: true },
    },
    onChange: {
      table: { disable: true },
    },
    required: {
      table: { disable: true },
    },
    wrap: {
      table: { disable: true },
    },
    variant: {
      table: { disable: true },
    },
    label: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<typeof VariantSelector>;

function getOptionsByInput(input: 'color' | 'image' | 'label') {
  return ProductInformationMockData.options.find((group) => group.input === input)?.options ?? [];
}

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
    options: getOptionsByInput('label'),
    variant: 'label',
  },
};

export const Color = {
  ...Template,
  args: {
    options: getOptionsByInput('color'),
    variant: 'color',
  },
};

export const Image = {
  ...Template,
  args: {
    options: getOptionsByInput('image'),
    variant: 'image',
  },
};
