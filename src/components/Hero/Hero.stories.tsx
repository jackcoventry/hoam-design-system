import { Hero } from '@/components/Hero/Hero';
import { HeroSlide, HeroSlideProps } from '@/components/Hero/HeroSlide';
import MockSlides from '@/mocks/components/Hero';
import { Meta, StoryObj } from '@storybook/react-vite';

type HeroStoryArgs = React.ComponentProps<typeof Hero> & {
  data: typeof MockSlides;
};

const meta: Meta<HeroStoryArgs> = {
  title: 'Components/Hero',
  component: Hero,
  tags: ['autodocs'],
  args: {
    data: MockSlides,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {
  render: (args) => (
    <Hero>
      {args.data?.map((slide: HeroSlideProps) => (
        <HeroSlide
          key={slide.image ?? slide.video ?? slide.title}
          title={slide.title}
          subtitle={slide.subtitle}
          text={slide.text}
          button={slide.button}
          {...(slide.theme === undefined ? {} : { theme: slide.theme })}
          {...(slide.image === undefined ? {} : { image: slide.image })}
          {...(slide.video === undefined ? {} : { video: slide.video })}
          {...(slide.position === undefined ? {} : { position: slide.position })}
        />
      ))}
    </Hero>
  ),
};

export const Default = { ...Template, args: {} };
export const Single = {
  ...Template,
  args: {
    data: [MockSlides[0]],
  },
};

export const Video = {
  ...Template,
  args: {
    data: [MockSlides[3]],
  },
};
