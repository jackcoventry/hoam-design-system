import { Button } from '@/components/Button/Button';
import FieldWrapper from '@/components/Form/FieldWrapper/FieldWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

import '@/components/Common/Fields.css';
import '@/components/Common/Form.css';
import '@/components/Common/Loader.css';

const SignInFormSchema = z.object({
  email_address: z.email().trim().min(1, { message: 'Enter a valid email address!' }),
  password: z.string().trim().min(5, { message: 'Password must be at least 5 characters' }),
});

export type SignInFormSchemaType = z.infer<typeof SignInFormSchema>;
export type SignInFormResult = {
  message: string;
};

type SignInFormProps = {
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
    <div className="hoam-form__wrapper">
      <h1 className="hoam-form__title">Success! Redirecting now...</h1>
    </div>
  ) : (
    <div className="hoam-form__wrapper">
      <form
        className="hoam-form"
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
        }}
      >
        <h2 className="hoam-form__title">Sign in</h2>

        <FieldWrapper error={errors.email_address?.message}>
          <Controller
            name="email_address"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Enter your email address"
                className="hoam-text-field"
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
                className="hoam-text-field"
                data-valid={errors.password ? 'false' : 'true'}
                disabled={loading}
              />
            )}
          />
        </FieldWrapper>

        <Button
          type="submit"
          className="hoam-form__submit"
          variant="secondary"
        >
          Sign in
        </Button>
      </form>
    </div>
  );
}
