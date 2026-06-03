import { fireEvent, render, screen } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Basket, BasketFooter, BasketItem, type BasketItemProps } from '@/components/Basket';

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    title,
    onClick,
    disabled,
  }: PropsWithChildren<{
    title?: string;
    onClick?: () => void;
    disabled?: boolean;
  }>) => (
    <button
      type="button"
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/QuantitySelector', () => ({
  QuantitySelector: ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
    <div>
      <span data-testid="quantity-value">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
      >
        Increase quantity
      </button>
    </div>
  ),
}));

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => {
    if (namespace === 'basket') {
      return {
        price: 'Price',
        remove: 'Remove',
        save: 'Save',
        total: 'Total',
        subTotal: 'Subtotal',
        checkout: 'Checkout',
        columnProduct: 'Product',
        columnDetails: 'Details',
        columnQuantity: 'Quantity',
        columnTotal: 'Total',
      };
    }

    return {};
  },
}));

vi.mock('@/utils/convertNumberToCurrency', () => ({
  convertNumberToCurrency: ({ value }: { value: number }) => `£${value.toFixed(2)}`,
}));

describe('BasketItem', () => {
  const baseItem: BasketItemProps = {
    id: 'item-1',
    title: 'Oak Chair',
    summary: 'Comfortable wooden chair',
    price: 25,
    thumbnail: {
      src: '/chair.jpg',
      alt: 'Oak Chair',
    },
    url: '/products/oak-chair',
    onChange: vi.fn(),
    quantity: 3,
  };

  it('renders the item title, image and links', () => {
    render(
      <table>
        <tbody>
          <BasketItem {...baseItem} />
        </tbody>
      </table>
    );

    expect(screen.getByText('Oak Chair')).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/products/oak-chair');
    expect(links[1]).toHaveAttribute('href', '/products/oak-chair');

    const image = screen.getByRole('img', { name: 'Oak Chair' });
    expect(image).toHaveAttribute('src', '/chair.jpg');
  });

  it('uses an empty alt attribute when thumbnail alt is missing', () => {
    const { container } = render(
      <table>
        <tbody>
          <BasketItem
            {...baseItem}
            thumbnail={{ src: '/chair.jpg' }}
          />
        </tbody>
      </table>
    );

    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', '');
  });

  it('renders the unit price and total price', () => {
    render(
      <table>
        <tbody>
          <BasketItem {...baseItem} />
        </tbody>
      </table>
    );

    expect(screen.getByText((content) => content.includes('Price:'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Total:'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('£25.00'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('£75.00'))).toBeInTheDocument();
  });

  it('renders the quantity selector with the current quantity', () => {
    render(
      <table>
        <tbody>
          <BasketItem {...baseItem} />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('quantity-value')).toHaveTextContent('3');
  });

  it('passes quantity changes through to onChange', () => {
    const onChange = vi.fn();

    render(
      <table>
        <tbody>
          <BasketItem
            {...baseItem}
            quantity={2}
            onChange={onChange}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('renders remove and save controls', () => {
    render(
      <table>
        <tbody>
          <BasketItem {...baseItem} />
        </tbody>
      </table>
    );

    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});

describe('BasketFooter', () => {
  it('renders the subtotal and checkout button', () => {
    render(<BasketFooter total={125} />);

    expect(screen.getByText('Subtotal: £125.00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Checkout' })).toBeInTheDocument();
  });
});

describe('Basket', () => {
  const items: BasketItemProps[] = [
    {
      id: 'item-1',
      title: 'Oak Chair',
      summary: 'Comfortable wooden chair',
      price: 25,
      thumbnail: {
        src: '/chair.jpg',
        alt: 'Oak Chair',
      },
      url: '/products/oak-chair',
      onChange: vi.fn(),
      quantity: 2,
    },
    {
      id: 'item-2',
      title: 'Desk Lamp',
      summary: 'Brass desk lamp',
      price: 40,
      thumbnail: {
        src: '/lamp.jpg',
        alt: 'Desk Lamp',
      },
      url: '/products/desk-lamp',
      onChange: vi.fn(),
      quantity: 1,
    },
  ];

  it('renders the table headers', () => {
    render(
      <Basket
        items={items}
        total={90}
      />
    );

    expect(screen.getByRole('columnheader', { name: 'Product' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Details' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Quantity' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader', { name: 'Total' })).toHaveLength(1);
  });

  it('applies a custom className to the table root', () => {
    render(
      <Basket
        items={items}
        total={90}
        className="custom-basket"
      />
    );

    expect(screen.getByRole('table')).toHaveClass('custom-basket');
  });

  it('renders all basket items', () => {
    render(
      <Basket
        items={items}
        total={90}
      />
    );

    expect(screen.getByText('Oak Chair')).toBeInTheDocument();
    expect(screen.getByText('Desk Lamp')).toBeInTheDocument();
  });

  it('renders the correct number of body rows', () => {
    render(
      <Basket
        items={items}
        total={90}
      />
    );

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
  });

  it('renders an empty tbody when items is empty', () => {
    render(
      <Basket
        items={[]}
        total={0}
      />
    );

    expect(screen.getAllByRole('row')).toHaveLength(1);
    expect(screen.queryByText('Oak Chair')).not.toBeInTheDocument();
  });

  it('renders an empty tbody when items is null', () => {
    render(
      <Basket
        items={null}
        total={0}
      />
    );

    expect(screen.getAllByRole('row')).toHaveLength(1);
    expect(screen.queryByText('Oak Chair')).not.toBeInTheDocument();
  });

  it('wires each item quantity selector to its own onChange handler', () => {
    const firstOnChange = vi.fn();
    const secondOnChange = vi.fn();

    const testItems: BasketItemProps[] = [
      {
        id: 'item-1',
        title: 'Oak Chair',
        summary: 'Comfortable wooden chair',
        price: 25,
        thumbnail: {
          src: '/chair.jpg',
          alt: 'Oak Chair',
        },
        url: '/products/oak-chair',
        onChange: firstOnChange,
        quantity: 1,
      },
      {
        id: 'item-2',
        title: 'Desk Lamp',
        summary: 'Brass desk lamp',
        price: 40,
        thumbnail: {
          src: '/lamp.jpg',
          alt: 'Desk Lamp',
        },
        url: '/products/desk-lamp',
        onChange: secondOnChange,
        quantity: 4,
      },
    ];

    render(
      <Basket
        items={testItems}
        total={0}
      />
    );

    const buttons = screen.getAllByRole('button', { name: 'Increase quantity' });
    const firstButton = buttons[0];
    const secondButton = buttons[1];

    expect(firstButton).toBeDefined();
    expect(secondButton).toBeDefined();

    if (!firstButton || !secondButton) {
      throw new Error('Expected quantity buttons to exist');
    }

    fireEvent.click(firstButton);
    fireEvent.click(secondButton);

    expect(firstOnChange).toHaveBeenCalledWith(2);
    expect(secondOnChange).toHaveBeenCalledWith(5);
  });
});
