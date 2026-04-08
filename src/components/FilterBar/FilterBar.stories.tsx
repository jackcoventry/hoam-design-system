import { type JSX, useState } from 'react';

import { FilterBar } from './FilterBar';
import type { FilterGroup, FilterValue } from './FilterBar.types';

export default { component: FilterBar };
const groups: FilterGroup[] = [
  {
    id: 'roast',
    label: 'Roast',
    kind: 'checkbox',
    options: [
      { id: 'light', label: 'Light', count: 12 },
      { id: 'medium', label: 'Medium', count: 18 },
      { id: 'dark', label: 'Dark', count: 9 },
    ],
  },
  {
    id: 'origin',
    label: 'Origin',
    kind: 'checkbox',
    searchable: true,
    searchPlaceholder: 'Search origin',
    options: [
      { id: 'ethiopia', label: 'Ethiopia', count: 6 },
      { id: 'colombia', label: 'Colombia', count: 11 },
      { id: 'brazil', label: 'Brazil', count: 8 },
      { id: 'kenya', label: 'Kenya', count: 5 },
      { id: 'rwanda', label: 'Rwanda', count: 3 },
      { id: 'guatemala', label: 'Guatemala', count: 4 },
    ],
  },
  {
    id: 'availability',
    label: 'Availability',
    kind: 'radio',
    options: [
      { id: 'all', label: 'All' },
      { id: 'in-stock', label: 'In stock only' },
    ],
  },
  {
    id: 'price',
    label: 'Price',
    kind: 'range',
    min: 5,
    max: 40,
    step: 1,
    minLabel: '£5',
    maxLabel: '£40',
  },
];

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
      groups={groups}
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
