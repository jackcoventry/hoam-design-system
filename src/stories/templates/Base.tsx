import { ReactNode, useMemo } from 'react';
import { SubmitHandler } from 'react-hook-form';

import {
  Footer,
  Navigation,
  NotificationBar,
  SearchFormResult,
  SearchFormSchemaType,
  SkipToContentLink,
} from '@/components';
import { useAsyncTask } from '@/utils/useAsyncTask';
import BasketData from '@/mocks/components/Basket';
import FooterData from '@/mocks/components/Footer';
import NavigationData from '@/mocks/components/Navigation';
import NotificationBarData from '@/mocks/components/NotificationBar';
import SearchFormData from '@/mocks/components/SearchResults';
import UserNavigationData from '@/mocks/components/UserNavigation';
import SocialLinks from '@/mocks/socialLinks';

type BaseTemplateProps = {
  children: ReactNode;
};

function BaseTemplate({ children }: Readonly<BaseTemplateProps>) {
  const search = useMemo(
    () => async () => {
      const response = SearchFormData as SearchFormResult[];
      await new Promise((resolve) => setTimeout(resolve, 600));
      return response;
    },
    []
  );

  const { state, run, data } = useAsyncTask(search);

  const onSubmit: SubmitHandler<SearchFormSchemaType> = async () => {
    await run();
  };

  return (
    <>
      <SkipToContentLink />
      <NotificationBar messages={NotificationBarData} />
      <Navigation
        items={NavigationData}
        userItems={UserNavigationData}
        searchSubmit={onSubmit}
        searchData={data}
        searchState={state}
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
