import { type JSX, SetStateAction, useState } from 'react';

import { Grid, GridItem } from '@/components/Layout';
import { ProductTile } from '@/components/ProductTile';
import { FilterBarData } from '@/mocks/components/FilterBar';
import { productTile, productTileNew } from '@/mocks/components/ProductTile';

import { FilterBar } from './ProductFilters';
import type { FilterValue } from './ProductFilters.types';

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
  const [loading, setLoading] = useState<boolean>(false);

  function handleChange(value: SetStateAction<FilterValue>) {
    // This mimics a basic server response
    setLoading(true);

    setTimeout(() => {
      setValue(value);
      setLoading(false);
    }, 500);
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
      loading={loading}
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
