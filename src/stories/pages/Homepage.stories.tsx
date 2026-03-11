import { Meta } from '@storybook/react-vite';

import { Footer } from '@/components/Footer';
import { Hero, HeroSlide } from '@/components/Hero';
import { LogoCarousel } from '@/components/LogoCarousel';
import { Navigation } from '@/components/Navigation';
import { NewsletterBanner } from '@/components/NewsletterBanner';
import { NotificationBar } from '@/components/NotificationBar';
import { PromoSection } from '@/components/PromoSection';
import FooterData from '@/mocks/components/Footer';
import MockSlides from '@/mocks/components/Hero';
import LogoCarouselData from '@/mocks/components/LogoCarousel';
import NavigationData from '@/mocks/components/Navigation';
import NotificationBarData from '@/mocks/components/NotificationBar';
import PromoSectionData from '@/mocks/components/PromoSection';
import UserNavigationData from '@/mocks/components/UserNavigation';

const meta: Meta = {
  title: 'Pages/Homepage',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};

export default meta;

const HeroData = [MockSlides[3]];

const Template = {
  render: () => {
    return (
      <>
        <NotificationBar messages={NotificationBarData} />
        <Navigation
          items={NavigationData}
          userItems={UserNavigationData}
          variant="default"
        />

        <Hero>
          {HeroData.map((slide) => {
            if (!slide) return null;
            return (
              <HeroSlide
                key={slide.image}
                title={slide.title}
                subtitle={slide.subtitle}
                text={slide.text}
                theme={slide.theme}
                image={slide.image}
                video={slide.video}
                button={slide.button}
                position={slide.position}
              />
            );
          })}
        </Hero>
        <PromoSection
          title={PromoSectionData.title}
          description={PromoSectionData.description}
          subtitle={PromoSectionData.subtitle}
          linkUrl={PromoSectionData.linkUrl}
          linkText={PromoSectionData.linkText}
          imageUrl={PromoSectionData.imageUrl}
          alignment={PromoSectionData.alignment}
        />
        <LogoCarousel
          title="As featured in"
          items={LogoCarouselData}
        />
        <NewsletterBanner
          title="Connect with us"
          description="Sign up to our newsletter to receive the latest news and updates from our team."
        />
        <Footer
          topLinks={FooterData.topLinks}
          bottomLinks={FooterData.bottomLinks}
        />
      </>
    );
  },
};

export const Default = { ...Template, args: {} };
