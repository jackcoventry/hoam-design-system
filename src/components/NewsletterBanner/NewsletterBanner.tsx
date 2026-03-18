import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

import { Button } from '@/components/Button';
import type { SocialLink } from '@/components/Footer';

import '@/components/Common/Dots.css';
import formStyles from '@/components/Form/Form.module.css';
import styles from '@/components/NewsletterBanner/NewsletterBanner.module.css';

export type NewsletterBannerProps = {
  title: string;
  description?: string | undefined;
  socialLinks?: Array<SocialLink>;
};

const SUBMIT_DELAY_MS = 2000;

const NewsletterSignupSchema = z.object({
  email: z.email('Please enter a valid email!'),
});

type NewsletterSignupSchemaType = z.infer<typeof NewsletterSignupSchema>;

export function NewsletterBanner({ title, description }: Readonly<NewsletterBannerProps>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsletterSignupSchemaType>({
    resolver: zodResolver(NewsletterSignupSchema),
    defaultValues: {
      email: '',
    },
    mode: 'all',
  });

  const [submitting, setSubmitting] = useState(false);

  const onSubmit: SubmitHandler<NewsletterSignupSchemaType> = async () => {
    setSubmitting(true);

    await new Promise((resolve) => {
      setTimeout(resolve, SUBMIT_DELAY_MS);
    });

    setSubmitting(false);
  };

  return (
    <section className={styles.root}>
      <div className={clsx(styles.wrapper, 'container')}>
        <div className="grid">
          <div className={clsx(styles.content, 'span-12 lg:span-6 lg:start-4 body-text')}>
            <h2 className={styles.title}>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
        </div>

        <div className="grid">
          <div className="span-12 lg:span-6 xl:span-4 lg:start-4 xl:start-5">
            <form
              className={styles.form}
              onSubmit={(event) => {
                void handleSubmit(onSubmit)(event);
              }}
            >
              <label
                htmlFor="newsletter-email"
                className="sr-only"
              >
                Email address
              </label>

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="newsletter-email"
                    type="email"
                    placeholder={errors.email?.message || 'Enter your email'}
                    className={formStyles.textField}
                    data-valid={errors.email ? 'false' : 'true'}
                    disabled={submitting}
                  />
                )}
              />

              <Button
                type="submit"
                className={styles.button}
                variant="secondary"
              >
                {submitting ? 'Sending...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        <div className="grid">
          <div className="span-12 lg:span-6 lg:start-4">
            <div className={styles.socialLinks}>
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={link.name}
                >
                  <svg
                    className="icon"
                    width="1.25em"
                    height="1.25em"
                    fill="currentColor"
                  >
                    <use xlinkHref={`/icons/icons.svg#${link.icon}`} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
