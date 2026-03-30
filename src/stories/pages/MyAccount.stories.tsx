import { Meta } from '@storybook/react-vite';

import { Container, Grid, GridItem, Section, Stack } from '@/components/Layout';
import { RichLink } from '@/components/RichLink';
import { SidebarNavigation } from '@/components/SidebarNavigation';
import RichLinksData from '@/mocks/components/RichLinks';
import SidebarNavigationData from '@/mocks/components/SidebarNavigation';
import BaseTemplate from '@/stories/templates/Base';

import typography from '@/styles/Typography.module.css';

const meta: Meta = {
  title: 'Pages/Account',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};
export default meta;

const Template = {
  render: () => (
    <BaseTemplate>
      <Section space="2xl">
        <Container>
          <Grid>
            <GridItem span={12}>
              <h1 className={typography.subtitle}>My Account</h1>
            </GridItem>
          </Grid>
          <Section space="2xl">
            <Grid>
              <GridItem
                span={12}
                spanLg={3}
              >
                <SidebarNavigation items={SidebarNavigationData} />
              </GridItem>
              <GridItem
                span={12}
                spanLg={8}
                startLg={5}
              >
                <Stack gap="xl">
                  <Grid cols={12}>
                    {RichLinksData?.map((item) => (
                      <GridItem
                        key={item.href}
                        span={12}
                        spanMd={6}
                      >
                        <RichLink
                          title={item.title}
                          href={item.href}
                          image={item.image}
                          imageAlt={item.imageAlt}
                        />
                      </GridItem>
                    ))}
                  </Grid>
                </Stack>
              </GridItem>
            </Grid>
          </Section>
        </Container>
      </Section>
    </BaseTemplate>
  ),
};

export const Default = { ...Template, args: {} };
