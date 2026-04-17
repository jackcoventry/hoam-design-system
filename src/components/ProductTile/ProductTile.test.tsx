import { render, screen } from '@testing-library/react';
import type { PropsWithChildren, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ProductTile, type ProductTileProps } from '@/components/ProductTile';

vi.mock('@/components/BadgeList', () => ({
  BadgeList: ({ children }: { children: ReactNode }) => (
    <div data-testid="badge-list">{children}</div>
  ),
  BadgeListItem: ({ children, variant }: PropsWithChildren<{ variant: string }>) => (
    <span
      data-testid="badge-item"
      data-variant={variant}
    >
      {children}
    </span>
  ),
}));

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    as,
    href,
    disabled,
    className,
  }: PropsWithChildren<{
    as?: 'a';
    href?: string;
    disabled?: boolean;
    className?: string;
  }>) =>
    as === 'a' ? (
      <a
        href={href}
        className={className}
      >
        {children}
      </a>
    ) : (
      <button
        type="button"
        disabled={disabled}
        className={className}
      >
        {children}
      </button>
    ),
}));

vi.mock('@/components/Layout', () => ({
  Stack: ({
    children,
    gap,
    className,
  }: {
    children: ReactNode;
    gap?: string;
    className?: string;
  }) => (
    <div
      data-testid="stack"
      data-gap={gap}
      className={className}
    >
      {children}
    </div>
  ),
}));

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => {
    if (namespace === 'productTile') {
      return {
        new: 'New',
        lowStock: 'Low stock',
        save: 'Save',
        addToCart: 'Add to cart',
        outOfStock: 'Out of stock',
      };
    }

    return {};
  },
}));

describe('ProductTile', () => {
  const baseProps: ProductTileProps = {
    title: 'Lovely Chair',
    productId: 'chair-123',
    description: 'A very nice chair.',
    price: {
      amount: 120,
      currency: 'GBP',
    },
    inStock: true,
    newItem: false,
    lowStock: false,
    image: {
      src: 'https://images.unsplash.com/photo-1685384338018-1774719d5b69?auto=format&fit=crop&q=80&w=600&h=600',
      alt: 'A yellow cup filled with coffee',
    },
  };

  it('renders the main product content', () => {
    render(<ProductTile {...baseProps} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Lovely Chair' })).toBeInTheDocument();
    expect(screen.getByText('A very nice chair.')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Lovely Chair' })).toBeInTheDocument();
  });

  it('renders the product link with the product id hash', () => {
    render(<ProductTile {...baseProps} />);

    const link = screen.getByRole('link', { name: 'Lovely Chair' });
    expect(link).toHaveAttribute('href', '#chair-123');
  });

  it('renders the current price using the base amount when there is no sale price', () => {
    render(<ProductTile {...baseProps} />);

    const currentPrice = document.querySelector('[data-price-status="current"]');
    expect(currentPrice).toBeInTheDocument();
    expect(currentPrice).toHaveTextContent('£120.00');

    const previousPrice = document.querySelector('[data-price-status="previous"]');
    expect(previousPrice).not.toBeInTheDocument();
  });

  it('renders the sale price as current and the original price as previous when saleAmount is present', () => {
    render(
      <ProductTile
        {...baseProps}
        price={{
          amount: 120,
          saleAmount: 90,
          currency: 'GBP',
        }}
      />
    );

    const currentPrice = document.querySelector('[data-price-status="current"]');
    const previousPrice = document.querySelector('[data-price-status="previous"]');

    expect(currentPrice).toBeInTheDocument();
    expect(currentPrice).toHaveTextContent('£90.00');

    expect(previousPrice).toBeInTheDocument();
    expect(previousPrice).toHaveTextContent('£120.00');
  });

  it('renders prices using the provided currency', () => {
    render(
      <ProductTile
        {...baseProps}
        price={{
          amount: 150,
          currency: 'USD',
        }}
      />
    );

    const currentPrice = document.querySelector('[data-price-status="current"]');
    expect(currentPrice).toHaveTextContent('US$150.00');
  });

  it('renders the add to cart button when the item is in stock', () => {
    render(<ProductTile {...baseProps} />);

    const button = screen.getByRole('button', { name: 'Add to cart' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('renders the out of stock button as disabled when the item is not in stock', () => {
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

  it('renders the save button', () => {
    render(<ProductTile {...baseProps} />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders the new badge when newItem is true', () => {
    render(
      <ProductTile
        {...baseProps}
        newItem
      />
    );

    const badges = screen.getAllByTestId('badge-item');
    expect(badges).toHaveLength(1);
    expect(badges[0]).toHaveTextContent('New');
    expect(badges[0]).toHaveAttribute('data-variant', 'default');
  });

  it('renders the low stock badge when lowStock is true', () => {
    render(
      <ProductTile
        {...baseProps}
        lowStock
      />
    );

    const badges = screen.getAllByTestId('badge-item');
    expect(badges).toHaveLength(1);
    expect(badges[0]).toHaveTextContent('Low stock');
    expect(badges[0]).toHaveAttribute('data-variant', 'alert');
  });

  it('renders both badges when newItem and lowStock are both true', () => {
    render(
      <ProductTile
        {...baseProps}
        newItem
        lowStock
      />
    );

    const badges = screen.getAllByTestId('badge-item');
    expect(badges).toHaveLength(2);

    expect(screen.getByText('New')).toHaveAttribute('data-variant', 'default');
    expect(screen.getByText('Low stock')).toHaveAttribute('data-variant', 'alert');
    expect(screen.getByTestId('badge-list')).toBeInTheDocument();
  });

  it('does not render badges when neither newItem nor lowStock is true', () => {
    render(<ProductTile {...baseProps} />);

    expect(screen.queryByTestId('badge-list')).not.toBeInTheDocument();
    expect(screen.queryByText('New')).not.toBeInTheDocument();
    expect(screen.queryByText('Low stock')).not.toBeInTheDocument();
  });

  it('does not render the description when it is an empty string', () => {
    render(
      <ProductTile
        {...baseProps}
        description=""
      />
    );

    expect(screen.queryByText('A very nice chair.')).not.toBeInTheDocument();
  });

  it('renders both stack wrappers with the expected gaps', () => {
    render(<ProductTile {...baseProps} />);

    const stacks = screen.getAllByTestId('stack');
    expect(stacks).toHaveLength(2);
    expect(stacks[0]).toHaveAttribute('data-gap', 'sm');
    expect(stacks[1]).toHaveAttribute('data-gap', 'xs');
  });

  it('falls back to the base amount when saleAmount is 0', () => {
    render(
      <ProductTile
        {...baseProps}
        price={{
          amount: 120,
          saleAmount: 0,
          currency: 'GBP',
        }}
      />
    );

    const currentPrice = document.querySelector('[data-price-status="current"]');
    const previousPrice = document.querySelector('[data-price-status="previous"]');

    expect(currentPrice).toHaveTextContent('£120.00');
    expect(previousPrice).not.toBeInTheDocument();
  });
});
