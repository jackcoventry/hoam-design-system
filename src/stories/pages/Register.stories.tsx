import { Meta } from '@storybook/react-vite';
import { SubmitHandler } from 'react-hook-form';

import {
  RegisterForm,
  type RegisterFormSchemaType,
} from '@/components/Form/RegisterForm/RegisterForm';
import { Container, Grid, GridItem, Section } from '@/components/Layout';
import { navigateToStory } from '@/utils/navigateToStory';
import BaseTemplate from '@/stories/templates/Base';

const meta: Meta = {
  title: 'Pages/Register',
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};
export default meta;

function StoryTemplate(props: Readonly<{ showError: boolean }>) {
  const { showError } = props;

  const onSubmit: SubmitHandler<RegisterFormSchemaType> = async () => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!showError) {
          navigateToStory('Pages/Homepage', 'Default');
        }
      }, 500);
      resolve();
    });
  };

  return (
    <BaseTemplate>
      <Section space="2xl">
        <Container>
          <Grid>
            <GridItem
              span={12}
              spanLg={4}
              startLg={5}
            >
              {/* TODO: Add loading/error states */}
              <RegisterForm
                onSubmit={onSubmit}
                loading={false}
                error={null}
              />
            </GridItem>
          </Grid>
        </Container>
      </Section>
    </BaseTemplate>
  );
}

const Template = {
  render: (args: { showError: boolean }) => <StoryTemplate showError={args.showError} />,
};

export const Default = { ...Template, args: {} };
export const WithError = { ...Template, args: { showError: true } };
