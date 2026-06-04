import { Meta } from '@storybook/react-vite';

import { Container, Grid, GridItem, Section, Stack } from '@/components/Layout';
import { SearchResultItem, SearchResults } from '@/components/SearchResults';
import SearchResultsData from '@/mocks/components/SearchResults';
import BaseTemplate from '@/stories/templates/Base';

import styles from '@/stories/pages/SearchResults.module.css';

const meta: Meta = {
  title: 'Pages/Search Results',
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};
export default meta;

const Template = {
  render: () => {
    const items = SearchResultsData as SearchResultItem[];

    return (
      <BaseTemplate>
        <Section space="2xl">
          <Container>
            <Grid>
              <GridItem
                span={12}
                spanLg={3}
              >
                <Stack gap="2xl">
                  <div className={styles.header}>
                    <h1 className={styles.eyebrow}>Search</h1>
                    <p>{items.length} results</p>
                  </div>
                </Stack>
              </GridItem>
              <GridItem
                span={12}
                spanLg={9}
              >
                <div className={styles.panel}>
                  <SearchResults items={items} />
                </div>
              </GridItem>
            </Grid>
          </Container>
        </Section>
      </BaseTemplate>
    );
  },
};

export const Default = { ...Template, args: {} };
