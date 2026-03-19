import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { vi } from 'vitest';

import { Basket, BasketFooter, BasketItem, type BasketItemProps } from '@/components/Basket';

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    title,
    onClick,
  }: {
    children?: ReactNode;
    title?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
    >
      {children ?? title}
    </button>
  ),
}));

vi.mock('@/components/QuantitySelector', () => ({
  QuantitySelector: ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
    <div>
      <span>Quantity selector value: {value}</span>
      <button
        type="button"
        data-testid={`quantity-change-${value}`}
        onClick={() => onChange(value + 1)}
      >
        Change quantity
      </button>
    </div>
  ),
}));

vi.mock('@/utils/convertNumberToCurrency', () => ({
  convertNumberToCurrency: ({ value }: { value: number }) => `£${value.toFixed(2)}`,
}));

function renderInTable(ui: ReactNode) {
  return render(
    <table>
      <tbody>{ui}</tbody>
    </table>
  );
}

describe('BasketItem', () => {
  const onChange = vi.fn<(value: number) => void>();

  const defaultProps: BasketItemProps = {
    id: '1',
    title: 'Coffee Beans',
    summary: 'Rich and smooth roast',
    price: 12.5,
    thumbnail: {
      src: '/coffee.jpg',
      alt: 'Coffee Beans',
    },
    url: '/products/coffee-beans',
    onChange,
    quantity: 3,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product information, controls, quantity selector, and total price', () => {
    const { container } = renderInTable(<BasketItem {...defaultProps} />);

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(2);

    expect(screen.getByText('Coffee Beans')).toBeInTheDocument();
    expect(screen.getByText('£12.50')).toBeInTheDocument();
    expect(screen.getByText('Quantity selector value: 3')).toBeInTheDocument();
    expect(screen.getByText('£37.50')).toBeInTheDocument();

    expect(screen.getByTitle('Remove item from basket')).toBeInTheDocument();
    expect(screen.getByText('Save for later')).toBeInTheDocument();
    expect(screen.getByTestId('quantity-change-3')).toBeInTheDocument();
  });

  it('uses the provided product URL on both links', () => {
    const { container } = renderInTable(<BasketItem {...defaultProps} />);

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(2);

    expect(links[0]).toHaveAttribute('href', '/products/coffee-beans');
    expect(links[1]).toHaveAttribute('href', '/products/coffee-beans');
  });

  it('calls onChange with the updated value when the quantity selector changes', async () => {
    const user = userEvent.setup();

    renderInTable(<BasketItem {...defaultProps} />);

    await user.click(screen.getByTestId('quantity-change-3'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('renders the image with an empty alt attribute when no thumbnail alt is provided', () => {
    const { container } = renderInTable(
      <BasketItem
        {...defaultProps}
        thumbnail={{ src: '/coffee.jpg' }}
      />
    );

    const image = container.querySelector('img');

    expect(image).not.toBeNull();
    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('src', '/coffee.jpg');
  });
});

describe('BasketFooter', () => {
  it('renders the subtotal and checkout button', () => {
    renderInTable(<BasketFooter total={99.99} />);

    expect(screen.getByText('Sub-total: £99.99')).toBeInTheDocument();
    expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
  });

  it('renders a zero subtotal correctly', () => {
    renderInTable(<BasketFooter total={0} />);

    expect(screen.getByText('Sub-total: £0.00')).toBeInTheDocument();
  });
});

describe('Basket', () => {
  const items: BasketItemProps[] = [
    {
      id: '1',
      title: 'Coffee Beans',
      summary: 'Rich and smooth roast',
      price: 12.5,
      thumbnail: {
        src: '/coffee.jpg',
        alt: 'Coffee Beans',
      },
      url: '/products/coffee-beans',
      onChange: vi.fn<(value: number) => void>(),
      quantity: 2,
    },
    {
      id: '2',
      title: 'Espresso Cups',
      summary: 'Set of two',
      price: 8,
      thumbnail: {
        src: '/cups.jpg',
        alt: 'Espresso Cups',
      },
      url: '/products/espresso-cups',
      onChange: vi.fn<(value: number) => void>(),
      quantity: 4,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the table headings and all basket items', () => {
    render(
      <Basket
        items={items}
        total={33}
      />
    );

    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();

    expect(screen.getByText('Coffee Beans')).toBeInTheDocument();
    expect(screen.getByText('Espresso Cups')).toBeInTheDocument();

    expect(screen.getByText('Quantity selector value: 2')).toBeInTheDocument();
    expect(screen.getByText('Quantity selector value: 4')).toBeInTheDocument();

    expect(screen.getByText('£25.00')).toBeInTheDocument();
    expect(screen.getByText('£32.00')).toBeInTheDocument();
  });

  it('renders no basket item rows when items is empty', () => {
    const { container } = render(
      <Basket
        items={[]}
        total={0}
      />
    );

    expect(screen.queryByText('Coffee Beans')).not.toBeInTheDocument();
    expect(container.querySelectorAll('tbody tr')).toHaveLength(0);
  });

  it('passes each item onChange handler through to its quantity selector', async () => {
    const user = userEvent.setup();

    render(
      <Basket
        items={items}
        total={0}
      />
    );

    const firstButton = screen.getByTestId('quantity-change-2');
    const secondButton = screen.getByTestId('quantity-change-4');

    const [firstItem, secondItem] = items;

    if (!firstItem || !secondItem) {
      throw new Error('Expected two basket items');
    }

    await user.click(firstButton);
    await user.click(secondButton);

    expect(firstItem.onChange).toHaveBeenCalledTimes(1);
    expect(firstItem.onChange).toHaveBeenCalledWith(3);

    expect(secondItem.onChange).toHaveBeenCalledTimes(1);
    expect(secondItem.onChange).toHaveBeenCalledWith(5);
  });
});
