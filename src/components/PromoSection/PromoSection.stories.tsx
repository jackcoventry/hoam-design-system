import PromoSection from '@/components/PromoSection/PromoSection';
import PromoSectionData from '@/mocks/components/PromoSection.json';
import { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof PromoSection> = {
  title: 'Components/Promo Section',
  component: PromoSection,
  tags: ['autodocs'],
  args: {
    ...PromoSectionData,
  },
};
export default meta;

type Story = StoryObj<typeof PromoSection>;

const Template: Story = {
  render: (args) => (
    <div>
      <PromoSection
        title={args.title}
        description={args.description}
        subtitle={args.subtitle}
        linkUrl={args.linkUrl}
        linkText={args.linkText}
        imageUrl={args.imageUrl}
        alignment={args.alignment}
      />
    </div>
  ),
};

export const Default = { ...Template, args: {} };

export const RightAlignment = {
  ...Template,
  args: {
    ...Default.args,
    alignment: 'right',
  },
};
