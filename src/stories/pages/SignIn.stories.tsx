import SignInForm, { SignInFormSchemaType } from '@/components/Form/SignIn/SignIn';
import BaseTemplate from '@/templates/Base';
import { navigateToStory } from '@/utils/navigateToStory';
import { useMockRequest } from '@/utils/useMockRequest';
import { Meta } from '@storybook/react-vite';
import React from 'react';
import { SubmitHandler } from 'react-hook-form';

const meta: Meta = {
  title: 'Pages/Sign In',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};
export default meta;

const Template = {
  render: () => {
    const { data, loading, error, run, reset } = useMockRequest<any>();

    const onSubmit: SubmitHandler<SignInFormSchemaType> = () => {
      run({
        delay: 500,
        response: {
          message: 'SUCCESS',
        },
      });

      setTimeout(() => {
        navigateToStory('Pages/Homepage', 'Default');
      }, 3000);
    };

    return (
      <BaseTemplate>
        <div className="container">
          <div className="grid">
            <div className="span-12">
              <h1>Sign in</h1>
              <SignInForm
                onSubmit={onSubmit}
                data={data}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        </div>
      </BaseTemplate>
    );
  },
};

export const Default = { ...Template, args: {} };
