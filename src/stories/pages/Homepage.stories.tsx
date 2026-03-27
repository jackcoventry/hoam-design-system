import { Meta } from '@storybook/react-vite';

import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { type HeroSlideProps } from '@/components/Hero/HeroSlide';
import { PageShell } from '@/components/Layout/PageShell';
import { LogoCarousel } from '@/components/LogoCarousel';
import { Navigation } from '@/components/Navigation';
import { NavigationVariant } from '@/components/Navigation/types';
import { NewsletterBanner } from '@/components/NewsletterBanner';
import { NotificationBar } from '@/components/NotificationBar';
import { PromoSection, PromoSectionProps } from '@/components/PromoSection';
import FooterData from '@/mocks/components/Footer';
import MockSlides from '@/mocks/components/Hero';
import LogoCarouselData from '@/mocks/components/LogoCarousel';
import NavigationData from '@/mocks/components/Navigation';
import NotificationBarData from '@/mocks/components/NotificationBar';
import PromoSectionData from '@/mocks/components/PromoSection';
import UserNavigationData from '@/mocks/components/UserNavigation';
import SocialLinks from '@/mocks/socialLinks';

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
    const hero = [MockSlides?.[3] as HeroSlideProps];
    const showNotificationBar = true;
    const navStyle = 'fixed' as NavigationVariant;
    const navIsFixed = navStyle === 'fixed';

    return (
      <PageShell
        showNotificationBar={showNotificationBar}
        navIsFixed={navIsFixed}
      >
        <Navigation
          items={NavigationData}
          userItems={UserNavigationData}
          variant={navStyle}
          searchEndpoint="/"
          basketEndpoint="/"
        />
        <div>
          <Hero items={hero} />
        </div>

        {showNotificationBar && <NotificationBar messages={NotificationBarData} />}

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
        <Footer
          topLinks={FooterData.topLinks}
          bottomLinks={FooterData.bottomLinks}
          socialLinks={SocialLinks}
        />
      </PageShell>
    );
  },
};

export const Default = { ...Template, args: {} };
