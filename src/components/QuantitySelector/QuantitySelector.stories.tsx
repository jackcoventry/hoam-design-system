import QuantitySelector from '@/components/QuantitySelector/QuantitySelector';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof QuantitySelector> = {
  title: 'Components/Quantity Selector',
  component: QuantitySelector,
  tags: ['autodocs'],
  args: {},
};

export default meta;

type Story = StoryObj<typeof QuantitySelector>;

const Template: Story = {
  render: (args) => {
    const [qty, setQty] = React.useState(0);

    function onChange(value: number) {
      setQty(value);
    }

    return (
      <div>
        <QuantitySelector
          {...args}
          onChange={onChange}
          value={qty}
          max={13}
        />
      </div>
    );
  },
};

export const Default = { ...Template, args: {} };
