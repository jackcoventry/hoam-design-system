import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ProductInfo,
  type ProductInfoProps,
  type ProductInformationSchemaType,
} from '@/components/ProductInfo/ProductInfo';

type ProductTileMessages = {
  new: string;
  lowStock: string;
  addToCart: string;
  addedToCart: string;
};

const useMessagesMock = vi.fn<(key: 'productTile') => ProductTileMessages>();
const formatCurrencyMock = vi.fn<(amount: number) => string>();
const loggerErrorMock = vi.fn<(message: string) => void>();

function getClosestForm(element: HTMLElement): HTMLFormElement {
  const form = element.closest('form');

  if (!(form instanceof HTMLFormElement)) {
    throw new TypeError('Expected submit button to be inside a form');
  }

  return form;
}

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (key: 'productTile') => useMessagesMock(key),
}));

vi.mock('@/hooks/useCurrency', () => ({
  useCurrency: () => ({
    formatCurrency: formatCurrencyMock,
  }),
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    error: (message: string) => loggerErrorMock(message),
  },
}));

vi.mock('@/components/Accordion', () => ({
  Accordion: ({ children, defaultOpenIds }: { children: ReactNode; defaultOpenIds?: string[] }) => (
    <div
      data-testid="accordion"
      data-default-open-ids={defaultOpenIds?.join(',') ?? ''}
    >
      {children}
    </div>
  ),
  AccordionItem: ({ children, id }: { children: ReactNode; id: string }) => (
    <div
      data-testid="accordion-item"
      data-id={id}
    >
      {children}
    </div>
  ),
  AccordionHeader: ({ children }: { children: ReactNode }) => (
    <div data-testid="accordion-header">{children}</div>
  ),
  AccordionPanel: ({ children }: { children: ReactNode }) => (
    <div data-testid="accordion-panel">{children}</div>
  ),
}));

vi.mock('@/components/BadgeList', () => ({
  BadgeList: ({ children }: { children: ReactNode }) => (
    <div data-testid="badge-list">{children}</div>
  ),
  BadgeListItem: ({ children, variant }: { children: ReactNode; variant: string }) => (
    <span
      data-testid="badge-list-item"
      data-variant={variant}
    >
      {children}
    </span>
  ),
}));

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    type,
    disabled,
    className,
  }: {
    children: ReactNode;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string;
  }) => (
    <button
      type={type}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/Common/BodyText', () => ({
  BodyText: ({ children }: { children: ReactNode }) => (
    <div data-testid="body-text">{children}</div>
  ),
}));

vi.mock('@/components/Form', () => {
  function FieldWrapper({ children, error }: { children: ReactNode; error?: string }) {
    return (
      <div data-testid="field-wrapper">
        {children}
        {error ? <div role="alert">{error}</div> : null}
      </div>
    );
  }

  type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
    label: string;
    children: ReactNode;
  };

  function Select({ label, children, ...props }: SelectProps) {
    return (
      <label>
        <span>{label}</span>
        <select {...props}>{children}</select>
      </label>
    );
  }

  Select.OptGroup = function OptGroup({ label, children }: { label: string; children: ReactNode }) {
    return <optgroup label={label}>{children}</optgroup>;
  };

  Select.Option = function Option({
    value,
    disabled,
    children,
  }: {
    value: string;
    disabled?: boolean;
    children: ReactNode;
  }) {
    return (
      <option
        value={value}
        disabled={disabled}
      >
        {children}
      </option>
    );
  };

  return {
    FieldWrapper,
    Select,
  };
});

vi.mock('@/components/Layout', () => ({
  Section: ({ children }: { children: ReactNode }) => (
    <section data-testid="section">{children}</section>
  ),
  Stack: ({ children }: { children: ReactNode }) => <div data-testid="stack">{children}</div>,
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
    options: Array<{
      label: string;
      value: string;
      displayValue: string;
      disabled?: boolean;
    }>;
    value?: string;
    onChange: (value: string) => void;
  }) => (
    <label>
      <span>{label}</span>
      <select
        aria-label={label}
        name={name}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.displayValue}
          </option>
        ))}
      </select>
    </label>
  ),
}));

