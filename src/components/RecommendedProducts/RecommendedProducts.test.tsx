import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { vi } from 'vitest';

import {
  RecommendedProducts,
  type RecommendedProductsProps,
} from '@/components/RecommendedProducts/RecommendedProducts';

vi.mock('@/components/Layout', () => ({
  Container: ({ children }: { children: ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  Grid: ({ children }: { children: ReactNode }) => <div data-testid="grid">{children}</div>,
  GridItem: ({ children }: { children: ReactNode }) => (
    <div data-testid="grid-item">{children}</div>
  ),
  Section: ({ children, className }: { children: ReactNode; className?: string }) => (
    <section
      data-testid="section"
      className={className}
    >
      {children}
    </section>
  ),
}));

vi.mock('@/components/ProductTile', () => ({
  ProductTile: ({ title, productId }: { title?: string; productId?: string }) => (
    <article data-testid="product-tile">
      <span>{title}</span>
      <span>{productId}</span>
    </article>
  ),
}));

describe('RecommendedProducts', () => {
  const productOne = {
    productId: 'coffee-beans',
    title: 'Coffee Beans',
  } as unknown as RecommendedProductsProps['products'][number];

  const productTwo = {
    productId: 'espresso-cups',
    title: 'Espresso Cups',
  } as unknown as RecommendedProductsProps['products'][number];

  const defaultProps: RecommendedProductsProps = {
    title: 'Recommended products',
    description: 'A few things you might also like.',
    products: [productOne, productTwo],
  };

  it('renders the title and description', () => {
    render(<RecommendedProducts {...defaultProps} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Recommended products' })
    ).toBeInTheDocument();

    expect(screen.getByText('A few things you might also like.')).toBeInTheDocument();
  });

  it('renders all product tiles', () => {
    render(<RecommendedProducts {...defaultProps} />);

    expect(screen.getAllByTestId('product-tile')).toHaveLength(2);

    expect(screen.getByText('Coffee Beans')).toBeInTheDocument();
    expect(screen.getByText('coffee-beans')).toBeInTheDocument();
    expect(screen.getByText('Espresso Cups')).toBeInTheDocument();
    expect(screen.getByText('espresso-cups')).toBeInTheDocument();
  });

  it('does not render the description when it is not provided', () => {
    render(
      <RecommendedProducts
        {...defaultProps}
        description={undefined}
      />
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Recommended products' })
    ).toBeInTheDocument();

    expect(screen.queryByText('A few things you might also like.')).not.toBeInTheDocument();
  });

  it('does not render the heading block when title is empty', () => {
    render(
      <RecommendedProducts
        {...defaultProps}
        title=""
      />
    );

    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(screen.queryByText('A few things you might also like.')).not.toBeInTheDocument();
  });

  it('renders no product tiles when products is empty', () => {
    render(
      <RecommendedProducts
        {...defaultProps}
        products={[]}
      />
    );

    expect(screen.queryAllByTestId('product-tile')).toHaveLength(0);
  });

  it('renders the outer section', () => {
    render(<RecommendedProducts {...defaultProps} />);

    expect(screen.getByTestId('section')).toBeInTheDocument();
  });
});
