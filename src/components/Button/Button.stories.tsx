import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, ButtonVariants } from '@/components/Button';
import { ICON_IDS, type IconId } from '@/design-tokens/icons';

type BaseButtonStoryArgs = {
  children: string;
  icon?: IconId;
  iconPosition?: 'left' | 'right';
  variant: (typeof ButtonVariants)[number];
  size?: 'default' | 'small';
  iconOnly?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
};

type AnchorButtonStoryArgs = BaseButtonStoryArgs & {
  href: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
};

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: 'text',
      type: { name: 'string' },
    },
    icon: {
      control: 'select',
      options: ICON_IDS,
    },
    iconPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
      type: { name: 'string' },
    },
    variant: {
      control: 'inline-radio',
      options: ButtonVariants,
      type: { name: 'string' },
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'small'],
      type: { name: 'string' },
    },
    iconOnly: {
      control: 'boolean',
      type: { name: 'boolean' },
    },
    disabled: {
      control: 'boolean',
      type: { name: 'boolean' },
    },
  },
} satisfies Meta<BaseButtonStoryArgs>;

export default meta;

type Story = StoryObj<BaseButtonStoryArgs>;

export const Primary: Story = {
  args: {
    children: 'Button',
    icon: 'arrow-right',
    iconPosition: 'right',
    variant: 'primary',
    size: 'default',
    iconOnly: false,
    disabled: false,
  },
  render: (args) => <Button {...args} />,
};

export const Secondary: Story = {
  args: {
    children: 'Button',
    icon: 'arrow-right',
    iconPosition: 'right',
    variant: 'secondary',
    size: 'default',
    iconOnly: false,
    disabled: false,
  },
  render: (args) => <Button {...args} />,
};

export const Small: Story = {
  args: {
    children: 'Button',
    icon: 'arrow-right',
    iconPosition: 'right',
    size: 'small',
    variant: 'secondary',
    iconOnly: false,
    disabled: false,
  },
  render: (args) => <Button {...args} />,
};

export const Anchor: StoryObj<AnchorButtonStoryArgs> = {
  args: {
    children: 'Button',
    href: '#',
    target: '_self',
    icon: 'arrow-right',
    iconPosition: 'right',
    variant: 'secondary',
    size: 'default',
    iconOnly: false,
  },
  argTypes: {
    href: {
      control: 'text',
      type: { name: 'string' },
    },
    target: {
      table: { disable: true },
    },
    disabled: {
      table: { disable: true },
    },
  },
  render: (args) => (
    <Button
      as="a"
      href={args.href}
      target={args.target}
      icon={args.icon}
      iconPosition={args.iconPosition}
      variant={args.variant}
      size={args.size}
      iconOnly={args.iconOnly}
      aria-label={args['aria-label']}
    >
      {args.children}
    </Button>
  ),
};
