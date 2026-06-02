import { useId, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod/mini';

import { Button } from '@/components/Button';
import { ErrorPanel } from '@/components/ErrorPanel';
import { FieldLabel } from '@/components/Form/FieldLabel/FieldLabel';
import { FieldWrapper } from '@/components/Form/FieldWrapper/FieldWrapper';
import { Container, Grid, GridItem } from '@/components/Layout';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/Form/Form.module.css';

function createSignInFormSchema(messages: { invalidEmail: string; passwordMinLength: string }) {
  return z.object({
    email_address: z
      .string()
      .check(z.trim(), z.minLength(1, messages.invalidEmail), z.email(messages.invalidEmail)),
    password: z.string().check(z.trim(), z.minLength(5, messages.passwordMinLength)),
  });
}

export type SignInFormSchemaType = z.infer<ReturnType<typeof createSignInFormSchema>>;
export type SignInFormResult = {
  /** Backend result message used by the sign-in flow. */
  message: string;
};

export type SignInFormProps = {
  /** Submit handler for the sign-in form. */
  onSubmit: SubmitHandler<SignInFormSchemaType>;
  /** Disables the form while submission is in progress. */
  loading: boolean;
  /** Response data from the consuming sign-in flow. */
  data?: SignInFormResult | null;
  /** Error state rendered as an error panel when present. */
  error?: Error | undefined;
};

export function SignInForm({ onSubmit, data, error, loading }: Readonly<SignInFormProps>) {
  const tForm = useMessages('form');
  const t = useMessages('signIn');
  const baseId = useId();
  const signInFormSchema = useMemo(
    () =>
      createSignInFormSchema({
        invalidEmail: t.invalidEmail,
        passwordMinLength: t.passwordMinLength,
      }),
    [t.invalidEmail, t.passwordMinLength]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormSchemaType>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email_address: '',
      password: '',
    },
    mode: 'all',
  });

  const submitComplete = data?.message === 'SUCCESS';

  const textFieldClasses = styles.textField;
  const emailId = `${baseId}-email`;
  const passwordId = `${baseId}-password`;
  const emailErrorId = errors.email_address ? `${emailId}-error` : undefined;
  const passwordErrorId = errors.password ? `${passwordId}-error` : undefined;

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

        <FieldWrapper
          error={errors.email_address?.message}
          errorId={emailErrorId}
        >
          <FieldLabel htmlFor={emailId}>{t.emailPlaceholder}</FieldLabel>
          <input
            {...register('email_address')}
            id={emailId}
            type="email"
            placeholder={t.emailPlaceholder}
            className={textFieldClasses}
            data-valid={errors.email_address ? 'false' : 'true'}
            autoComplete="email"
            aria-invalid={errors.email_address ? 'true' : 'false'}
            aria-describedby={emailErrorId}
            disabled={loading}
          />
        </FieldWrapper>

        <FieldWrapper
          error={errors.password?.message}
          errorId={passwordErrorId}
        >
          <FieldLabel htmlFor={passwordId}>{t.passwordPlaceholder}</FieldLabel>
          <input
            {...register('password')}
            id={passwordId}
            type="password"
            placeholder={t.passwordPlaceholder}
            className={textFieldClasses}
            data-valid={errors.password ? 'false' : 'true'}
            autoComplete="current-password"
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={passwordErrorId}
            disabled={loading}
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
