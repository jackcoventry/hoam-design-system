/* eslint-disable react/display-name */
import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ButtonHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { vi } from 'vitest';

import { ProductInfo, type ProductInfoProps } from '@/components/ProductInfo/ProductInfo';

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
    type,
  }: {
    children?: ReactNode;
    disabled?: boolean;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  }) => (
    <button
      type={type ?? 'button'}
      disabled={disabled}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/Form', () => {
  function SelectRoot({
    children,
    label,
    value,
    onChange,
    ...rest
  }: {
    children?: ReactNode;
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
  } & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'>) {
    return (
      <label>
        <span>{label}</span>
        <select
          aria-label={label}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          {...rest}
        >
          {children}
        </select>
      </label>
    );
  }

  SelectRoot.Placeholder = ({ children }: { children?: ReactNode }) => (
    <option value="">{children}</option>
  );

  SelectRoot.OptGroup = ({ children, label }: { children?: ReactNode; label: string }) => (
    <optgroup label={label}>{children}</optgroup>
  );

  SelectRoot.Option = ({
    children,
    value,
    disabled,
  }: {
    children?: ReactNode;
    value: string;
    disabled?: boolean;
  }) => (
    <option
      value={value}
      disabled={disabled}
    >
      {children}
    </option>
  );

  return {
    FieldWrapper: ({ children, error }: { children?: ReactNode; error?: string }) => (
      <div>
        {children}
        {error ? <div role="alert">{error}</div> : null}
      </div>
    ),
    Select: SelectRoot,
  };
});

vi.mock('@/components/QuantitySelector', () => ({
  QuantitySelector: ({
    value,
    onChange,
    ariaLabel,
    max,
  }: {
    value: number;
    onChange: (value: number) => void;
    ariaLabel?: string;
    max?: number;
  }) => (
    <div>
      <span>Quantity value: {value}</span>
      <button
        type="button"
        aria-label={ariaLabel ?? 'Quantity'}
        onClick={() => onChange(Math.min(value + 1, max ?? value + 1))}
      >
        Increase quantity
      </button>
    </div>
  ),
}));

vi.mock('@/components/VariantSelector', () => ({
  VariantSelector: ({
    label,
    name,
    options,
    value,
    onChange,
  }: {
    label: string;
    name: string;
    options: Array<{ value: string; displayValue: string }>;
    value?: string;
    onChange?: (value: string) => void;
  }) => (
    <label>
      <span>{label}</span>
      <select
        aria-label={label}
        name={name}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.displayValue}
          </option>
        ))}
      </select>
    </label>
  ),
}));

vi.mock('@/components/Accordion', () => ({
  Accordion: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  AccordionItem: ({ children }: { children?: ReactNode; id: string }) => <div>{children}</div>,
  AccordionHeader: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  AccordionPanel: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/utils/convertNumberToCurrency', () => ({
  convertNumberToCurrency: ({ value, currency }: { value: number; currency?: string }) =>
    value > 0 ? `${currency ?? 'GBP'}-${value.toFixed(2)}` : undefined,
}));

