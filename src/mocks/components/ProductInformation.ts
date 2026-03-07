const items = {
  options: {
    color: [
      { label: 'Red', value: 'red', displayValue: '#ff0000' },
      { label: 'Yellow', value: 'yellow', displayValue: '#ffff00' },
      { label: 'Green', value: 'green', displayValue: '#067c0eff' },
    ],
    size: [
      { label: 'Small', value: 'small', displayValue: 'Small' },
      { label: 'Medium', value: 'medium', displayValue: 'Medium' },
      { label: 'Large', value: 'large', displayValue: 'Large' },
    ],
    image: [
      {
        label: 'Style 1',
        value: 'style1',
        displayValue: 'https://placehold.co/48x4?text=Vitamin+A+Supplement',
      },
      {
        label: 'Style 2',
        value: 'style2',
        displayValue: 'https://placehold.co/48x4?text=Vitamin+B+Supplement',
      },
      {
        label: 'Style 3',
        value: 'style3',
        displayValue: 'https://placehold.co/48x4?text=Vitamin+C+Supplement',
      },
    ],
    tshirt: [
      {
        label: 'Small',
        value: 'm-s',
        displayValue: 'Small',
        category: 'Men',
      },
      {
        label: 'Medium',
        value: 'm-m',
        displayValue: 'Medium',
        category: 'Men',
      },
      {
        label: 'Large',
        value: 'm-l',
        displayValue: 'Large',
        category: 'Men',
      },
      {
        label: 'Small',
        value: 'w-s',
        displayValue: 'Small',
        category: 'Women',
      },
      {
        label: 'Medium',
        value: 'w-m',
        displayValue: 'Medium - Out of Stock',
        category: 'Women',
        disabled: true,
      },
      {
        label: 'Large',
        value: 'l-m',
        displayValue: 'Large',
        category: 'Women',
      },
    ],
  },
};

export default items;
