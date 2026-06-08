const productTile = {
  title: 'House Espresso Blend',
  productId: 'house-espresso-blend',
  href: '/house-espresso-blend',
  description: 'A balanced everyday espresso with notes of milk chocolate, caramel, and orange.',
  price: { amount: 14, saleAmount: 12 },
  inStock: true,
  newItem: false,
  lowStock: false,
  image: {
    src: 'https://images.unsplash.com/photo-1685384338018-1774719d5b69?auto=format&fit=crop&q=80&w=600&h=600',
    alt: 'A yellow cup filled with coffee',
  },
};

const productTileOutOfStock = {
  title: 'Yirgacheffe Filter Roast',
  productId: 'yirgacheffe-filter-roast',
  href: '/yirgacheffe-filter-roast',
  description: 'A floral Ethiopian filter coffee with bergamot, peach, and honey sweetness.',
  price: { amount: 18, saleAmount: 16 },
  inStock: false,
  newItem: false,
  lowStock: false,
  image: {
    src: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600&h=600',
    alt: 'Roasted coffee beans beside a cup of coffee',
  },
};

const productTileNew = {
  title: 'Colombia Pink Bourbon',
  productId: 'colombia-pink-bourbon',
  href: '/colombia-pink-bourbon',
  description: 'A limited single-origin roast with raspberry, panela, and creamy vanilla notes.',
  price: { amount: 21, saleAmount: 19 },
  inStock: true,
  newItem: true,
  lowStock: false,
  image: {
    src: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=600&h=600',
    alt: 'Freshly brewed coffee in a ceramic cup',
  },
};

const productTileLowStock = {
  title: 'Kenya AA Espresso',
  productId: 'kenya-aa-espresso',
  href: '/kenya-aa-espresso',
  description: 'A bright espresso roast with blackcurrant, cocoa nibs, and a juicy finish.',
  price: { amount: 17, saleAmount: 15 },
  inStock: true,
  newItem: false,
  lowStock: true,
  image: {
    src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600&h=600',
    alt: 'Coffee being poured into a cup',
  },
};

export { productTile, productTileLowStock, productTileNew, productTileOutOfStock };

export default productTile;