describe('ProductInfo', () => {
  const defaultProps: ProductInfoProps = {
    title: 'HOAM T-Shirt',
    description: 'A heavyweight cotton t-shirt.',
    productId: 'hoam-tshirt',
    price: {
      amount: 30,
      saleAmount: 20,
      currency: 'GBP',
    },
    inStock: true,
    newItem: true,
    lowStock: false,
    data: {
      options: {
        color: [
          { label: 'Black', value: 'black', displayValue: 'Black' },
          { label: 'White', value: 'white', displayValue: 'White' },
        ],
        size: [
          { label: 'Small', value: 's', displayValue: 'Small' },
          { label: 'Medium', value: 'm', displayValue: 'Medium' },
        ],
        image: [
          { label: 'Front', value: 'front', displayValue: 'Front' },
          { label: 'Back', value: 'back', displayValue: 'Back' },
        ],
        tshirt: [
          { label: 'S', value: 's-black', displayValue: 'Small / Black', category: 'Black' },
          { label: 'M', value: 'm-black', displayValue: 'Medium / Black', category: 'Black' },
          { label: 'S', value: 's-white', displayValue: 'Small / White', category: 'White' },
          {
            label: 'XL',
            value: 'xl-white',
            displayValue: 'XL / White',
            category: 'White',
            disabled: true,
          },
        ],
      },
    },
    onSubmit: () => {},
    isSubmitting: false,
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the main product content', () => {
    render(<ProductInfo {...defaultProps} />);

    expect(screen.getByRole('heading', { level: 1, name: 'HOAM T-Shirt' })).toBeInTheDocument();
    expect(screen.getByText('A heavyweight cotton t-shirt.')).toBeInTheDocument();
    expect(screen.getByText('GBP-20.00')).toBeInTheDocument();
    expect(screen.getByText('GBP-30.00')).toBeInTheDocument();
  });

  it('renders the NEW badge when newItem is true', () => {
    render(<ProductInfo {...defaultProps} />);

    expect(screen.getByTestId('badge-list')).toBeInTheDocument();
    expect(screen.getByTestId('badge-list-item')).toHaveTextContent('NEW');
  });

  it('renders the badge list when lowStock is true', () => {
    render(
      <ProductInfo
        {...defaultProps}
        newItem={false}
        lowStock
      />
    );

    expect(screen.getByTestId('badge-list')).toBeInTheDocument();
    expect(screen.queryByTestId('badge-list-item')).not.toBeInTheDocument();
  });

  it('does not render badges when neither newItem nor lowStock is true', () => {
    render(
      <ProductInfo
        {...defaultProps}
        newItem={false}
        lowStock={false}
      />
    );

    expect(screen.queryByTestId('badge-list')).not.toBeInTheDocument();
  });

  it('renders all selectors and the quantity control', () => {
    render(<ProductInfo {...defaultProps} />);

    expect(screen.getByLabelText('Color')).toBeInTheDocument();
    expect(screen.getByLabelText('Size')).toBeInTheDocument();
    expect(screen.getByLabelText('Image')).toBeInTheDocument();
    expect(screen.getByLabelText('T-Shirt Size')).toBeInTheDocument();
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('Quantity value: 1')).toBeInTheDocument();
  });

  it('renders grouped t-shirt options', () => {
    render(<ProductInfo {...defaultProps} />);

    expect(screen.getByRole('group', { name: 'Black' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'White' })).toBeInTheDocument();

    expect(screen.getByRole('option', { name: 'Small / Black' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Medium / Black' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Small / White' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'XL / White' })).toBeDisabled();
  });

  it('renders an enabled Add to cart button when in stock', () => {
    render(<ProductInfo {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeEnabled();
  });

  it('renders a disabled Add to cart button when out of stock', () => {
    render(
      <ProductInfo
        {...defaultProps}
        inStock={false}
      />
    );

    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeDisabled();
  });

  it('renders Added! and disables the submit button when isSubmitting is true', () => {
    render(
      <ProductInfo
        {...defaultProps}
        isSubmitting
      />
    );

    expect(screen.getByRole('button', { name: 'Added!' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Add to cart' })).not.toBeInTheDocument();
  });

  it('submits the default form values', async () => {
    const handleSubmit = vi.fn();
    const { container } = render(
      <ProductInfo
        {...defaultProps}
        onSubmit={handleSubmit}
      />
    );

    const form = container.querySelector('form');
    if (!form) {
      throw new Error('Expected form to be rendered');
    }

    await act(async () => {
      fireEvent.submit(form);
      await Promise.resolve();
    });

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      {
        color: 'black',
        size: 's',
        image: 'front',
        tshirt: 's-black',
        quantity: 1,
      },
      expect.anything()
    );
  });

  it('uses default form values initially', () => {
    render(<ProductInfo {...defaultProps} />);

    expect(screen.getByLabelText('Color')).toHaveValue('black');
    expect(screen.getByLabelText('Size')).toHaveValue('s');
    expect(screen.getByLabelText('Image')).toHaveValue('front');
    expect(screen.getByLabelText('T-Shirt Size')).toHaveValue('s-black');
    expect(screen.getByText('Quantity value: 1')).toBeInTheDocument();
  });

  it('updates form-controlled values', () => {
    render(<ProductInfo {...defaultProps} />);

    fireEvent.change(screen.getByLabelText('Color'), {
      target: { value: 'white' },
    });
    fireEvent.change(screen.getByLabelText('Size'), {
      target: { value: 'm' },
    });
    fireEvent.change(screen.getByLabelText('Image'), {
      target: { value: 'back' },
    });
    fireEvent.change(screen.getByLabelText('T-Shirt Size'), {
      target: { value: 's-white' },
    });
    fireEvent.click(screen.getByLabelText('Quantity'));

    expect(screen.getByLabelText('Color')).toHaveValue('white');
    expect(screen.getByLabelText('Size')).toHaveValue('m');
    expect(screen.getByLabelText('Image')).toHaveValue('back');
    expect(screen.getByLabelText('T-Shirt Size')).toHaveValue('s-white');
    expect(screen.getByText('Quantity value: 2')).toBeInTheDocument();
  });

  it('renders the regular price only when there is no sale price', () => {
    render(
      <ProductInfo
        {...defaultProps}
        price={{
          amount: 30,
          saleAmount: 0,
          currency: 'GBP',
        }}
      />
    );

    expect(screen.getByText('GBP-30.00')).toBeInTheDocument();
    expect(screen.queryByText('GBP-0.00')).not.toBeInTheDocument();
  });

  it('does not render the description when it is not provided', () => {
    render(
      <ProductInfo
        {...defaultProps}
        description={undefined}
      />
    );

    expect(screen.queryByText('A heavyweight cotton t-shirt.')).not.toBeInTheDocument();
  });

  it('throws when any required option list is empty', () => {
    expect(() =>
      render(
        <ProductInfo
          {...defaultProps}
          data={{
            options: {
              ...defaultProps.data.options,
              color: [],
            },
          }}
        />
      )
    ).toThrow('ProductInfo requires at least one option for color, size, image, and tshirt.');
  });

  it('renders accordion content headings', () => {
    render(<ProductInfo {...defaultProps} />);

    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Returns Policy')).toBeInTheDocument();
  });
});
