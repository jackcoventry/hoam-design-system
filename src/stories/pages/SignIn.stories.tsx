import { SignInForm, SignInFormResult, SignInFormSchemaType } from '@/components/Form';
import { useMockRequest } from '@/hooks/useMockRequest';
import BaseTemplate from '@/templates/Base';
import { navigateToStory } from '@/utils/navigateToStory';
import { Meta } from '@storybook/react-vite';
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
    const { data, loading, error, run } = useMockRequest<SignInFormResult>();

    const onSubmit: SubmitHandler<SignInFormSchemaType> = async () => {
      await run({
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
        <div className="container | py-2xl">
          <div className="grid">
            <div className="span-12 lg:span-4 lg:start-5">
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
