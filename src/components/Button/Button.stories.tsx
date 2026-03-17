import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Button',
    icon: 'arrow-right',
    iconPosition: 'right',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Button',
    icon: 'arrow-right',
    iconPosition: 'right',
    variant: 'secondary',
  },
};

export const Anchor: Story = {
  args: {
    as: 'a',
    href: '#',
    children: 'Button',
    icon: 'arrow-right',
    iconPosition: 'right',
    variant: 'secondary',
  },
};

export const Small: Story = {
  args: {
    children: 'Button',
    icon: 'arrow-right',
    iconPosition: 'right',
    size: 'small',
    variant: 'secondary',
  },
};
