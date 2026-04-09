import { type JSX, useState } from 'react';

import { FilterBarData } from '@/mocks/components/FilterBar';

import { FilterBar } from './FilterBar';
import type { FilterValue } from './FilterBar.types';

export default { component: FilterBar };

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

export function CoffeeFilterExample(): JSX.Element {
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
      stackAt="md"
    />
  );
}
