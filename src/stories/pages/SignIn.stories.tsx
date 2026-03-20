import { Meta } from '@storybook/react-vite';
import { SubmitHandler } from 'react-hook-form';

import {
  SignInForm,
  type SignInFormResult,
  type SignInFormSchemaType,
} from '@/components/Form/SignIn/SignIn';
import { Container, Grid, GridItem, Section } from '@/components/Layout';
import { useMockRequest } from '@/hooks/useMockRequest';
import { navigateToStory } from '@/utils/navigateToStory';
import BaseTemplate from '@/stories/templates/Base';

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
      <Section>
        <Container>
          <Grid>
            <GridItem
              span={12}
              spanLg={4}
              startLg={5}
            >
              <SignInForm
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
