import { render, screen } from '@testing-library/react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { vi } from 'vitest';

import { ProductTile, type ProductTileProps } from '@/components/ProductTile/ProductTile';

vi.mock('@/components/BadgeList', () => ({
  BadgeList: ({ children }: { children?: ReactNode }) => (
    <div data-testid="badge-list">{children}</div>
  ),
  BadgeListItem: ({ children }: { children?: ReactNode }) => (
    <span data-testid="badge-list-item">{children}</span>
  ),
}));

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    disabled,
    className,
  }: {
    children?: ReactNode;
    disabled?: boolean;
    className?: string;
  } & ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
      type="button"
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  ),
}));

describe('ProductTile', () => {
  const defaultProps: ProductTileProps = {
    title: 'Colombian Coffee Beans',
    productId: 'colombian-coffee-beans',
    description: 'Rich, balanced beans with notes of chocolate.',
    price: {
      amount: 12.5,
      currency: 'GBP',
    },
    inStock: true,
    newItem: false,
    lowStock: false,
  };

  it('renders the title, description, image, and product link', () => {
    render(<ProductTile {...defaultProps} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Colombian Coffee Beans' })
    ).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Colombian Coffee Beans' });
    expect(link).toHaveAttribute('href', '#colombian-coffee-beans');

    expect(screen.getByText('Rich, balanced beans with notes of chocolate.')).toBeInTheDocument();

    const image = screen.getByRole('img', { name: 'Colombian Coffee Beans' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      'https://images.unsplash.com/photo-1685384338018-1774719d5b69?auto=format&fit=crop&q=80&w=600&h=600'
    );
  });

  it('renders the regular price when there is no sale price', () => {
    render(<ProductTile {...defaultProps} />);

    const currentPrice = screen.getByText('£12.50');
    expect(currentPrice).toBeInTheDocument();
    expect(currentPrice).toHaveAttribute('data-price-status', 'current');

    expect(
      screen.queryByText('£12.50', { selector: '[data-price-status="previous"]' })
    ).not.toBeInTheDocument();
  });

  it('renders sale and previous prices when saleAmount is provided', () => {
    render(
      <ProductTile
        {...defaultProps}
        price={{
          amount: 20,
          saleAmount: 15,
          currency: 'GBP',
        }}
      />
    );

    const currentPrice = screen.getByText('£15.00');
    const previousPrice = screen.getByText('£20.00');

    expect(currentPrice).toHaveAttribute('data-price-status', 'current');
    expect(previousPrice).toHaveAttribute('data-price-status', 'previous');
  });

  it('renders a NEW badge when newItem is true', () => {
    render(
      <ProductTile
        {...defaultProps}
        newItem
      />
    );

    expect(screen.getByTestId('badge-list')).toBeInTheDocument();
    expect(screen.getByTestId('badge-list-item')).toHaveTextContent('NEW');
  });

  it('renders the badge wrapper when lowStock is true', () => {
    render(
      <ProductTile
        {...defaultProps}
        lowStock
      />
    );

    expect(screen.getByTestId('badge-list')).toBeInTheDocument();
  });

  it('does not render badges when neither newItem nor lowStock is true', () => {
    render(
      <ProductTile
        {...defaultProps}
        newItem={false}
        lowStock={false}
      />
    );

    expect(screen.queryByTestId('badge-list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('badge-list-item')).not.toBeInTheDocument();
  });

  it('renders an enabled Add to cart button when the product is in stock', () => {
    render(
      <ProductTile
        {...defaultProps}
        inStock
      />
    );

    const button = screen.getByRole('button', { name: 'Add to cart' });
    expect(button).toBeEnabled();
  });

  it('renders a disabled Out of stock button when the product is not in stock', () => {
    render(
      <ProductTile
        {...defaultProps}
        inStock={false}
      />
    );

    const button = screen.getByRole('button', { name: 'Out of stock' });
    expect(button).toBeDisabled();
  });

  it('does not render the description when it is empty', () => {
    render(
      <ProductTile
        {...defaultProps}
        description=""
      />
    );

    expect(
      screen.queryByText('Rich, balanced beans with notes of chocolate.')
    ).not.toBeInTheDocument();
  });

  it('formats price using the provided currency', () => {
    render(
      <ProductTile
        {...defaultProps}
        price={{
          amount: 10,
          currency: 'USD',
        }}
      />
    );

    expect(screen.getByText('US$10.00')).toBeInTheDocument();
  });
});
