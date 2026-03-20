import { Meta } from '@storybook/react-vite';
import { SubmitHandler } from 'react-hook-form';

import {
  RegisterForm,
  type RegisterFormResult,
  type RegisterFormSchemaType,
} from '@/components/Form/RegisterForm/RegisterForm';
import { Container, Grid, GridItem, Section } from '@/components/Layout';
import { useMockRequest } from '@/hooks/useMockRequest';
import { navigateToStory } from '@/utils/navigateToStory';
import BaseTemplate from '@/stories/templates/Base';

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
      <Section>
        <Container>
          <Grid>
            <GridItem
              span={12}
              spanLg={4}
              startLg={5}
            >
              <RegisterForm
                onSubmit={onSubmit}
                data={data}
                loading={loading}
                error={error}
              />
            </GridItem>
          </Grid>
        </Container>
      </Section>
    </BaseTemplate>
  );
}

const Template = {
  render: StoryTemplate,
};

export const Default = { ...Template, args: {} };
