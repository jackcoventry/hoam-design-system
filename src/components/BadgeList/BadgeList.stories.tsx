import BadgeList, { BadgeListItem } from '@/components/BadgeList/BadgeList';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof BadgeList> = {
  title: 'Components/Badge List',
  component: BadgeList,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof BadgeList>;

const Template: Story = {
  render: () => (
    <div>
      <BadgeList>
        <BadgeListItem>NEW</BadgeListItem>
        <BadgeListItem theme="alert">LOW STOCK</BadgeListItem>
        <BadgeListItem>Limited Edition</BadgeListItem>
      </BadgeList>
    </div>
  ),
};

export const Default = { ...Template, args: {} };
