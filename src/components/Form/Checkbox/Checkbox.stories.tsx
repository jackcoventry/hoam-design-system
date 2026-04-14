import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox, CheckboxGroup } from '@/components/Form/Checkbox';

const meta = {
  title: 'Components/Form/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
  },
  args: {
    label: 'Accept terms and conditions',
    description: 'You must agree before continuing.',
    disabled: false,
  },
  argTypes: {
    onCheckedChange: {
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

function IndeterminateSelectAllRender() {
  const options = [
    { label: 'Design systems', value: 'design-systems' },
    { label: 'Accessibility', value: 'accessibility' },
    { label: 'Performance', value: 'performance' },
  ];

  const [selected, setSelected] = useState<string[]>([]);

  const allSelected = selected.length === options.length;
  const noneSelected = selected.length === 0;
  const indeterminate = !allSelected && !noneSelected;

  const selectAll = () => {
    setSelected(options.map((option) => option.value));
  };

  const clearAll = () => {
    setSelected([]);
  };

  const toggleAll = () => {
    if (allSelected) {
      clearAll();
      return;
    }

    selectAll();
  };

  const toggleItem = (value: string, isChecked: boolean) => {
    if (isChecked) {
      setSelected((current) => [...current, value]);
      return;
    }

    setSelected((current) => current.filter((item) => item !== value));
  };

  return (
    <CheckboxGroup
      legend="Topics of interest"
      description="This demonstrates the indeterminate state in a realistic select-all pattern."
    >
      <Checkbox
        label="Select all topics"
        checked={allSelected}
        indeterminate={indeterminate}
        onCheckedChange={toggleAll}
      />

      {options.map((option) => (
        <Checkbox
          key={option.value}
          label={option.label}
          checked={selected.includes(option.value)}
          onCheckedChange={(isChecked) => toggleItem(option.value, isChecked)}
        />
      ))}
    </CheckboxGroup>
  );
}

export const IndeterminateSelectAll: Story = {
  render: () => <IndeterminateSelectAllRender />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Group: Story = {
  render: () => (
    <CheckboxGroup
      legend="Topics of interest"
      description="Select all that apply."
    >
      <Checkbox label="Design systems" />
      <Checkbox label="Accessibility" />
      <Checkbox label="Performance" />
    </CheckboxGroup>
  ),
};

function ControlledRender(args: React.ComponentProps<typeof Checkbox>) {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      {...args}
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledRender {...args} />,
};
