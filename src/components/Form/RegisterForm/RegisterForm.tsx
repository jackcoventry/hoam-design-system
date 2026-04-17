import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import z from 'zod';

import { Button } from '@/components/Button';
import { ErrorPanel } from '@/components/ErrorPanel';
import {
  calculatePasswordStrength,
  FieldLabel,
  FieldWrapper,
  PasswordStrengthMeter,
} from '@/components/Form';
import { Container, Grid, GridItem } from '@/components/Layout';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/Form/Form.module.css';

const RegisterFormSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.email(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/\d/, 'Must contain at least one digit')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

export type RegisterFormSchemaType = z.infer<typeof RegisterFormSchema>;
export type RegisterFormResult = {
  message: string;
};

export type RegisterFormProps = {
  onSubmit: SubmitHandler<RegisterFormSchemaType>;
  loading: boolean;
  data?: RegisterFormResult | null | undefined;
  error?: Error | undefined;
};

export function RegisterForm({ onSubmit, data, error, loading }: Readonly<RegisterFormProps>) {
  const t = useMessages('form');
  const regForm = useMessages('registerForm');
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(RegisterFormSchema),
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
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="firstName"
                  placeholder={regForm.firstNamePlaceholder}
                  className={textFieldClasses}
                  data-valid={errors?.firstName ? 'false' : 'true'}
                  disabled={loading}
                />
              )}
            />
          </FieldWrapper>
        </section>

        <section>
          <FieldLabel htmlFor="lastName">{regForm.lastNameLabel}</FieldLabel>
          <FieldWrapper error={errors?.lastName?.message}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="lastName"
                  placeholder={regForm.lastNamePlaceholder}
                  className={textFieldClasses}
                  data-valid={errors?.lastName ? 'false' : 'true'}
                  disabled={loading}
                />
              )}
            />
          </FieldWrapper>
        </section>

        <section>
          <FieldLabel htmlFor="email">{regForm.emailLabel}</FieldLabel>
          <FieldWrapper error={errors?.email?.message}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="email"
                  placeholder={regForm.emailPlaceholder}
                  className={textFieldClasses}
                  data-valid={errors?.email ? 'false' : 'true'}
                  disabled={loading}
                />
              )}
            />
          </FieldWrapper>
        </section>

        <hr />
        <section>
          <FieldLabel htmlFor="password">{regForm.passwordLabel}</FieldLabel>
          <PasswordStrengthMeter strength={passwordStrength} />
          <FieldWrapper error={errors?.password?.message}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  id="password"
                  placeholder={regForm.passwordPlaceholder}
                  className={textFieldClasses}
                  data-valid={errors?.password ? 'false' : 'true'}
                  disabled={loading}
                />
              )}
            />
          </FieldWrapper>
        </section>

        <section>
          <FieldLabel htmlFor="confirmPassword">{regForm.passwordConfirmLabel}</FieldLabel>
          <FieldWrapper error={errors?.confirmPassword?.message}>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  id="confirmPassword"
                  placeholder={regForm.passwordConfirmPlaceholder}
                  className={textFieldClasses}
                  data-valid={errors?.confirmPassword ? 'false' : 'true'}
                  disabled={loading}
                />
              )}
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
