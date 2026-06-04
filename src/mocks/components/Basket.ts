const items = [
  {
    id: 'house-espresso-blend',
    title: 'House Espresso Blend',
    summary: '250g whole bean coffee with milk chocolate, caramel, and orange notes.',
    price: 12,
    thumbnail: {
      src: 'https://images.unsplash.com/photo-1685384338018-1774719d5b69?auto=format&fit=crop&q=80&w=240&h=240',
      alt: 'A yellow cup filled with coffee',
    },
    url: '/shop/coffee/house-espresso-blend',
    quantity: 1,
    onChange: () => {},
  },
  {
    id: 'colombia-pink-bourbon',
    title: 'Colombia Pink Bourbon',
    summary: 'Limited 250g single-origin roast with raspberry, panela, and vanilla notes.',
    price: 19,
    thumbnail: {
      src: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=240&h=240',
      alt: 'Freshly brewed coffee in a ceramic cup',
    },
    url: '/shop/coffee/colombia-pink-bourbon',
    quantity: 2,
    onChange: () => {},
  },
  {
    id: 'french-press-starter-kit',
    title: 'French Press Starter Kit',
    summary: 'A brew kit with coarse-ground coffee, filters, and a simple recipe card.',
    price: 34,
    thumbnail: {
      src: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=240&h=240',
      alt: 'Coffee brewing equipment on a table',
    },
    url: '/shop/brewing-equipment/french-press-starter-kit',
    quantity: 1,
    onChange: () => {},
  },
  {
    id: 'reusable-cup',
    title: 'Reusable Coffee Cup',
    summary: 'Insulated cup for espresso, filter coffee, and drinks on the move.',
    price: 18,
    thumbnail: {
      src: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=240&h=240',
      alt: 'Reusable coffee cup on a cafe table',
    },
    url: '/shop/accessories/reusable-coffee-cup',
    quantity: 1,
    onChange: () => {},
  },
];

export default items;
