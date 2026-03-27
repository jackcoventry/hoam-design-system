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
    const showNotificationBar = false;
    const navStyle = 'fixed' as NavigationVariant;
    const navIsFixed = navStyle === 'fixed';
    const resolvedNavStyle = showNotificationBar && navIsFixed ? 'sticky' : navStyle;

    return (
      <PageShell
        showNotificationBar={showNotificationBar}
        navIsFixed={navIsFixed}
      >
        {showNotificationBar && <NotificationBar messages={NotificationBarData} />}

        <Navigation
          items={NavigationData}
          userItems={UserNavigationData}
          variant={resolvedNavStyle}
          searchEndpoint="/"
          basketEndpoint="/"
        />
        <div
          style={{
            marginTop: resolvedNavStyle === 'sticky' ? 'calc(var(--hoam-link-height) * -1)' : 0,
          }}
        >
          <Hero items={hero} />
        </div>
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
