import { Button } from '@/components/Button/Button';
import '@/components/Common/Dots.css';
import socialLinks from '@/mocks/socialLinks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import './NewsletterBanner.css';

type NewsletterBannerProps = {
  title: string;
  description?: string;
};

const NewsletterSignupSchema = z.object({
  email: z.email('Please enter a valid email!'),
});

type NewsletterSignupSchemaType = z.infer<typeof NewsletterSignupSchema>;

function NewsletterBanner({ title, description }: Readonly<NewsletterBannerProps>) {
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

  const [submitting, setSubmitting] = useState<boolean>(false);

  const onSubmit: SubmitHandler<NewsletterSignupSchemaType> = () => {
    setSubmitting(true);

    // TODO: temporary, to mimic server response.
    setTimeout(() => {
      setSubmitting(false);
    }, 2000);
  };

  return (
    <section className="hoam-newsletter-banner">
      <div className="hoam-newsletter-banner__wrapper | container">
        <div className="grid">
          <div className="hoam-newsletter-banner__content | span-12 lg:span-6 lg:start-4 body-text">
            {title && <h2 className="hoam-newsletter-banner__title">{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        </div>
        <div className="grid">
          <div className="span-12 lg:span-6 xl:span-4 lg:start-4 xl:start-5">
            <form
              className="hoam-newsletter-banner__form"
              onSubmit={(event) => {
                void handleSubmit(onSubmit)(event);
              }}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    placeholder={errors?.email?.message || 'Enter your email'}
                    className="hoam-text-field"
                    data-valid={errors?.email ? 'false' : 'true'}
                    disabled={submitting}
                  />
                )}
              />

              <Button
                type="submit"
                className="hoam-newsletter-banner__button"
                variant="secondary"
              >
                {submitting ? 'Sending...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>
        <div className="grid">
          <div className="span-12 lg:span-6 lg:start-4">
            <div className="hoam-newsletter-banner__social-links">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hoam-newsletter-banner__social-link"
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

export default NewsletterBanner;
