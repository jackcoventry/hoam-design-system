import { Meta } from '@storybook/react-vite';

import { Hero } from '@/components/Hero';
import { type HeroSlideProps } from '@/components/Hero/HeroSlide';
import { LogoCarousel } from '@/components/LogoCarousel';
import { NewsletterBanner } from '@/components/NewsletterBanner';
import { PromoSection, PromoSectionProps } from '@/components/PromoSection';
import MockSlides from '@/mocks/components/Hero';
import LogoCarouselData from '@/mocks/components/LogoCarousel';
import PromoSectionData from '@/mocks/components/PromoSection';
import BaseTemplate from '@/stories/templates/Base';

const meta: Meta = {
  title: 'Pages/Homepage',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};

export default meta;

const Template = {
  render: () => {
    const promoSectionData = PromoSectionData as PromoSectionProps;
    const hero = [MockSlides?.[0] as HeroSlideProps];

    return (
      <BaseTemplate>
        <Hero items={hero} />

        <PromoSection
          title={promoSectionData.title}
          description={promoSectionData.description}
          subtitle={promoSectionData.subtitle}
          linkUrl={promoSectionData.linkUrl}
          linkText={promoSectionData.linkText}
          imageUrl={promoSectionData.imageUrl}
          alignment={promoSectionData.alignment}
        />
        <LogoCarousel
          title="As featured in"
          items={LogoCarouselData}
        />
        <NewsletterBanner
          title="Connect with us"
          description="Sign up to our newsletter to receive the latest news and updates from our team."
        />
      </BaseTemplate>
    );
  },
};

export const Default = { ...Template, args: {} };
