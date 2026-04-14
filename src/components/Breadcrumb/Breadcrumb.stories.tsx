import { Meta, StoryObj } from '@storybook/react-vite';

import { Breadcrumb } from '@/components/Breadcrumb';
import type { NavPanelLinkItem } from '@/components/Navigation/types';
import BreadcrumbData from '@/mocks/components/Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  args: {},
  argTypes: {
    'aria-label': {
      table: { disable: true },
    },
  },
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
