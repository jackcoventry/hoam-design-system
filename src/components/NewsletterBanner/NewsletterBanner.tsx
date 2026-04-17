import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

import { Button } from '@/components/Button';
import { BodyText } from '@/components/Common/BodyText';
import { Container, Grid, GridItem, Stack } from '@/components/Layout';
import { useMessages } from '@/hooks/useMessages';
import { AsyncState } from '@/types/async';

import formStyles from '@/components/Form/Form.module.css';
import styles from '@/components/NewsletterBanner/NewsletterBanner.module.css';
import utils from '@/styles/Util.module.css';

export type NewsletterBannerProps<TData, TError extends Error = Error> = {
  title: string;
  description?: string | undefined;
  onSubmit: SubmitHandler<NewsletterSignupSchemaType>;
  state: AsyncState<TData, TError>;
};

const NewsletterSignupSchema = z.object({
  email: z.email('Please enter a valid email!'),
});

export type NewsletterSignupSchemaType = z.infer<typeof NewsletterSignupSchema>;

export function NewsletterBanner<TData, TError extends Error = Error>({
  title,
  description,
  state,
  onSubmit,
}: Readonly<NewsletterBannerProps<TData, TError>>) {
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
  const t = useMessages('newsletter');

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

            {state.status === 'success' ? null : (
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
                      {t.emailLabel}
                    </label>

                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="newsletter-email"
                          type="email"
                          placeholder={errors.email?.message || t.emailPlaceholder}
                          className={textFieldClasses}
                          data-valid={errors.email ? 'false' : 'true'}
                          disabled={state.status === 'loading'}
                        />
                      )}
                    />

                    <Button
                      type="submit"
                      className={styles.button}
                      variant="primary"
                    >
                      {state.status === 'loading' ? t.sending : t.submit}
                    </Button>
                  </form>
                </GridItem>
              </Grid>
            )}
          </Stack>
        </Container>
      </div>
    </section>
  );
}
