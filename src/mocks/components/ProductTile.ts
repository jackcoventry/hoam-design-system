const productTile = {
  title: 'Sample Product',
  productId: 'sample-product',
  description: 'A short description of the product.',
  price: { amount: 100, saleAmount: 80, currency: 'GBP' },
  inStock: true,
  newItem: false,
  lowStock: false,
};

const productTileOutOfStock = {
  title: 'Sample Product',
  productId: 'sample-product',
  description: 'A short description of the product.',
  price: { amount: 100, saleAmount: 80, currency: 'GBP' },
  inStock: false,
  newItem: false,
  lowStock: false,
};

const productTileNew = {
  title: 'Sample Product',
  productId: 'sample-product',
  description: 'A short description of the product.',
  price: { amount: 100, saleAmount: 80, currency: 'GBP' },
  inStock: true,
  newItem: true,
  lowStock: false,
};

const productTileLowStock = {
  title: 'Sample Product',
  productId: 'sample-product',
  description: 'A short description of the product.',
  price: { amount: 100, saleAmount: 80, currency: 'GBP' },
  inStock: true,
  newItem: false,
  lowStock: true,
};

export { productTile, productTileLowStock, productTileNew, productTileOutOfStock };

export default productTile;
