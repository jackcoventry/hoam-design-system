import { useMemo } from 'react';
import { SubmitHandler } from 'react-hook-form';

import {
  NewsletterBanner,
  NewsletterSignupSchemaType,
} from '@/components/NewsletterBanner/NewsletterBanner';
import { useAsyncTask } from '@/utils/useAsyncTask';

type NewsletterBannerDemoProps = {
  title?: string | undefined;
  description?: string | undefined;
};

export function NewsletterBannerDemo({
  title = 'Connect with us',
  description = 'Sign up to our newsletter to receive the latest news and updates from our team.',
}: Readonly<NewsletterBannerDemoProps>) {
  const search = useMemo(
    () => async () => {
      const response = {
        title: 'Thanks!',
        description: 'We will be in touch',
      };
      await new Promise((resolve) => setTimeout(resolve, 600));
      return response;
    },
    []
  );

  const { state, run, data } = useAsyncTask(search);

  const onSubmit: SubmitHandler<NewsletterSignupSchemaType> = async () => {
    await run();
  };

  return (
    <NewsletterBanner
      title={data?.title ?? title}
      description={data?.description ?? description}
      state={state}
      onSubmit={onSubmit}
    />
  );
}
