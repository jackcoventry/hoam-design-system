import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductTile } from '@/components/ProductTile/ProductTile';

const useMessagesMock = vi.fn<
  (namespace: string) => {
    new: string;
    lowStock: string;
    save: string;
    addToCart: string;
    outOfStock: string;
  }
>();

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => useMessagesMock(namespace),
}));

vi.mock('@/components/BadgeList', () => ({
  BadgeList: ({ children }: { children: ReactNode }) => (
    <div data-testid="badge-list">{children}</div>
  ),
  BadgeListItem: ({ children, variant }: { children: ReactNode; variant: string }) => (
    <span data-testid={`badge-${variant}`}>{children}</span>
  ),
}));

vi.mock('@/components/Button', () => ({
  Button: ({ children, disabled }: { children: ReactNode; disabled?: boolean }) => (
    <button disabled={disabled}>{children}</button>
  ),
}));

vi.mock('@/components/Layout', () => ({
  Stack: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div
      data-testid="stack"
      className={className}
    >
      {children}
    </div>
  ),
}));

describe('ProductTile', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useMessagesMock.mockReturnValue({
      new: 'New',
      lowStock: 'Low stock',
      save: 'Save',
      addToCart: 'Add to cart',
      outOfStock: 'Out of stock',
    });
  });

  const baseProps = {
    title: 'Test Product',
    productId: 'prod-1',
    href: '/prod-1',
    description: 'A lovely item',
    price: {
      amount: 100,
    },
    inStock: true,
    newItem: false,
    lowStock: false,
    image: {
      src: '/image.jpg',
      alt: 'Product image',
    },
  };

  it('renders title, description and link', () => {
    render(<ProductTile {...baseProps} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('A lovely item')).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/prod-1');
  });

  it('applies a custom className to the root stack', () => {
    render(
      <ProductTile
        {...baseProps}
        className="custom-product-tile"
      />
    );

    expect(screen.getAllByTestId('stack')[0]).toHaveClass('custom-product-tile');
  });

  it('renders image with correct alt text', () => {
    render(<ProductTile {...baseProps} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/image.jpg');
    expect(img).toHaveAttribute('alt', 'Product image');
  });

  it('falls back to title when image alt is missing', () => {
    render(
      <ProductTile
        {...baseProps}
        image={{ src: '/image.jpg' }}
      />
    );

    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Product');
  });

  it('renders no badges when neither new nor low stock', () => {
    render(<ProductTile {...baseProps} />);

    expect(screen.queryByTestId('badge-list')).not.toBeInTheDocument();
  });

  it('renders "new" badge', () => {
    render(
      <ProductTile
        {...baseProps}
        newItem
      />
    );

    expect(screen.getByTestId('badge-list')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders "low stock" badge', () => {
    render(
      <ProductTile
        {...baseProps}
        lowStock
      />
    );

    expect(screen.getByTestId('badge-list')).toBeInTheDocument();
    expect(screen.getByText('Low stock')).toBeInTheDocument();
  });

  it('renders both badges when applicable', () => {
    render(
      <ProductTile
        {...baseProps}
        newItem
        lowStock
      />
    );

    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Low stock')).toBeInTheDocument();
  });

  it('renders normal price', () => {
    render(<ProductTile {...baseProps} />);

    expect(screen.getByText('£100.00')).toBeInTheDocument();
  });

  it('renders sale price and previous price', () => {
    render(
      <ProductTile
        {...baseProps}
        price={{
          amount: 100,
          saleAmount: 80,
        }}
      />
    );

    expect(screen.getByText('£80.00')).toBeInTheDocument();
    expect(screen.getByText('£100.00')).toBeInTheDocument();
  });

  it('marks prices with correct data attributes', () => {
    render(
      <ProductTile
        {...baseProps}
        price={{
          amount: 100,
          saleAmount: 80,
        }}
      />
    );

    expect(screen.getByText('£80.00').closest('[data-price-status="current"]')).toBeInTheDocument();

    expect(
      screen.getByText('£100.00').closest('[data-price-status="previous"]')
    ).toBeInTheDocument();
  });

  it('renders enabled "add to cart" button when in stock', () => {
    render(<ProductTile {...baseProps} />);

    const button = screen.getByRole('button', { name: 'Add to cart' });

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('renders disabled "out of stock" button when not in stock', () => {
    render(
      <ProductTile
        {...baseProps}
        inStock={false}
      />
    );

    const button = screen.getByRole('button', { name: 'Out of stock' });

    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('renders save button', () => {
    render(<ProductTile {...baseProps} />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('does not render description when empty', () => {
    render(
      <ProductTile
        {...baseProps}
        description=""
      />
    );

    expect(screen.queryByText('A lovely item')).not.toBeInTheDocument();
  });
});
