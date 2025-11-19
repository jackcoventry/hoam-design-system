import NotificationBar from '@/components/NotificationBar/NotificationBar';
import FooterData from '@/mocks/components/Footer.json';
import MockSlides from '@/mocks/components/Hero.json';
import LogoCarouselData from '@/mocks/components/LogoCarousel.json';
import NavigationData from '@/mocks/components/Navigation.json';
import NotificationBarData from '@/mocks/components/NotificationBar';
import PromoSectionData from '@/mocks/components/PromoSection.json';
import UserNavigationData from '@/mocks/components/UserNavigation.json';

import { Meta } from '@storybook/react-vite';

import Footer from '@/components/Footer/Footer';
import Hero, { HeroSlide } from '@/components/Hero/Hero';
import LogoCarousel from '@/components/LogoCarousel/LogoCarousel';
import Navigation from '@/components/Navigation/Navigation';
import NewsletterBanner from '@/components/NewsletterBanner/NewsletterBanner';
import PromoSection from '@/components/PromoSection/PromoSection';
import React from 'react';

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
  render: (args) => {
    return (
      <>
        <NotificationBar messages={NotificationBarData} />
        <Navigation
          items={NavigationData}
          userItems={UserNavigationData}
          variant="default"
        />

        <Hero>
          {HeroData.map((slide) => (
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
          ))}
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
