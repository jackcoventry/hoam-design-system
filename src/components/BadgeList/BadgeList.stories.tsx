import { Meta, StoryObj } from '@storybook/react-vite';

import { BadgeList, BadgeListItem } from '@/components/BadgeList';

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
        <BadgeListItem variant="alert">LOW STOCK</BadgeListItem>
        <BadgeListItem variant="highlight">Limited Edition</BadgeListItem>
      </BadgeList>
    </div>
  ),
};

export const Default = { ...Template, args: {} };
