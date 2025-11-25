import { Button } from '@/components/Button/Button';
import '@/components/Common/Fields.css';
import '@/components/Common/Loader.css';
import ErrorPanel from '@/components/ErrorPanel/ErrorPanel';
import FieldWrapper from '@/components/Form/FieldWrapper/FieldWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

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
  data: SignInFormResult;
  loading: boolean;
  error: Error;
};

function SignInForm({ onSubmit, data, loading, error }: Readonly<SignInFormProps>) {
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

  const [submitComplete, setSubmitComplete] = useState<boolean>(false);

  useEffect(() => {
    if (data?.message === 'SUCCESS') {
      setSubmitComplete(true);
    }
  }, [data]);

  return submitComplete ? (
    <div className="hoam-signin-form__wrapper">
      <h4>Success! Redirecting now...</h4>
    </div>
  ) : (
    <div className="hoam-signin-form__wrapper">
      <form
        className="hoam-signin-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FieldWrapper error={errors?.email_address?.message}>
          <Controller
            name="email_address"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Enter your email address"
                className="hoam-text-field"
                data-valid={errors?.email_address ? 'false' : 'true'}
                disabled={loading}
              />
            )}
          />
        </FieldWrapper>

        <FieldWrapper error={errors?.password?.message}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Enter your password"
                className="hoam-text-field"
                data-valid={errors?.password ? 'false' : 'true'}
                disabled={loading}
              />
            )}
          />
        </FieldWrapper>

        <Button
          type="submit"
          className="hoam-signin-form__button"
          variant="secondary"
        >
          Search
        </Button>
      </form>
    </div>
  );
}

export default SignInForm;
