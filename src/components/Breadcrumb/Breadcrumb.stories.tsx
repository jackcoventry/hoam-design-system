import { Meta, StoryObj } from '@storybook/react-vite';

import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { NavPanelLinkItem } from '@/components/Navigation/Navigation';
import BreadcrumbData from '@/mocks/components/Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Breadcrumb>;

const items: NavPanelLinkItem[] = BreadcrumbData;

const Template: Story = {
  render: () => (
    <div>
      <Breadcrumb items={items} />
    </div>
  ),
};

export const Default = { ...Template, args: {} };
