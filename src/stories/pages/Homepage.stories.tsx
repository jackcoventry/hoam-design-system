import { Meta } from '@storybook/react-vite';

import { Hero } from '@/components/Hero';
import { type HeroSlideProps } from '@/components/Hero/HeroSlide';
import { InfoGrid, InfoGridItem } from '@/components/InfoGrid';
import { LogoCarousel } from '@/components/LogoCarousel';
import { NewsletterBanner } from '@/components/NewsletterBanner';
import { PromoSection, PromoSectionProps } from '@/components/PromoSection';
import MockSlides from '@/mocks/components/Hero';
import LogoCarouselData from '@/mocks/components/LogoCarousel';
import PromoSectionData from '@/mocks/components/PromoSection';
import BaseTemplate from '@/stories/templates/Base';

const meta: Meta = {
  title: 'Pages/Homepage',
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
        <InfoGrid
          title="Why us?"
          description="Fugiat esse consequat ad aliquip amet aliquip sed sit voluptate. Enim est culpa labore pariatur aliquip culpa mollit excepteur officia ea magna"
        >
          <InfoGridItem
            title="Point 1"
            description="Fugiat esse consequat ad aliquip amet aliquip sed sit voluptate. Enim est culpa labore pariatur aliquip culpa mollit excepteur officia ea magna"
            icon="arrow-right"
          />
          <InfoGridItem
            title="Point 2"
            description="Fugiat esse consequat ad aliquip amet aliquip sed sit voluptate. Enim est culpa labore pariatur aliquip culpa mollit excepteur officia ea magna"
            icon="plus"
          />
          <InfoGridItem
            title="Point 3"
            description="Fugiat esse consequat ad aliquip amet aliquip sed sit voluptate. Enim est culpa labore pariatur aliquip culpa mollit excepteur officia ea magna"
            icon="dash"
          />
        </InfoGrid>
        <NewsletterBanner
          title="Connect with us"
          description="Sign up to our newsletter to receive the latest news and updates from our team."
        />
      </BaseTemplate>
    );
  },
};

export const Default = { ...Template, args: {} };
