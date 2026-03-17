import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

import { Button } from '@/components/Button';
import { FieldWrapper } from '@/components/Form';

import '@/components/Common/Loader.css';
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
  error?: Error | null;
};

export function SignInForm({ onSubmit, data, loading }: Readonly<SignInFormProps>) {
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

  return submitComplete ? (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Success! Redirecting now...</h1>
    </div>
  ) : (
    <div className={styles.wrapper}>
      <form
        className={styles.root}
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
        }}
      >
        <h2 className={styles.title}>Sign in</h2>

        <FieldWrapper error={errors.email_address?.message}>
          <Controller
            name="email_address"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Enter your email address"
                className={styles.textField}
                data-valid={errors.email_address ? 'false' : 'true'}
                disabled={loading}
              />
            )}
          />
        </FieldWrapper>

        <FieldWrapper error={errors.password?.message}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                placeholder="Enter your password"
                className={styles.textField}
                data-valid={errors.password ? 'false' : 'true'}
                disabled={loading}
              />
            )}
          />
        </FieldWrapper>

        <Button
          type="submit"
          className={styles.submit}
          variant="secondary"
        >
          Sign in
        </Button>
      </form>
    </div>
  );
}
