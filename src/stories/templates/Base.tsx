import { ReactNode } from 'react';
import { SubmitHandler } from 'react-hook-form';

import {
  Footer,
  Navigation,
  NotificationBar,
  SearchFormSchemaType,
  SkipToContentLink,
} from '@/components';
import { navigateToStory } from '@/utils/navigateToStory';
import BasketData from '@/mocks/components/Basket';
import FooterData from '@/mocks/components/Footer';
import NavigationData from '@/mocks/components/Navigation';
import NotificationBarData from '@/mocks/components/NotificationBar';
import UserNavigationData from '@/mocks/components/UserNavigation';
import SocialLinks from '@/mocks/socialLinks';

type BaseTemplateProps = {
  children: ReactNode;
};

function BaseTemplate({ children }: Readonly<BaseTemplateProps>) {
  const onSubmit: SubmitHandler<SearchFormSchemaType> = () => {
    navigateToStory('Pages/Search Results', 'Default');
  };

  return (
    <>
      <SkipToContentLink />
      <NotificationBar messages={NotificationBarData} />
      <Navigation
        items={NavigationData}
        userItems={UserNavigationData}
        searchSubmit={onSubmit}
        basketData={BasketData}
      />
      <main id="content">{children}</main>
      <Footer
        topLinks={FooterData.topLinks}
        bottomLinks={FooterData.bottomLinks}
        socialLinks={SocialLinks}
      />
    </>
  );
}

export default BaseTemplate;
