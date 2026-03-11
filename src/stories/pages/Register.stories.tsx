import {
  RegisterForm,
  type RegisterFormResult,
  type RegisterFormSchemaType,
} from '@/components/Form/RegisterForm/RegisterForm';
import { useMockRequest } from '@/hooks/useMockRequest';
import BaseTemplate from '@/templates/Base';
import { navigateToStory } from '@/utils/navigateToStory';
import { Meta } from '@storybook/react-vite';

import { SubmitHandler } from 'react-hook-form';

const meta: Meta = {
  title: 'Pages/Register',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};
export default meta;

function StoryTemplate() {
  const { data, loading, error, run } = useMockRequest<RegisterFormResult>();

  const onSubmit: SubmitHandler<RegisterFormSchemaType> = async () => {
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
            <RegisterForm
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
