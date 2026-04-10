import { useState } from 'react';
import { Meta } from '@storybook/react-vite';

import { Banner, type BannerProps } from '@/components/Banner';
import { FilterBar } from '@/components/FilterBar/FilterBar';
import { FilterValue } from '@/components/FilterBar/FilterBar.types';
import { Container, Grid, GridItem, Section, Stack } from '@/components/Layout';
import { Pagination } from '@/components/Pagination';
import { ProductTile } from '@/components/ProductTile';
import { FilterBarData } from '@/mocks/components/FilterBar';
import { productTile, productTileNew } from '@/mocks/components/ProductTile';
import BaseTemplate from '@/stories/templates/Base';

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

const initialValue: FilterValue = {
  options: {
    roast: [],
    origin: [],
    availability: ['all'],
  },
  ranges: {
    price: {},
  },
};

const dataSet = [
  productTile,
  productTile,
  productTileNew,
  productTile,
  productTileNew,
  productTile,
];

function Component() {
  const [value, setValue] = useState<FilterValue>(initialValue);
  const [sortValue, setSortValue] = useState<string>('featured');

  return (
    <FilterBar
      title="Filter products"
      groups={FilterBarData}
      value={value}
      onChange={setValue}
      onApply={(nextValue) => {
        console.log('filters', nextValue);
        console.log('sort', sortValue);
      }}
      onClearAll={() => {
        setValue(initialValue);
      }}
      sortOptions={[
        { value: 'featured', label: 'Featured' },
        { value: 'price-low-high', label: 'Price: Low to high' },
        { value: 'price-high-low', label: 'Price: High to low' },
        { value: 'newest', label: 'Newest' },
      ]}
      sortValue={sortValue}
      onSortChange={setSortValue}
    >
      <Grid>
        {dataSet.map((product) => (
          <GridItem
            span={12}
            spanLg={4}
            key={product.productId}
          >
            <ProductTile {...product} />
          </GridItem>
        ))}
      </Grid>
    </FilterBar>
  );
}

const Template = {
  render: () => (
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
                <Component />
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
