import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'padded',
  },
  args: {
    label: 'Enable notifications',
    description: 'Receive updates about important account activity.',
    disabled: false,
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

function ControlledExampleRender(args: React.ComponentProps<typeof Switch>) {
  const [checked, setChecked] = useState(false);

  return (
    <Switch
      {...args}
      checked={checked}
      onCheckedChange={setChecked}
      description={checked ? 'Notifications are enabled.' : 'Notifications are disabled.'}
    />
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledExampleRender {...args} />,
};
