import { Select } from '@/components/Form/Select/Select';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof Select> = {
  title: 'Components/Form/Select',
  component: Select,
  tags: ['autodocs'],
  args: {},
};

export default meta;

type Story = StoryObj<typeof Select>;

const Template: Story = {
  render: (args) => {
    const [value, setValue] = React.useState('');

    function onChange(id: string) {
      setValue(id);
    }

    return (
      <div>
        <Select
          label="T-Shirt Size"
          value={value}
          onChange={onChange}
        >
          <Select.Placeholder>Select size</Select.Placeholder>
          <Select.OptGroup label="Men">
            <Select.Option value="m-s">Small</Select.Option>
            <Select.Option value="m-m">Medium</Select.Option>
          </Select.OptGroup>
          <Select.OptGroup label="Women">
            <Select.Option value="w-s">Small</Select.Option>
            <Select.Option value="w-m">Medium</Select.Option>
          </Select.OptGroup>
        </Select>
      </div>
    );
  },
};

export const Default = { ...Template, args: {} };
