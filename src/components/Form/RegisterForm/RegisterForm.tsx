import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import z from 'zod';

import { Button } from '@/components/Button';
import {
  calculatePasswordStrength,
  FieldLabel,
  FieldWrapper,
  PasswordStrengthMeter,
} from '@/components/Form';

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
  error?: Error | null;
};

export function RegisterForm({ onSubmit, data, loading, error }: Readonly<RegisterFormProps>) {
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

  return submitComplete ? (
    // TODO: This should be it's own mini component
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Success! Redirecting now...</h1>
    </div>
  ) : (
    <div className={styles.wrapper}>
      <h1>{loading ? 'LOAD' : 'No'}</h1>
      <form
        className={styles.root}
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
        }}
      >
        {/* TODO: This can be structured dynamically like a form builder */}

        <h2 className={styles.title}>Register</h2>

        <section>
          <FieldLabel htmlFor="firstName">First Name</FieldLabel>
          <FieldWrapper error={errors?.firstName?.message}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="firstName"
                  placeholder="Enter your first name"
                  className={textFieldClasses}
                  data-valid={errors?.firstName ? 'false' : 'true'}
                  disabled={loading}
                />
              )}
            />
          </FieldWrapper>
        </section>

        <section>
          <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
          <FieldWrapper error={errors?.lastName?.message}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="lastName"
                  placeholder="Enter your last name"
                  className={textFieldClasses}
                  data-valid={errors?.lastName ? 'false' : 'true'}
                  disabled={loading}
                />
              )}
            />
          </FieldWrapper>
        </section>

        <section>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldWrapper error={errors?.email?.message}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="email"
                  placeholder="Enter your email address"
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
          <FieldLabel htmlFor="password">Password</FieldLabel>
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
                  placeholder="Enter your password"
                  className={textFieldClasses}
                  data-valid={errors?.password ? 'false' : 'true'}
                  disabled={loading}
                />
              )}
            />
          </FieldWrapper>
        </section>

        <section>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <FieldWrapper error={errors?.confirmPassword?.message}>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your password"
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
          Register
        </Button>
      </form>
    </div>
  );
}
