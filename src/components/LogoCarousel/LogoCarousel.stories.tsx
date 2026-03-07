import LogoCarousel from '@/components/LogoCarousel/LogoCarousel';
import LogoCarouselData from '@/mocks/components/LogoCarousel';
import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof LogoCarousel> = {
  title: 'Components/Logo Carousel',
  component: LogoCarousel,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof LogoCarousel>;

const Template: Story = {
  render: () => (
    <LogoCarousel
      title="As featured in"
      items={LogoCarouselData}
    />
  ),
};

export const Default = { ...Template, args: {} };
