import { Meta, StoryObj } from '@storybook/react-vite';

import { Footer } from '@/components/Footer';
import FooterData from '@/mocks/components/Footer';
import SocialLinks from '@/mocks/socialLinks';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Footer>;

const Template: Story = {
  render: () => (
    <div>
      <Footer
        topLinks={FooterData.topLinks}
        bottomLinks={FooterData.bottomLinks}
        socialLinks={SocialLinks}
      />
    </div>
  ),
};

export const Default = { ...Template, args: {} };
