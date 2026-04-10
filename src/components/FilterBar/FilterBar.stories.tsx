import { type JSX, SetStateAction, useState } from 'react';

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
  const [loading, setLoading] = useState<boolean>(false);

  function handleChange(value: SetStateAction<FilterValue>) {
    // TODO: This mimic's a server response, it could potentially show an actual request isntead
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
