import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Select } from '@/components/Form';

const meta = {
  title: 'Components/Form/Select',
  component: Select,
  args: {
    value: '',
    onChange: () => {},
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

type SelectStoryWrapperProps = {
  children: React.ReactNode;
  label?: string;
};

function SelectStoryWrapper({
  children,
  label = 'T-Shirt Size',
}: Readonly<SelectStoryWrapperProps>) {
  const [value, setValue] = useState('');

  return (
    <div>
      <Select
        label={label}
        placeholder="Select size"
        value={value}
        onChange={(nextValue) => {
          if (typeof nextValue === 'string') {
            setValue(nextValue);
          }
        }}
      >
        {children}
      </Select>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <SelectStoryWrapper>
      <Select.Option value="m-s">Small</Select.Option>
      <Select.Option value="m-m">Medium</Select.Option>
      <Select.Option value="w-l">Large</Select.Option>
    </SelectStoryWrapper>
  ),
};

export const SelectWithOptGroup: Story = {
  render: () => (
    <SelectStoryWrapper>
      <Select.OptGroup label="Men">
        <Select.Option value="m-s">Small</Select.Option>
        <Select.Option value="m-m">Medium</Select.Option>
      </Select.OptGroup>
      <Select.OptGroup label="Women">
        <Select.Option value="w-l">Large</Select.Option>
      </Select.OptGroup>
    </SelectStoryWrapper>
  ),
};
