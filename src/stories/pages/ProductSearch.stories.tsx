import { SetStateAction, useState } from 'react';
import { Meta } from '@storybook/react-vite';

import { Banner, type BannerProps } from '@/components/Banner';
import { Container, Grid, GridItem, Section, Stack } from '@/components/Layout';
import { Pagination } from '@/components/Pagination';
import { FilterBar } from '@/components/ProductFilters/ProductFilters';
import { FilterValue } from '@/components/ProductFilters/ProductFilters.types';
import { ProductTile } from '@/components/ProductTile';
import { FilterBarData } from '@/mocks/components/FilterBar';
import { productTile, productTileNew } from '@/mocks/components/ProductTile';
import BaseTemplate from '@/stories/templates/Base';

const meta: Meta = {
  title: 'Pages/Product Search',
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};
export default meta;

const bannerMock = {
  title: 'Test Banner',
  subtitle: 'Test subtitle',
  text: 'Lorem ipsum',
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

  function handleChange(value: SetStateAction<FilterValue>) {
    setValue(value);
  }

  return (
    <FilterBar
      title="Filter products"
      groups={FilterBarData}
      value={value}
      onChange={handleChange}
      onApply={handleChange}
      onClearAll={() => {
        handleChange(initialValue);
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
            spanMd={12}
            spanLg={6}
            spanXl={4}
            key={product.productId}
          >
            <ProductTile {...product} />
          </GridItem>
        ))}
      </Grid>
      <Pagination
        pageCount={5}
        currentPage={2}
      />
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
          </Stack>
        </Container>
      </Section>
    </BaseTemplate>
  ),
};

export const Default = { ...Template, args: {} };
