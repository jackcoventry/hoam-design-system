import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Radio, RadioGroup } from '@/components/Form/Radio';

const meta = {
  title: 'Components/Form/Radio',
  component: Radio,
  parameters: {
    layout: 'padded',
  },
  args: {
    label: 'Email',
    description: 'Contact me by email.',
    disabled: false,
    name: 'contact-method-demo',
    value: 'email',
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Group: Story = {
  render: () => (
    <RadioGroup
      legend="Preferred contact method"
      description="Choose one option."
    >
      <Radio
        name="contact-method"
        label="Email"
        value="email"
      />
      <Radio
        name="contact-method"
        label="Store pickup"
        value="store-pickup"
      />
      <Radio
        name="contact-method"
        label="SMS"
        value="sms"
      />
    </RadioGroup>
  ),
};

function ControlledRender() {
  const [value, setValue] = useState('email');

  return (
    <RadioGroup legend="Preferred contact method">
      <Radio
        name="contact-method-controlled"
        label="Email"
        value="email"
        checked={value === 'email'}
        onCheckedChange={(checked) => {
          if (checked) setValue('email');
        }}
      />
      <Radio
        name="contact-method-controlled"
        label="Store pickup"
        value="store-pickup"
        checked={value === 'store-pickup'}
        onCheckedChange={(checked) => {
          if (checked) setValue('store-pickup');
        }}
      />
      <Radio
        name="contact-method-controlled"
        label="SMS"
        value="sms"
        checked={value === 'sms'}
        onCheckedChange={(checked) => {
          if (checked) setValue('sms');
        }}
      />
    </RadioGroup>
  );
}

export const Controlled: Story = {
  render: () => <ControlledRender />,
};
