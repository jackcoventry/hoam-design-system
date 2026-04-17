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
        displayValue: 'https://placehold.co/100x100?text=Vitamin+A+Supplement',
      },
      {
        label: 'Style 2',
        value: 'style2',
        displayValue: 'https://placehold.co/100x100?text=Vitamin+B+Supplement',
      },
      {
        label: 'Style 3',
        value: 'style3',
        displayValue: 'https://placehold.co/100x100?text=Vitamin+C+Supplement',
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
  moreInformation: [
    {
      id: 'item-1',
      title: 'Description',
      text: 'Ut minim mollit officia ad adipiscing velit duis duis fugiat. Reprehenderit voluptate dolore laboris esse in adipiscing adipiscing voluptate anim laboris qui reprehenderit eiusmod eiusmod incididunt occaecat excepteur mollit. Ad labore irure amet sit aliquip veniam pariatur veniam laboris nostrud nulla ullamco. Adipiscing veniam dolore cupidatat qui ad exercitation elit labore velit et aliquip adipiscing occaecat fugiat consequat esse sint nulla ea. Excepteur anim cillum culpa ullamco labore commodo veniam ut dolor excepteur irure duis voluptate proident ex in velit qui anim.',
    },
    {
      id: 'item-2',
      title: 'Returns Policy',
      text: 'Ut minim mollit officia ad adipiscing velit duis duis fugiat. Reprehenderit voluptate dolore laboris esse in adipiscing adipiscing voluptate anim laboris qui reprehenderit eiusmod eiusmod incididunt occaecat excepteur mollit. Ad labore irure amet sit aliquip veniam pariatur veniam laboris nostrud nulla ullamco. Adipiscing veniam dolore cupidatat qui ad exercitation elit labore velit et aliquip adipiscing occaecat fugiat consequat esse sint nulla ea. Excepteur anim cillum culpa ullamco labore commodo veniam ut dolor excepteur irure duis voluptate proident ex in velit qui anim.',
    },
  ],
};

export default items;
