import { Meta } from '@storybook/react-vite';
import { SubmitHandler } from 'react-hook-form';

import {
  SignInForm,
  type SignInFormResult,
  type SignInFormSchemaType,
} from '@/components/Form/SignIn/SignIn';
import { useMockRequest } from '@/hooks/useMockRequest';
import BaseTemplate from '@/templates/Base';
import { navigateToStory } from '@/utils/navigateToStory';

const meta: Meta = {
  title: 'Pages/Sign In',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};
export default meta;

function StoryTemplate() {
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
}

const Template = {
  render: StoryTemplate,
};

export const Default = { ...Template, args: {} };
