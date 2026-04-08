import { Meta } from '@storybook/react-vite';

import { Banner, type BannerProps } from '@/components/Banner';
import { Button } from '@/components/Button';
import { Container, Grid, GridItem, Section, Stack } from '@/components/Layout';
import { Pagination } from '@/components/Pagination';
import { ProductTile } from '@/components/ProductTile';
import { productTile } from '@/mocks/components/ProductTile';
import BaseTemplate from '@/stories/templates/Base';

import typography from '@/styles/Typography.module.css';
import utils from '@/styles/Util.module.css';

const meta: Meta = {
  title: 'Pages/Product Search',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: productTile,
};
export default meta;

const bannerMock = {
  title: 'Test Banner',
  subtitle: 'Test subtitle',
  text: 'Lorem ipsum',
  theme: 'default',
  image: '/hero/range.png',
  button: {
    url: '/',
    text: 'Read more',
  },
} satisfies BannerProps;

const Template = {
  render: (args: any) => (
    <BaseTemplate>
      <Section space="2xl">
        <Container>
          <Stack gap="xl">
            <Grid>
              <GridItem>
                <Banner {...bannerMock} />
              </GridItem>
            </Grid>

            <Grid>
              <GridItem span={12}>
                <Pagination
                  pageCount={5}
                  currentPage={2}
                />
              </GridItem>
            </Grid>
          </Stack>
        </Container>
      </Section>
    </BaseTemplate>
  ),
};

export const Default = { ...Template, args: {} };
