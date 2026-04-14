import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { QuantitySelector } from '@/components/QuantitySelector';

const meta: Meta<typeof QuantitySelector> = {
  title: 'Components/Quantity Selector',
  component: QuantitySelector,
  args: {},
  argTypes: {
    value: {
      table: { disable: true },
    },
    onChange: {
      table: { disable: true },
    },
    min: {
      table: { disable: true },
    },
    max: {
      table: { disable: true },
    },
    id: {
      table: { disable: true },
    },
    name: {
      table: { disable: true },
    },
    'aria-label': {
      table: { disable: true },
    },
    incrementLabel: {
      table: { disable: true },
    },
    decrementLabel: {
      table: { disable: true },
    },
  },
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
