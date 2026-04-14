import { Meta, StoryObj } from '@storybook/react-vite';

import { NotificationBar } from '@/components/NotificationBar';
import NotificationBarData from '@/mocks/components/NotificationBar';

const meta: Meta<typeof NotificationBar> = {
  title: 'Components/Notification Bar',
  component: NotificationBar,
  args: {
    messages: NotificationBarData,
  },
};
export default meta;

type Story = StoryObj<typeof NotificationBar>;

const Template: Story = {
  render: (args) => <NotificationBar messages={args.messages} />,
};

export const Default = { ...Template, args: {} };
