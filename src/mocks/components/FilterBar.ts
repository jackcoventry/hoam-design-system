import { FilterGroup } from '@/components/ProductFilters/ProductFilters.types';

export const FilterBarData: FilterGroup[] = [
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
    kind: 'checkbox',
    options: [{ id: 'in-stock', label: 'In stock only' }],
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
