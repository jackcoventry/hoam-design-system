import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ProductInfo,
  type ProductInfoProps,
  type ProductInformationSchemaType,
  type ProductOption,
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
  AccordionItem: ({
    children,
    id,
    title,
  }: {
    children: ReactNode;
    id: string;
    title: ReactNode;
  }) => (
    <div
      data-testid="accordion-item"
      data-id={id}
    >
      <div data-testid="accordion-header">{title}</div>
      <div data-testid="accordion-panel">{children}</div>
    </div>
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
    title: 'House Espresso Blend',
    description: 'A balanced espresso coffee with chocolate sweetness and citrus brightness.',
    productId: 'house-espresso-blend',
    price: {
      amount: 18,
      saleAmount: 15,
    },
    inStock: true,
    newItem: true,
    lowStock: true,
    data: {
      options: [
        {
          id: 'roast',
          label: 'Roast',
          input: 'color',
          options: [
            {
              label: 'Light Roast',
              value: 'light-roast',
              displayValue: '#c78b52',
            },
            {
              label: 'Dark Roast',
              value: 'dark-roast',
              displayValue: '#4a2c20',
            },
          ],
        },
        {
          id: 'bagSize',
          label: 'Bag Size',
          input: 'label',
          options: [
            {
              label: '250g',
              value: '250g',
              displayValue: '250g',
            },
            {
              label: '500g',
              value: '500g',
              displayValue: '500g',
            },
          ],
        },
        {
          id: 'brewStyle',
          label: 'Brew Style',
          input: 'image',
          options: [
            {
              label: 'Espresso',
              value: 'espresso',
              displayValue: 'Espresso',
            },
            {
              label: 'Pour Over',
              value: 'pour-over',
              displayValue: 'Pour Over',
            },
          ],
        },
        {
          id: 'grind',
          label: 'Grind',
          input: 'select',
          options: [
            {
              label: 'Whole Bean',
              value: 'whole-bean',
              displayValue: 'Whole Bean',
              category: 'Whole Bean',
            },
            {
              label: 'Espresso',
              value: 'espresso-fine',
              displayValue: 'Espresso - Fine',
              category: 'Ground',
            },
            {
              label: 'Roaster Recommendation',
              value: 'roaster-recommendation',
              displayValue: 'Roaster Recommendation',
            },
            {
              label: 'Cold Brew',
              value: 'cold-brew-extra-coarse',
              displayValue: 'Cold Brew - Extra Coarse',
              category: 'Ground',
              disabled: true,
            },
          ],
        },
      ],
      moreInformation: [
        {
          id: 'tasting-notes',
          title: 'Tasting Notes',
          text: 'Brown sugar, citrus, and milk chocolate.',
        },
        {
          id: 'brew-guide',
          title: 'Brew Guide',
          text: 'Best for espresso, moka pot, or a short pour-over.',
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
        name: 'House Espresso Blend',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(
      screen.getByText('A balanced espresso coffee with chocolate sweetness and citrus brightness.')
    ).toBeInTheDocument();
  });

  it('formats both sale and regular prices', () => {
    render(<ProductInfo {...baseProps} />);

    expect(formatCurrencyMock).toHaveBeenCalledWith(18);
    expect(formatCurrencyMock).toHaveBeenCalledWith(15);

    expect(screen.getByText('£15.00')).toBeInTheDocument();
    expect(screen.getByText('£18.00')).toBeInTheDocument();
  });

  it('renders the sale price and previous price when a sale price string is returned', () => {
    render(<ProductInfo {...baseProps} />);

    const priceHeading = screen.getByRole('heading', { level: 2 });
    expect(within(priceHeading).getByText('£15.00')).toBeInTheDocument();
    expect(within(priceHeading).getByText('£18.00')).toBeInTheDocument();
  });

  it('renders only the main price when the sale price string is empty', () => {
    formatCurrencyMock.mockImplementation((amount) => {
      if (amount === 15) {
        return '';
      }

      return `£${amount.toFixed(2)}`;
    });

    render(<ProductInfo {...baseProps} />);

    const priceHeading = screen.getByRole('heading', { level: 2 });
    expect(within(priceHeading).getByText('£18.00')).toBeInTheDocument();
    expect(within(priceHeading).queryByText('£15.00')).not.toBeInTheDocument();
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

    expect(
      screen.queryByText(
        'A balanced espresso coffee with chocolate sweetness and citrus brightness.'
      )
    ).not.toBeInTheDocument();
  });

  it('renders all configured form controls with default values from the first option in each group', () => {
    render(<ProductInfo {...baseProps} />);

    expect(screen.getByLabelText('Roast')).toHaveValue('light-roast');
    expect(screen.getByLabelText('Bag Size')).toHaveValue('250g');
    expect(screen.getByLabelText('Brew Style')).toHaveValue('espresso');
    expect(screen.getByLabelText('Grind')).toHaveValue('whole-bean');
  });

  it('groups select options by category and falls back to Other for uncategorised options', () => {
    render(<ProductInfo {...baseProps} />);

    const grindSelect = screen.getByLabelText('Grind');

    const wholeBeanGroup = within(grindSelect).getByRole('group', { name: 'Whole Bean' });
    const groundGroup = within(grindSelect).getByRole('group', { name: 'Ground' });
    const otherGroup = within(grindSelect).getByRole('group', { name: 'Other' });

    expect(within(wholeBeanGroup).getByRole('option', { name: 'Whole Bean' })).toBeInTheDocument();
    expect(
      within(groundGroup).getByRole('option', { name: 'Espresso - Fine' })
    ).toBeInTheDocument();
    expect(
      within(otherGroup).getByRole('option', { name: 'Roaster Recommendation' })
    ).toBeInTheDocument();
  });

  it('renders disabled select options as disabled', () => {
    render(<ProductInfo {...baseProps} />);

    const grindSelect = screen.getByLabelText('Grind');
    const groundGroup = within(grindSelect).getByRole('group', { name: 'Ground' });
    const disabledOption = within(groundGroup).getByRole('option', {
      name: 'Cold Brew - Extra Coarse',
    });

    expect(disabledOption).toBeDisabled();
  });

  it('renders ungrouped select options when categories are not provided', () => {
    render(
      <ProductInfo
        {...baseProps}
        data={{
          ...baseProps.data,
          options: baseProps.data.options.map((group) =>
            group.id === 'grind'
              ? {
                  ...group,
                  options: group.options.map((option) => {
                    const nextOption: ProductOption = {
                      label: option.label,
                      value: option.value,
                    };

                    if (option.displayValue !== undefined) {
                      nextOption.displayValue = option.displayValue;
                    }

                    if (option.disabled !== undefined) {
                      nextOption.disabled = option.disabled;
                    }

                    return nextOption;
                  }),
                }
              : group
          ),
        }}
      />
    );

    const grindSelect = screen.getByLabelText('Grind');

    expect(within(grindSelect).queryAllByRole('group')).toHaveLength(0);
    expect(
      within(grindSelect).getByRole('option', { name: 'Roaster Recommendation' })
    ).toBeInTheDocument();
  });

  it('submits the updated form values', async () => {
    render(<ProductInfo {...baseProps} />);

    fireEvent.change(screen.getByLabelText('Roast'), {
      target: { value: 'dark-roast' },
    });
    fireEvent.change(screen.getByLabelText('Bag Size'), {
      target: { value: '500g' },
    });
    fireEvent.change(screen.getByLabelText('Brew Style'), {
      target: { value: 'pour-over' },
    });
    fireEvent.change(screen.getByLabelText('Grind'), {
      target: { value: 'espresso-fine' },
    });

    const submitButton = screen.getByRole('button', { name: 'Add to cart' });
    fireEvent.submit(getClosestForm(submitButton));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock.mock.calls[0]?.[0]).toEqual({
        roast: 'dark-roast',
        bagSize: '500g',
        brewStyle: 'pour-over',
        grind: 'espresso-fine',
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
        roast: 'light-roast',
        bagSize: '250g',
        brewStyle: 'espresso',
        grind: 'whole-bean',
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

    expect(screen.getByTestId('accordion')).toHaveAttribute(
      'data-default-open-ids',
      'tasting-notes'
    );

    expect(screen.getByText('Tasting Notes')).toBeInTheDocument();
    expect(screen.getByText('Brew Guide')).toBeInTheDocument();
    expect(screen.getByText('Brown sugar, citrus, and milk chocolate.')).toBeInTheDocument();
    expect(
      screen.getByText('Best for espresso, moka pot, or a short pour-over.')
    ).toBeInTheDocument();
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

  it('logs an error and then throws when any configured option group has no options', () => {
    expect(() => {
      render(
        <ProductInfo
          {...baseProps}
          data={{
            ...baseProps.data,
            options: baseProps.data.options.map((group) =>
              group.id === 'roast'
                ? {
                    ...group,
                    options: [],
                  }
                : group
            ),
          }}
        />
      );
    }).toThrow();

    expect(loggerErrorMock).toHaveBeenCalledWith(
      'ProductInfo requires at least one option for each configured option group.'
    );
  });

  it('logs both runtime errors and then throws when moreInformation is empty and no option groups are configured', () => {
    expect(() => {
      render(
        <ProductInfo
          {...({
            ...baseProps,
            data: {
              options: [],
              moreInformation: [],
            },
          } as ProductInfoProps)}
        />
      );
    }).toThrow();

    expect(loggerErrorMock).toHaveBeenCalledWith('More information requires at least one item.');
    expect(loggerErrorMock).toHaveBeenCalledWith(
      'ProductInfo requires at least one option for each configured option group.'
    );
  });
});
