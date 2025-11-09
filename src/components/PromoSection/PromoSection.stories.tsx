import PromoSection from '@/components/PromoSection/PromoSection';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof PromoSection> = {
  title: 'Components/Promo Section',
  component: PromoSection,
  tags: ['autodocs'],
  args: {
    title: 'Introducing our new product line',
    subtitle: 'Product launch',
    description:
      'Fugiat esse consequat ad aliquip amet aliquip sed sit voluptate. Enim est culpa labore pariatur aliquip culpa mollit excepteur officia ea magna',
    linkUrl: '#',
    linkText: 'Shop Now',
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60',
    alignment: 'left',
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
