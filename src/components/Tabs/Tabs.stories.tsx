import { Tabs, type TabProps } from '@/components/Tabs';
import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Tabs>;

const TABS: TabProps[] = [
  {
    id: 'home',
    label: 'Home',
    content: <div>Home</div>,
  },
  {
    id: 'contact',
    label: 'Contact',
    content: <div>Contact</div>,
  },
  {
    id: 'search',
    label: 'Search',
    content: <div>Search</div>,
  },
];

const Template: Story = {
  render: (args) => (
    <Tabs
      title={args.title}
      items={TABS}
      layout={args.layout}
      mode={args.mode}
    />
  ),
};

export const Default = {
  ...Template,
  args: {
    title: 'Vertical tabs',
  },
};

export const Horizontal = {
  ...Template,
  args: {
    title: 'Horizontal tabs',
    layout: 'horizontal',
  },
};

export const Automatic = {
  ...Template,
  args: {
    title: 'Automatic tabs',
    mode: 'automatic',
  },
};
