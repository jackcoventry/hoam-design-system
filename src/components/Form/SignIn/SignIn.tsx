import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

import { Button } from '@/components/Button';
import { ErrorPanel } from '@/components/ErrorPanel';
import { FieldLabel, FieldWrapper } from '@/components/Form';
import { Container, Grid, GridItem } from '@/components/Layout';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/Form/Form.module.css';

const SignInFormSchema = z.object({
  email_address: z.email().trim().min(1, { message: 'Enter a valid email address!' }),
  password: z.string().trim().min(5, { message: 'Password must be at least 5 characters' }),
});

export type SignInFormSchemaType = z.infer<typeof SignInFormSchema>;
export type SignInFormResult = {
  message: string;
};

export type SignInFormProps = {
  onSubmit: SubmitHandler<SignInFormSchemaType>;
  loading: boolean;
  data?: SignInFormResult | null;
  error?: Error | undefined;
};

export function SignInForm({ onSubmit, data, error, loading }: Readonly<SignInFormProps>) {
  const tForm = useMessages('form');
  const t = useMessages('signIn');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormSchemaType>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email_address: '',
      password: '',
    },
    mode: 'all',
  });

  const submitComplete = data?.message === 'SUCCESS';

  const textFieldClasses = styles.textField;
  const emailId = 'sign-in-email';
  const passwordId = 'sign-in-password';

  if (error) {
    return (
      <Container>
        <Grid>
          <GridItem span={12}>
            <ErrorPanel message={error.message} />
          </GridItem>
        </Grid>
      </Container>
    );
  }

  return submitComplete ? (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{tForm.redirect}</h1>
    </div>
  ) : (
    <div className={styles.wrapper}>
      <form
        className={styles.root}
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
        }}
      >
        <h2 className={styles.title}>{t.title}</h2>

        <FieldWrapper error={errors.email_address?.message}>
          <FieldLabel htmlFor={emailId}>{t.emailPlaceholder}</FieldLabel>
          <Controller
            name="email_address"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id={emailId}
                type="email"
                placeholder={t.emailPlaceholder}
                className={textFieldClasses}
                data-valid={errors.email_address ? 'false' : 'true'}
                autoComplete="email"
                aria-invalid={errors.email_address ? 'true' : 'false'}
                disabled={loading}
              />
            )}
          />
        </FieldWrapper>

        <FieldWrapper error={errors.password?.message}>
          <FieldLabel htmlFor={passwordId}>{t.passwordPlaceholder}</FieldLabel>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id={passwordId}
                type="password"
                placeholder={t.passwordPlaceholder}
                className={textFieldClasses}
                data-valid={errors.password ? 'false' : 'true'}
                autoComplete="current-password"
                aria-invalid={errors.password ? 'true' : 'false'}
                disabled={loading}
              />
            )}
          />
        </FieldWrapper>

        <Button
          type="submit"
          className={styles.submit}
          variant="tertiary"
        >
          {t.submit}
        </Button>
      </form>
    </div>
  );
}
