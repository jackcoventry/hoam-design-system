import Footer from '@/components/Footer/Footer';
import FooterData from '@/mocks/components/Footer.json';
import { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

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
      />
    </div>
  ),
};

export const Default = { ...Template, args: {} };
