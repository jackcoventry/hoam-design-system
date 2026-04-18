const productTile = {
  title: 'Sample Product',
  productId: 'sample-product',
  description: 'A short description of the product.',
  price: { amount: 100, saleAmount: 80 },
  inStock: true,
  newItem: false,
  lowStock: false,
  image: {
    src: 'https://images.unsplash.com/photo-1685384338018-1774719d5b69?auto=format&fit=crop&q=80&w=600&h=600',
    alt: 'A yellow cup filled with coffee',
  },
};

const productTileOutOfStock = {
  title: 'Sample Product',
  productId: 'sample-product',
  description: 'A short description of the product.',
  price: { amount: 100, saleAmount: 80 },
  inStock: false,
  newItem: false,
  lowStock: false,
  image: {
    src: 'https://images.unsplash.com/photo-1685384338018-1774719d5b69?auto=format&fit=crop&q=80&w=600&h=600',
    alt: 'A yellow cup filled with coffee',
  },
};

const productTileNew = {
  title: 'Sample Product',
  productId: 'sample-product',
  description: 'A short description of the product.',
  price: { amount: 100, saleAmount: 80 },
  inStock: true,
  newItem: true,
  lowStock: false,
  image: {
    src: 'https://images.unsplash.com/photo-1685384338018-1774719d5b69?auto=format&fit=crop&q=80&w=600&h=600',
    alt: 'A yellow cup filled with coffee',
  },
};

const productTileLowStock = {
  title: 'Sample Product',
  productId: 'sample-product',
  description: 'A short description of the product.',
  price: { amount: 100, saleAmount: 80 },
  inStock: true,
  newItem: false,
  lowStock: true,
  image: {
    src: 'https://images.unsplash.com/photo-1685384338018-1774719d5b69?auto=format&fit=crop&q=80&w=600&h=600',
    alt: 'A yellow cup filled with coffee',
  },
};

export { productTile, productTileLowStock, productTileNew, productTileOutOfStock };

export default productTile;
