import { Meta } from '@storybook/react-vite';

import { Hero } from '@/components/Hero';
import { type HeroSlideProps } from '@/components/Hero/HeroSlide';
import { InfoGrid, InfoGridItem } from '@/components/InfoGrid';
import { LogoCarousel } from '@/components/LogoCarousel';
import { PromoSection, PromoSectionProps } from '@/components/PromoSection';
import MockSlides from '@/mocks/components/Hero';
import LogoCarouselData from '@/mocks/components/LogoCarousel';
import PromoSectionData from '@/mocks/components/PromoSection';
import { NewsletterBannerDemo } from '@/stories/components/NewsletterBannerDemo';
import BaseTemplate from '@/stories/templates/Base';

const meta: Meta = {
  title: 'Pages/Homepage',
  parameters: {
    a11y: {
      options: {
        rules: {
          'color-contrast': { enabled: false },
        },
      },
    },
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
          title="Coffee made easier"
          description="Fresh roasts, clear brew guidance, and flexible delivery help every cup taste closer to the one you meant to make."
        >
          <InfoGridItem
            title="Roasted weekly"
            description="Coffee is roasted in small batches and dispatched quickly so beans arrive fresh, aromatic, and ready to rest."
            icon="arrow-right"
          />
          <InfoGridItem
            title="Brew matched"
            description="Each coffee includes practical grind and brew recommendations for espresso, filter, French press, and cold brew."
            icon="plus"
          />
          <InfoGridItem
            title="Flexible delivery"
            description="Subscriptions can be paused, skipped, or switched between espresso, filter, decaf, and seasonal roaster picks."
            icon="dash"
          />
        </InfoGrid>
        <NewsletterBannerDemo />
      </BaseTemplate>
    );
  },
};

export const Default = { ...Template, args: {} };
