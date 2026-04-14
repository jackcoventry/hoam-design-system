import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

import { Button } from '@/components/Button';
import { BodyText } from '@/components/Common/BodyText';
import { Container, Grid, GridItem, Stack } from '@/components/Layout';

import formStyles from '@/components/Form/Form.module.css';
import styles from '@/components/NewsletterBanner/NewsletterBanner.module.css';
import utils from '@/styles/Util.module.css';

export type NewsletterBannerProps = {
  title: string;
  description?: string | undefined;
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

  const textFieldClasses = formStyles.textField;

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
                <div className={styles.content}>
                  <BodyText>
                    <h2 className={styles.title}>{title}</h2>
                    {description ? <p>{description}</p> : null}
                  </BodyText>
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
                    className={utils.srOnly}
                  >
                    Email address
                  </label>

                  {/* TODO: Form builder */}

                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="newsletter-email"
                        type="email"
                        placeholder={errors.email?.message || 'Enter your email'}
                        className={textFieldClasses}
                        data-valid={errors.email ? 'false' : 'true'}
                        disabled={submitting}
                      />
                    )}
                  />

                  <Button
                    type="submit"
                    className={styles.button}
                    variant="primary"
                  >
                    {submitting ? 'Sending...' : 'Subscribe'}
                  </Button>
                </form>
              </GridItem>
            </Grid>
          </Stack>
        </Container>
      </div>
    </section>
  );
}
