import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod/mini';

import { Button } from '@/components/Button';
import { ErrorPanel } from '@/components/ErrorPanel';
import { FieldLabel } from '@/components/Form/FieldLabel/FieldLabel';
import { FieldWrapper } from '@/components/Form/FieldWrapper/FieldWrapper';
import {
  calculatePasswordStrength,
  PasswordStrengthMeter,
} from '@/components/Form/PasswordStrengthMeter/PasswordStrengthMeter';
import { Container, Grid, GridItem } from '@/components/Layout';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/Form/Form.module.css';

function createRegisterFormSchema(messages: {
  emailInvalid: string;
  passwordMinLength: string;
  passwordUppercase: string;
  passwordLowercase: string;
  passwordDigit: string;
  passwordSpecial: string;
  passwordsDoNotMatch: string;
}) {
  return z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().check(z.email(messages.emailInvalid)),
      password: z.string().check(
        z.minLength(8, messages.passwordMinLength),
        z.regex(/[A-Z]/, messages.passwordUppercase),
        z.regex(/[a-z]/, messages.passwordLowercase),
        z.regex(/\d/, messages.passwordDigit),
        z.regex(/[^A-Za-z0-9]/, messages.passwordSpecial)
      ),
      confirmPassword: z.string(),
    })
    .check(
      z.refine(
        ({ password, confirmPassword }) => confirmPassword === password,
        {
          error: messages.passwordsDoNotMatch,
          path: ['confirmPassword'],
        }
      )
    );
}

export type RegisterFormSchemaType = z.infer<ReturnType<typeof createRegisterFormSchema>>;
export type RegisterFormResult = {
  /** Backend result message used by the registration flow. */
  message: string;
};

export type RegisterFormProps = {
  /** Submit handler for the registration form. */
  onSubmit: SubmitHandler<RegisterFormSchemaType>;
  /** Disables the form while submission is in progress. */
  loading: boolean;
  /** Response data from the consuming registration flow. */
  data?: RegisterFormResult | null | undefined;
  /** Error state rendered as an error panel when present. */
  error?: Error | undefined;
};

export function RegisterForm({ onSubmit, data, error, loading }: Readonly<RegisterFormProps>) {
  const t = useMessages('form');
  const regForm = useMessages('registerForm');
  const registerFormSchema = useMemo(
    () =>
      createRegisterFormSchema({
        emailInvalid: regForm.emailInvalid,
        passwordMinLength: regForm.passwordMinLength,
        passwordUppercase: regForm.passwordUppercase,
        passwordLowercase: regForm.passwordLowercase,
        passwordDigit: regForm.passwordDigit,
        passwordSpecial: regForm.passwordSpecial,
        passwordsDoNotMatch: regForm.passwordsDoNotMatch,
      }),
    [
      regForm.emailInvalid,
      regForm.passwordDigit,
      regForm.passwordLowercase,
      regForm.passwordMinLength,
      regForm.passwordSpecial,
      regForm.passwordUppercase,
      regForm.passwordsDoNotMatch,
    ]
  );
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'all',
  });

  const submitComplete = data?.message === 'SUCCESS';

  const password = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });

  const passwordStrength = calculatePasswordStrength(password);

  const textFieldClasses = styles.textField;

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
      <h1 className={styles.title}>{t.redirect}</h1>
    </div>
  ) : (
    <div className={styles.wrapper}>
      <form
        className={styles.root}
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
        }}
      >
        <h2 className={styles.title}>{regForm.title}</h2>

        <section>
          <FieldLabel htmlFor="firstName">{regForm.firstNameLabel}</FieldLabel>
          <FieldWrapper error={errors?.firstName?.message}>
            <input
              {...register('firstName')}
              id="firstName"
              placeholder={regForm.firstNamePlaceholder}
              className={textFieldClasses}
              data-valid={errors?.firstName ? 'false' : 'true'}
              disabled={loading}
            />
          </FieldWrapper>
        </section>

        <section>
          <FieldLabel htmlFor="lastName">{regForm.lastNameLabel}</FieldLabel>
          <FieldWrapper error={errors?.lastName?.message}>
            <input
              {...register('lastName')}
              id="lastName"
              placeholder={regForm.lastNamePlaceholder}
              className={textFieldClasses}
              data-valid={errors?.lastName ? 'false' : 'true'}
              disabled={loading}
            />
          </FieldWrapper>
        </section>

        <section>
          <FieldLabel htmlFor="email">{regForm.emailLabel}</FieldLabel>
          <FieldWrapper error={errors?.email?.message}>
            <input
              {...register('email')}
              id="email"
              placeholder={regForm.emailPlaceholder}
              className={textFieldClasses}
              data-valid={errors?.email ? 'false' : 'true'}
              disabled={loading}
            />
          </FieldWrapper>
        </section>

        <hr />
        <section>
          <FieldLabel htmlFor="password">{regForm.passwordLabel}</FieldLabel>
          <PasswordStrengthMeter strength={passwordStrength} />
          <FieldWrapper error={errors?.password?.message}>
            <input
              {...register('password')}
              type="password"
              id="password"
              placeholder={regForm.passwordPlaceholder}
              className={textFieldClasses}
              data-valid={errors?.password ? 'false' : 'true'}
              disabled={loading}
            />
          </FieldWrapper>
        </section>

        <section>
          <FieldLabel htmlFor="confirmPassword">{regForm.passwordConfirmLabel}</FieldLabel>
          <FieldWrapper error={errors?.confirmPassword?.message}>
            <input
              {...register('confirmPassword')}
              type="password"
              id="confirmPassword"
              placeholder={regForm.passwordConfirmPlaceholder}
              className={textFieldClasses}
              data-valid={errors?.confirmPassword ? 'false' : 'true'}
              disabled={loading}
            />
          </FieldWrapper>
        </section>

        <Button
          type="submit"
          className={styles.submit}
          variant="tertiary"
        >
          {regForm.submit}
        </Button>
      </form>
    </div>
  );
}
