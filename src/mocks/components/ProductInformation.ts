import type { ProductInfoProps } from '@/components/ProductInfo';

const items: ProductInfoProps['data'] = {
  options: [
    {
      id: 'roast',
      label: 'Roast',
      input: 'color',
      options: [
        { label: 'Light Roast', value: 'light-roast', displayValue: '#c78b52' },
        { label: 'Medium Roast', value: 'medium-roast', displayValue: '#8f5b34' },
        { label: 'Dark Roast', value: 'dark-roast', displayValue: '#4a2c20' },
      ],
    },
    {
      id: 'bagSize',
      label: 'Bag Size',
      input: 'label',
      options: [
        { label: '250g', value: '250g', displayValue: '250g' },
        { label: '500g', value: '500g', displayValue: '500g' },
        { label: '1kg', value: '1kg', displayValue: '1kg' },
      ],
    },
    {
      id: 'brewStyle',
      label: 'Brew Style',
      input: 'image',
      options: [
        {
          label: 'Espresso',
          value: 'espresso',
          displayValue: 'https://placehold.co/100x100?text=Espresso',
        },
        {
          label: 'Pour Over',
          value: 'pour-over',
          displayValue: 'https://placehold.co/100x100?text=Pour+Over',
        },
        {
          label: 'French Press',
          value: 'french-press',
          displayValue: 'https://placehold.co/100x100?text=French+Press',
        },
      ],
    },
    {
      id: 'grind',
      label: 'Grind',
      input: 'select',
      options: [
        {
          label: 'Whole Bean',
          value: 'whole-bean',
          displayValue: 'Whole Bean',
          category: 'Whole Bean',
        },
        {
          label: 'Espresso',
          value: 'espresso-fine',
          displayValue: 'Espresso - Fine',
          category: 'Ground',
        },
        {
          label: 'Filter',
          value: 'filter-medium',
          displayValue: 'Filter - Medium',
          category: 'Ground',
        },
        {
          label: 'French Press',
          value: 'french-press-coarse',
          displayValue: 'French Press - Coarse',
          category: 'Ground',
        },
        {
          label: 'Roaster Recommendation',
          value: 'roaster-recommendation',
          displayValue: 'Roaster Recommendation',
        },
        {
          label: 'Cold Brew',
          value: 'cold-brew-extra-coarse',
          displayValue: 'Cold Brew - Extra Coarse',
          category: 'Ground',
          disabled: true,
        },
      ],
    },
  ],
  moreInformation: [
    {
      id: 'tasting-notes',
      title: 'Tasting Notes',
      text: 'Brown sugar, orange zest, and milk chocolate with a syrupy body.',
    },
    {
      id: 'brew-recommendation',
      title: 'Brew Recommendation',
      text: 'Best for espresso, moka pot, or a short pour-over at a 1:16 ratio.',
    },
  ],
};

export default items;
