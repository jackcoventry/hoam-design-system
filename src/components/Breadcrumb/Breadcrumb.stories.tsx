import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { NavItem } from '@/components/Navigation/types/Navigation.types';
import BreadcrumbData from '@/mocks/components/Breadcrumb';
import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Breadcrumb>;

const items: NavItem[] = BreadcrumbData;

const Template: Story = {
  render: () => (
    <div>
      <Breadcrumb items={items} />
    </div>
  ),
};

export const Default = { ...Template, args: {} };
