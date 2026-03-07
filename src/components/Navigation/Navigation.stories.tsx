import Navigation from '@/components/Navigation/Navigation';
import NavigationData from '@/mocks/components/Navigation.json';
import UserNavigationData from '@/mocks/components/UserNavigation.json';
import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};
export default meta;

type Story = StoryObj<typeof Navigation>;

const Template: Story = {
  render: (args) => (
    <div style={{ height: '200vh' }}>
      <Navigation
        items={NavigationData}
        userItems={UserNavigationData}
        variant={args.variant}
      />
    </div>
  ),
};

export const Default = { ...Template, args: {} };

export const Fixed = {
  ...Template,
  parameters: {
    layout: 'fullscreen',
  },
  globals: {
    backgrounds: { value: 'dark' },
  },
  args: {
    variant: 'fixed',
  },
};
