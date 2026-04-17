import { Meta, StoryObj } from '@storybook/react-vite';

import { NewsletterBanner } from '@/components/NewsletterBanner';
import { NewsletterBannerDemo } from '@/stories/components/NewsletterBannerDemo';

const meta: Meta<typeof NewsletterBanner> = {
  title: 'Components/Newsletter Banner',
  component: NewsletterBanner,
  args: {
    title: 'Connect with us',
    description:
      'Fugiat esse consequat ad aliquip amet aliquip sed sit voluptate. Enim est culpa labore pariatur aliquip culpa mollit excepteur officia ea magna',
  },
};
export default meta;

type Story = StoryObj<typeof NewsletterBanner>;

const Template: Story = {
  render: (args) => (
    <NewsletterBannerDemo
      title={args.title}
      description={args.description}
    />
  ),
};

export const Default = { ...Template, args: {} };
