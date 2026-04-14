import { Meta, StoryObj } from '@storybook/react-vite';

import { PromoSection, PromoSectionProps } from '@/components/PromoSection';
import PromoSectionData from '@/mocks/components/PromoSection';

const meta: Meta<typeof PromoSection> = {
  title: 'Components/Promo Section',
  component: PromoSection,
  args: {
    ...(PromoSectionData as PromoSectionProps),
  },
  argTypes: {
    linkUrl: {
      table: { disable: true },
    },
    imageUrl: {
      table: { disable: true },
    },
    alignment: {
      control: 'inline-radio',
      options: ['left', 'right'],
    },
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