describe('ProductInfo', () => {
  const onSubmitMock = vi.fn<(args: ProductInformationSchemaType) => void>();

  const baseProps: ProductInfoProps = {
    title: 'Classic Tee',
    description: 'A premium cotton t-shirt.',
    productId: 'product-1',
    price: {
      amount: 30,
      saleAmount: 20,
    },
    inStock: true,
    newItem: true,
    lowStock: true,
    data: {
      options: {
        color: [
          {
            label: 'Red',
            value: 'red',
            displayValue: 'Red',
          },
          {
            label: 'Blue',
            value: 'blue',
            displayValue: 'Blue',
          },
        ],
        size: [
          {
            label: 'Small',
            value: 's',
            displayValue: 'Small',
          },
          {
            label: 'Medium',
            value: 'm',
            displayValue: 'Medium',
          },
        ],
        image: [
          {
            label: 'Front',
            value: 'front',
            displayValue: 'Front',
          },
          {
            label: 'Back',
            value: 'back',
            displayValue: 'Back',
          },
        ],
        tshirt: [
          {
            label: 'Small',
            value: 'small-men',
            displayValue: 'Small',
            category: 'Men',
          },
          {
            label: 'Medium',
            value: 'medium-men',
            displayValue: 'Medium',
            category: 'Men',
          },
          {
            label: 'Small',
            value: 'small-women',
            displayValue: 'Small',
            category: 'Women',
          },
          {
            label: 'Large',
            value: 'large-other',
            displayValue: 'Large',
          },
          {
            label: 'XL',
            value: 'xl-disabled',
            displayValue: 'XL',
            category: 'Women',
            disabled: true,
          },
        ],
      },
      moreInformation: [
        {
          id: 'details',
          title: 'Details',
          text: 'Made from 100% cotton.',
        },
        {
          id: 'delivery',
          title: 'Delivery',
          text: 'Delivered within 3-5 days.',
        },
      ],
    },
    onSubmit: onSubmitMock,
    isSubmitting: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    useMessagesMock.mockReturnValue({
      new: 'New',
      lowStock: 'Low stock',
      addToCart: 'Add to cart',
      addedToCart: 'Added to cart',
    });

    formatCurrencyMock.mockImplementation((amount) => `£${amount.toFixed(2)}`);
  });

  it('renders the main product content', () => {
    render(<ProductInfo {...baseProps} />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classic Tee',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByText('A premium cotton t-shirt.')).toBeInTheDocument();
  });

  it('formats both sale and regular prices', () => {
    render(<ProductInfo {...baseProps} />);

    expect(formatCurrencyMock).toHaveBeenCalledWith(30);
    expect(formatCurrencyMock).toHaveBeenCalledWith(20);

    expect(screen.getByText('£20.00')).toBeInTheDocument();
    expect(screen.getByText('£30.00')).toBeInTheDocument();
  });

  it('renders the sale price and previous price when a sale price string is returned', () => {
    render(<ProductInfo {...baseProps} />);

    const priceHeading = screen.getByRole('heading', { level: 2 });
    expect(within(priceHeading).getByText('£20.00')).toBeInTheDocument();
    expect(within(priceHeading).getByText('£30.00')).toBeInTheDocument();
  });

  it('renders only the main price when the sale price string is empty', () => {
    formatCurrencyMock.mockImplementation((amount) => {
      if (amount === 20) {
        return '';
      }

      return `£${amount.toFixed(2)}`;
    });

    render(<ProductInfo {...baseProps} />);

    const priceHeading = screen.getByRole('heading', { level: 2 });
    expect(within(priceHeading).getByText('£30.00')).toBeInTheDocument();
    expect(within(priceHeading).queryByText('£20.00')).not.toBeInTheDocument();
  });

  it('renders both badges when newItem and lowStock are true', () => {
    render(<ProductInfo {...baseProps} />);

    const badges = screen.getAllByTestId('badge-list-item');
    expect(badges).toHaveLength(2);

    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Low stock')).toBeInTheDocument();
  });

  it('renders only the new badge when only newItem is true', () => {
    render(
      <ProductInfo
        {...baseProps}
        lowStock={false}
      />
    );

    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.queryByText('Low stock')).not.toBeInTheDocument();
  });

  it('renders only the low stock badge when only lowStock is true', () => {
    render(
      <ProductInfo
        {...baseProps}
        newItem={false}
      />
    );

    expect(screen.queryByText('New')).not.toBeInTheDocument();
    expect(screen.getByText('Low stock')).toBeInTheDocument();
  });

  it('renders no badge list when neither newItem nor lowStock is true', () => {
    render(
      <ProductInfo
        {...baseProps}
        newItem={false}
        lowStock={false}
      />
    );

    expect(screen.queryByTestId('badge-list')).not.toBeInTheDocument();
  });

  it('does not render the description when it is not provided', () => {
    render(
      <ProductInfo
        {...baseProps}
        description={undefined}
      />
    );

    expect(screen.queryByText('A premium cotton t-shirt.')).not.toBeInTheDocument();
  });

  it('renders all form controls with default values from the first option in each list', () => {
    render(<ProductInfo {...baseProps} />);

    expect(screen.getByLabelText('Color')).toHaveValue('red');
    expect(screen.getByLabelText('Size')).toHaveValue('s');
    expect(screen.getByLabelText('Image')).toHaveValue('front');
    expect(screen.getByLabelText('T-Shirt Size')).toHaveValue('small-men');
  });

  it('groups t-shirt options by category and falls back to Other', () => {
    render(<ProductInfo {...baseProps} />);

    const tshirtSelect = screen.getByLabelText('T-Shirt Size');

    const menGroup = within(tshirtSelect).getByRole('group', { name: 'Men' });
    const womenGroup = within(tshirtSelect).getByRole('group', { name: 'Women' });
    const otherGroup = within(tshirtSelect).getByRole('group', { name: 'Other' });

    expect(within(menGroup).getByRole('option', { name: 'Small' })).toBeInTheDocument();
    expect(within(menGroup).getByRole('option', { name: 'Medium' })).toBeInTheDocument();
    expect(within(womenGroup).getByRole('option', { name: 'Small' })).toBeInTheDocument();
    expect(within(otherGroup).getByRole('option', { name: 'Large' })).toBeInTheDocument();
  });

  it('renders disabled t-shirt options as disabled', () => {
    render(<ProductInfo {...baseProps} />);

    const tshirtSelect = screen.getByLabelText('T-Shirt Size');
    const womenGroup = within(tshirtSelect).getByRole('group', { name: 'Women' });
    const disabledOption = within(womenGroup).getByRole('option', { name: 'XL' });

    expect(disabledOption).toBeDisabled();
  });

  it('submits the updated form values', async () => {
    render(<ProductInfo {...baseProps} />);

    fireEvent.change(screen.getByLabelText('Color'), {
      target: { value: 'blue' },
    });
    fireEvent.change(screen.getByLabelText('Size'), {
      target: { value: 'm' },
    });
    fireEvent.change(screen.getByLabelText('Image'), {
      target: { value: 'back' },
    });
    fireEvent.change(screen.getByLabelText('T-Shirt Size'), {
      target: { value: 'small-women' },
    });

    const submitButton = screen.getByRole('button', { name: 'Add to cart' });
    fireEvent.submit(getClosestForm(submitButton));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock.mock.calls[0]?.[0]).toEqual({
        color: 'blue',
        size: 'm',
        image: 'back',
        tshirt: 'small-women',
      });
    });
  });

  it('submits the default form values when unchanged', async () => {
    render(<ProductInfo {...baseProps} />);

    const submitButton = screen.getByRole('button', { name: 'Add to cart' });
    fireEvent.submit(getClosestForm(submitButton));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock.mock.calls[0]?.[0]).toEqual({
        color: 'red',
        size: 's',
        image: 'front',
        tshirt: 'small-men',
      });
    });
  });

  it('disables the submit button when the product is out of stock', () => {
    render(
      <ProductInfo
        {...baseProps}
        inStock={false}
      />
    );

    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeDisabled();
  });

  it('disables the submit button and changes its text when submitting', () => {
    render(
      <ProductInfo
        {...baseProps}
        isSubmitting
      />
    );

    const button = screen.getByRole('button', { name: 'Added to cart' });
    expect(button).toBeDisabled();
  });

  it('renders the more information accordion items', () => {
    render(<ProductInfo {...baseProps} />);

    expect(screen.getByTestId('accordion')).toHaveAttribute('data-default-open-ids', 'details');

    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Delivery')).toBeInTheDocument();
    expect(screen.getByText('Made from 100% cotton.')).toBeInTheDocument();
    expect(screen.getByText('Delivered within 3-5 days.')).toBeInTheDocument();
  });

  it('requests the expected message namespace', () => {
    render(<ProductInfo {...baseProps} />);

    expect(useMessagesMock).toHaveBeenCalledWith('productTile');
  });

  it('logs an error when moreInformation is empty', () => {
    render(
      <ProductInfo
        {...baseProps}
        data={{
          ...baseProps.data,
          moreInformation: [],
        }}
      />
    );

    expect(loggerErrorMock).toHaveBeenCalledWith('More information requires at least one item.');
  });

  it('logs an error and then throws when any required option list is empty', () => {
    expect(() => {
      render(
        <ProductInfo
          {...baseProps}
          data={{
            options: {
              color: [],
              size: baseProps.data.options.size,
              image: baseProps.data.options.image,
              tshirt: baseProps.data.options.tshirt,
            },
            moreInformation: baseProps.data.moreInformation,
          }}
        />
      );
    }).toThrow();

    expect(loggerErrorMock).toHaveBeenCalledWith(
      'ProductInfo requires at least one option for color, size, image, and tshirt.'
    );
  });

  it('logs both runtime errors and then throws when moreInformation is empty and required options are missing', () => {
    expect(() => {
      render(
        <ProductInfo
          {...({
            ...baseProps,
            data: {
              options: {
                color: [],
                size: [],
                image: [],
                tshirt: [],
              },
              moreInformation: [],
            },
          } as ProductInfoProps)}
        />
      );
    }).toThrow();

    expect(loggerErrorMock).toHaveBeenCalledWith('More information requires at least one item.');
    expect(loggerErrorMock).toHaveBeenCalledWith(
      'ProductInfo requires at least one option for color, size, image, and tshirt.'
    );
  });
});
