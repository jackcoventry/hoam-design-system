import SidebarNavigation from '@/components/SidebarNavigation/SidebarNavigation';
import SidebarNavigationData from '@/mocks/components/SidebarNavigation.json';
import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof SidebarNavigation> = {
  title: 'Components/Sidebar Navigation',
  component: SidebarNavigation,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof SidebarNavigation>;

const Template: Story = {
  render: () => <SidebarNavigation items={SidebarNavigationData} />,
};

export const Default = { ...Template, args: {} };
