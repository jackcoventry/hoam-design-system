import { Footer, Navigation, NotificationBar } from '@/components';
import FooterData from '@/mocks/components/Footer';
import NavigationData from '@/mocks/components/Navigation';
import NotificationBarData from '@/mocks/components/NotificationBar';
import UserNavigationData from '@/mocks/components/UserNavigation';
import { ReactNode } from 'react';

type BaseTemplateProps = {
  children: ReactNode;
};

function BaseTemplate({ children }: Readonly<BaseTemplateProps>) {
  return (
    <>
      <NotificationBar messages={NotificationBarData} />
      <Navigation
        items={NavigationData}
        userItems={UserNavigationData}
        variant="default"
      />
      <main id="content">{children}</main>
      <Footer
        topLinks={FooterData.topLinks}
        bottomLinks={FooterData.bottomLinks}
      />
    </>
  );
}

export default BaseTemplate;
