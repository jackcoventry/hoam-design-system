import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import type { ProductTileProps } from '@/components/ProductTile';
import { RecommendedProducts } from '@/components/RecommendedProducts';

vi.mock('@/components/Common/BodyText', () => ({
  BodyText: ({ children }: { children: ReactNode }) => (
    <div data-testid="body-text">{children}</div>
  ),
}));

vi.mock('@/components/Layout', () => ({
  Container: ({ children }: { children: ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  Grid: ({ children }: { children: ReactNode }) => <div data-testid="grid">{children}</div>,
  GridItem: ({
    children,
    span,
    spanLg,
  }: {
    children?: ReactNode;
    span?: number;
    spanLg?: number;
  }) => (
    <div
      data-testid="grid-item"
      data-span={span}
      data-span-lg={spanLg}
    >
      {children}
    </div>
  ),
  Section: ({
    children,
    space,
    className,
  }: {
    children: ReactNode;
    space?: string;
    className?: string;
  }) => (
    <section
      data-testid="section"
      data-space={space}
      className={className}
    >
      {children}
    </section>
  ),
  Stack: ({ children, gap }: { children: ReactNode; gap?: string }) => (
    <div
      data-testid="stack"
      data-gap={gap}
    >
      {children}
    </div>
  ),
}));

vi.mock('@/components/ProductTile', () => ({
  ProductTile: ({ title, productId }: Pick<ProductTileProps, 'title' | 'productId'>) => (
    <article
      data-testid="product-tile"
      data-product-id={productId}
    >
      {title}
    </article>
  ),
}));

describe('RecommendedProducts', () => {
  const products: ProductTileProps[] = [
    {
      productId: 'prod-1',
      title: 'Product One',
    } as ProductTileProps,
    {
      productId: 'prod-2',
      title: 'Product Two',
    } as ProductTileProps,
    {
      productId: 'prod-3',
      title: 'Product Three',
    } as ProductTileProps,
  ];

  it('renders the section title', () => {
    render(
      <RecommendedProducts
        title="Recommended for you"
        products={products}
      />
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Recommended for you' })
    ).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    render(
      <RecommendedProducts
        title="Recommended for you"
        description="Hand-picked products based on your interests."
        products={products}
      />
    );

    expect(screen.getByText('Hand-picked products based on your interests.')).toBeInTheDocument();
  });

  it('does not render the description when not provided', () => {
    render(
      <RecommendedProducts
        title="Recommended for you"
        products={products}
      />
    );

    expect(
      screen.queryByText('Hand-picked products based on your interests.')
    ).not.toBeInTheDocument();
  });

  it('renders one ProductTile for each product', () => {
    render(
      <RecommendedProducts
        title="Recommended for you"
        products={products}
      />
    );

    const tiles = screen.getAllByTestId('product-tile');
    expect(tiles).toHaveLength(3);
    expect(screen.getByText('Product One')).toBeInTheDocument();
    expect(screen.getByText('Product Two')).toBeInTheDocument();
    expect(screen.getByText('Product Three')).toBeInTheDocument();
  });

  it('passes product props through to ProductTile', () => {
    render(
      <RecommendedProducts
        title="Recommended for you"
        products={products}
      />
    );

    const tiles = screen.getAllByTestId('product-tile');
    expect(tiles[0]).toHaveAttribute('data-product-id', 'prod-1');
    expect(tiles[1]).toHaveAttribute('data-product-id', 'prod-2');
    expect(tiles[2]).toHaveAttribute('data-product-id', 'prod-3');
  });

  it('renders product grid items with the expected spans', () => {
    render(
      <RecommendedProducts
        title="Recommended for you"
        products={products}
      />
    );

    const gridItems = screen.getAllByTestId('grid-item');

    const productGridItems = gridItems.filter(
      (item) => item.dataset.span === '12' && item.dataset.spanLg === '4'
    );

    expect(productGridItems).toHaveLength(3);
  });

  it('renders the heading block inside BodyText', () => {
    render(
      <RecommendedProducts
        title="Recommended for you"
        description="A short description"
        products={products}
      />
    );

    const bodyText = screen.getByTestId('body-text');
    expect(bodyText).toContainElement(
      screen.getByRole('heading', { level: 2, name: 'Recommended for you' })
    );
    expect(bodyText).toContainElement(screen.getByText('A short description'));
  });

  it('passes the expected props to Section and Stack', () => {
    render(
      <RecommendedProducts
        title="Recommended for you"
        products={products}
      />
    );

    expect(screen.getByTestId('section')).toHaveAttribute('data-space', 'md');
    expect(screen.getByTestId('stack')).toHaveAttribute('data-gap', 'lg');
  });

  it('renders correctly with an empty products array', () => {
    render(
      <RecommendedProducts
        title="Recommended for you"
        products={[]}
      />
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Recommended for you' })
    ).toBeInTheDocument();
    expect(screen.queryAllByTestId('product-tile')).toHaveLength(0);
  });

  it('renders the expected number of container wrappers', () => {
    render(
      <RecommendedProducts
        title="Recommended for you"
        products={products}
      />
    );

    expect(screen.getAllByTestId('container')).toHaveLength(2);
  });

  it('renders the expected number of grids', () => {
    render(
      <RecommendedProducts
        title="Recommended for you"
        products={products}
      />
    );

    expect(screen.getAllByTestId('grid')).toHaveLength(2);
  });
});
