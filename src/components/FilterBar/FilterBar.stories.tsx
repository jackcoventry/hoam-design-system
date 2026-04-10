import { type JSX, useState } from 'react';

import { FilterBarData } from '@/mocks/components/FilterBar';
import { productTile, productTileNew } from '@/mocks/components/ProductTile';

import { Grid, GridItem } from '../Layout';
import { ProductTile } from '../ProductTile';

import { FilterBar } from './FilterBar';
import type { FilterValue } from './FilterBar.types';

export default { component: FilterBar };

const initialValue: FilterValue = {
  options: {
    roast: [],
    origin: [],
    availability: [],
  },
  ranges: {
    price: {},
  },
};

const dataSet = [productTile, productTile, productTile, productTileNew];

export function CoffeeFilterExample(): JSX.Element {
  const [value, setValue] = useState<FilterValue>(initialValue);
  const [sortValue, setSortValue] = useState<string>('featured');

  return (
    <FilterBar
      title="Filter products"
      groups={FilterBarData}
      value={value}
      onChange={setValue}
      onApply={() => {}}
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
