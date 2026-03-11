import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { QuantitySelector } from '@/components/QuantitySelector';

const meta: Meta<typeof QuantitySelector> = {
  title: 'Components/Quantity Selector',
  component: QuantitySelector,
  tags: ['autodocs'],
  args: {},
};

export default meta;

type Story = StoryObj<typeof QuantitySelector>;

function StoryTemplate(args: any) {
  const [qty, setQty] = useState(0);

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
}

const Template: Story = {
  render: StoryTemplate,
};

export const Default = { ...Template, args: {} };
