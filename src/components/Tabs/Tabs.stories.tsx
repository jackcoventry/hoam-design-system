import { Meta, StoryObj } from '@storybook/react-vite';

import { type TabProps, Tabs } from '@/components/Tabs';

import bodyText from '@/styles/BodyText.module.css';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {},
  argTypes: {
    title: {
      table: { disable: true },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

const TABS: TabProps[] = [
  {
    id: 'home',
    label: 'Home',
    content: (
      <section className={bodyText.root}>
        <p>
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
          pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.
        </p>
        <p>
          Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus
          bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere.
        </p>
        <p>
          Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia
          nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit.
        </p>
      </section>
    ),
  },
  {
    id: 'contact',
    label: 'Contact',
    content: (
      <section className={bodyText.root}>
        <p>
          Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus
          bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere.
        </p>
        <p>
          Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia
          nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
          pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.
        </p>
      </section>
    ),
  },
  {
    id: 'search',
    label: 'Search',
    content: (
      <section className={bodyText.root}>
        <p>
          Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia
          nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
          pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.
        </p>
        <p>
          Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus
          bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere.
        </p>
      </section>
    ),
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
