import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

import { Button } from '@/components/Button';
import type { Link } from '@/components/Footer';
import { Icon } from '@/components/Icon';
import { Container, Grid, GridItem, Stack } from '@/components/Layout';
import { IconId } from '@/design-tokens/icons';

import bodyText from '@/styles/BodyText.module.css';
import formStyles from '@/components/Form/Form.module.css';
import styles from '@/components/NewsletterBanner/NewsletterBanner.module.css';

export type NewsletterBannerProps = {
  title: string;
  description?: string | undefined;
  socialLinks?: Array<Link>;
};

const SUBMIT_DELAY_MS = 2000;

const NewsletterSignupSchema = z.object({
  email: z.email('Please enter a valid email!'),
});

type NewsletterSignupSchemaType = z.infer<typeof NewsletterSignupSchema>;

export function NewsletterBanner({
  title,
  description,
  socialLinks,
}: Readonly<NewsletterBannerProps>) {
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
      <div className={styles.wrapper}>
        <Container>
          <Stack gap="lg">
            <Grid>
              <GridItem
                span={12}
                spanLg={6}
                startLg={4}
              >
                <div className={clsx(styles.content, bodyText.root)}>
                  <h2 className={styles.title}>{title}</h2>
                  {description ? <p>{description}</p> : null}
                </div>
              </GridItem>
            </Grid>

            <Grid>
              <GridItem
                span={12}
                spanLg={6}
                spanXl={4}
                startLg={4}
                startXl={5}
              >
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
              </GridItem>
            </Grid>

            <Grid>
              <GridItem
                span={12}
                spanLg={6}
                startLg={4}
              >
                <div className={styles.socialLinks}>
                  {socialLinks?.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label={link.label}
                    >
                      <Icon id={link.icon as IconId} />
                    </a>
                  ))}
                </div>
              </GridItem>
            </Grid>
          </Stack>
        </Container>
      </div>
    </section>
  );
}
