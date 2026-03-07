import NewsletterBanner from '@/components/NewsletterBanner/NewsletterBanner';
import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof NewsletterBanner> = {
  title: 'Components/Newsletter Banner',
  component: NewsletterBanner,
  tags: ['autodocs'],
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
    <div>
      <NewsletterBanner
        title={args.title}
        description={args.description}
      />
    </div>
  ),
};

export const Default = { ...Template, args: {} };
