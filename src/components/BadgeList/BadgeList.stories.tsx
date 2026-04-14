import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  BadgeList,
  BadgeListItem,
  type BadgeListItemVariant,
  BadgeListVariants,
} from '@/components/BadgeList/BadgeList';

type SingleStoryArgs = {
  text: string;
  variant: BadgeListItemVariant;
};

const meta = {
  title: 'Components/BadgeList',
  component: BadgeList,
} satisfies Meta<typeof BadgeList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: StoryObj<SingleStoryArgs> = {
  args: {
    text: 'New',
    variant: 'default',
  },
  argTypes: {
    text: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: BadgeListVariants,
    },
  },
  render: ({ text, variant }) => (
    <BadgeList>
      <BadgeListItem variant={variant}>{text}</BadgeListItem>
    </BadgeList>
  ),
};

export const Multiple: Story = {
  render: () => (
    <BadgeList>
      <BadgeListItem variant="default">Default</BadgeListItem>
      <BadgeListItem variant="alert">Alert</BadgeListItem>
      <BadgeListItem variant="highlight">Highlight</BadgeListItem>
    </BadgeList>
  ),
};
