import { Button } from '@/components/Button/Button';
import '@/components/Common/Fields.css';
import '@/components/Common/Form.css';
import '@/components/Common/Loader.css';
import FieldLabel from '@/components/Form/FieldLabel/FieldLabel';
import FieldWrapper from '@/components/Form/FieldWrapper/FieldWrapper';
import PasswordStrengthMeter, {
  calculatePasswordStrength,
} from '@/components/Form/PasswordStrengthMeter/PasswordStrengthMeter';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

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
      .regex(/[0-9]/, 'Must contain at least one digit')
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

type RegisterFormProps = {
  onSubmit: SubmitHandler<RegisterFormSchemaType>;
  data: RegisterFormResult;
  loading: boolean;
  error: Error;
};

function RegisterForm({ onSubmit, data, loading, error }: Readonly<RegisterFormProps>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
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

  const [submitComplete, setSubmitComplete] = useState<boolean>(false);

  useEffect(() => {
    if (data?.message === 'SUCCESS') {
      setSubmitComplete(true);
    }
  }, [data]);

  const password = watch('password', '');
  const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);

  return submitComplete ? (
    <div className="hoam-form__wrapper">
      <h1 className="hoam-form__title">Success! Redirecting now...</h1>
    </div>
  ) : (
    <div className="hoam-form__wrapper">
      <form
        className="hoam-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="hoam-form__title">Register</h2>

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
                  className="hoam-text-field"
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
                  className="hoam-text-field"
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
                  className="hoam-text-field"
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
                  className="hoam-text-field"
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
                  className="hoam-text-field"
                  data-valid={errors?.confirmPassword ? 'false' : 'true'}
                  disabled={loading}
                />
              )}
            />
          </FieldWrapper>
        </section>

        <Button
          type="submit"
          className="hoam-form__button"
          variant="secondary"
        >
          Register
        </Button>
      </form>
    </div>
  );
}

export default RegisterForm;
