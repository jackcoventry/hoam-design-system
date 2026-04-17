import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductInfo, type ProductInfoProps } from '@/components/ProductInfo/ProductInfo';

const mockUseMessages = vi.fn<
  (namespace: string) => {
    new: string;
    lowStock: string;
    addToCart: string;
    addedToCart: string;
  }
>();

const mockConvertNumberToCurrency = vi.fn<(args: { value: number; currency: string }) => string>();

const mockLoggerError = vi.fn<(message: string) => void>();

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => mockUseMessages(namespace),
}));

vi.mock('@/utils/convertNumberToCurrency', () => ({
  convertNumberToCurrency: (args: { value: number; currency: string }) =>
    mockConvertNumberToCurrency(args),
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    error: (message: string) => mockLoggerError(message),
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
    <section
      data-testid="accordion-item"
      data-id={id}
    >
      {children}
    </section>
  ),
  AccordionHeader: ({ children }: { children: ReactNode }) => (
    <h3 data-testid="accordion-header">{children}</h3>
  ),
  AccordionPanel: ({ children }: { children: ReactNode }) => (
    <div data-testid="accordion-panel">{children}</div>
  ),
}));

vi.mock('@/components/BadgeList', () => ({
  BadgeList: ({ children }: { children: ReactNode }) => (
    <ul data-testid="badge-list">{children}</ul>
  ),
  BadgeListItem: ({ children, variant }: { children: ReactNode; variant?: string }) => (
    <li
      data-testid="badge-item"
      data-variant={variant}
    >
      {children}
    </li>
  ),
}));

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    disabled,
    type,
    className,
  }: {
    children: ReactNode;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
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

vi.mock('@/components/Layout', () => ({
  Section: ({ children, className }: { children: ReactNode; className?: string }) => (
    <section className={className}>{children}</section>
  ),
  Stack: ({ children }: { children: ReactNode; gap?: string }) => (
    <div data-testid="stack">{children}</div>
  ),
}));

vi.mock('@/components/Form', () => {
  function SelectPlaceholder({ children }: Readonly<{ children: ReactNode }>) {
    return <option value="">{children}</option>;
  }

  SelectPlaceholder.displayName = 'Select.Placeholder';

  function SelectOptGroup({ children, label }: Readonly<{ children: ReactNode; label: string }>) {
    return <optgroup label={label}>{children}</optgroup>;
  }

  SelectOptGroup.displayName = 'Select.OptGroup';

  function SelectOption({
    children,
    value,
    disabled,
  }: Readonly<{
    children: ReactNode;
    value: string;
    disabled?: boolean;
  }>) {
    return (
      <option
        value={value}
        disabled={disabled}
      >
        {children}
      </option>
    );
  }

  SelectOption.displayName = 'Select.Option';

  function SelectRoot({
    children,
    label,
    name,
    value,
    onChange,
  }: Readonly<{
    children: ReactNode;
    label: string;
    name?: string;
    value?: string;
    onChange?: (event: { target: { value: string; name?: string } }) => void;
  }>) {
    return (
      <label>
        <span>{label}</span>
        <select
          aria-label={label}
          name={name}
          value={value ?? ''}
          onChange={(event) =>
            onChange?.({
              target: {
                value: event.currentTarget.value,
                name: event.currentTarget.name,
              },
            })
          }
        >
          {children}
        </select>
      </label>
    );
  }

  SelectRoot.displayName = 'Select';

  SelectRoot.Placeholder = SelectPlaceholder;
  SelectRoot.OptGroup = SelectOptGroup;
  SelectRoot.Option = SelectOption;

  function FieldWrapper({ children, error }: Readonly<{ children: ReactNode; error?: string }>) {
    return (
      <div data-testid="field-wrapper">
        {children}
        {error ? <div role="alert">{error}</div> : null}
      </div>
    );
  }

  FieldWrapper.displayName = 'FieldWrapper';

  return {
    FieldWrapper,
    Select: SelectRoot,
  };
});

vi.mock('@/components/VariantSelector', () => ({
  VariantSelector: ({
    label,
    name,
    value,
    onChange,
    options,
    variant,
  }: {
    label?: string;
    name: string;
    value: string | null;
    onChange: (value: string) => void;
    options: Array<{
      label: string;
      value: string;
      disabled?: boolean;
    }>;
    variant?: string;
  }) => (
    <label>
      <span>{label}</span>
      <select
        aria-label={label ?? name}
        name={name}
        value={value ?? ''}
        data-variant={variant}
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  ),
}));

vi.mock('@/components/ProductInfo/ProductInfo.module.css', () => ({
  default: {
    root: 'root',
    content: 'content',
    title: 'title',
    price: 'price',
    pricePrevious: 'pricePrevious',
    description: 'description',
    button: 'button',
    information: 'information',
  },
}));

describe('ProductInfo', () => {
  const baseProps: ProductInfoProps = {
    title: 'Classic T-Shirt',
    description: 'A soft and comfortable everyday tee.',
    productId: 'product-123',
    price: {
      amount: 25,
      saleAmount: 20,
      currency: 'GBP',
    },
    inStock: true,
    newItem: true,
    lowStock: true,
    isSubmitting: false,
    onSubmit: vi.fn(),
    data: {
      options: {
        color: [
          { label: 'Red', value: 'red', displayValue: '#ff0000' },
          { label: 'Blue', value: 'blue', displayValue: '#0000ff' },
        ],
        size: [
          { label: 'Small', value: 's', displayValue: 'Small' },
          { label: 'Medium', value: 'm', displayValue: 'Medium' },
        ],
        image: [
          { label: 'Front', value: 'front', displayValue: '/front.jpg' },
          { label: 'Back', value: 'back', displayValue: '/back.jpg' },
        ],
        tshirt: [
          { label: 'Kids S', value: 'kids-s', displayValue: 'Kids Small', category: 'Kids' },
          { label: 'Kids M', value: 'kids-m', displayValue: 'Kids Medium', category: 'Kids' },
          { label: 'Adult S', value: 'adult-s', displayValue: 'Adult Small', category: 'Adults' },
          {
            label: 'Adult M',
            value: 'adult-m',
            displayValue: 'Adult Medium',
            category: 'Adults',
            disabled: true,
          },
        ],
      },
      moreInformation: [
        {
          id: 'item-1',
          title: 'Description',
          text: 'Ut minim mollit officia ad adipiscing velit duis duis fugiat. Reprehenderit voluptate dolore laboris esse in adipiscing adipiscing voluptate anim laboris qui reprehenderit eiusmod eiusmod incididunt occaecat excepteur mollit. Ad labore irure amet sit aliquip veniam pariatur veniam laboris nostrud nulla ullamco. Adipiscing veniam dolore cupidatat qui ad exercitation elit labore velit et aliquip adipiscing occaecat fugiat consequat esse sint nulla ea. Excepteur anim cillum culpa ullamco labore commodo veniam ut dolor excepteur irure duis voluptate proident ex in velit qui anim.',
        },
        {
          id: 'item-2',
          title: 'Returns Policy',
          text: 'Ut minim mollit officia ad adipiscing velit duis duis fugiat. Reprehenderit voluptate dolore laboris esse in adipiscing adipiscing voluptate anim laboris qui reprehenderit eiusmod eiusmod incididunt occaecat excepteur mollit. Ad labore irure amet sit aliquip veniam pariatur veniam laboris nostrud nulla ullamco. Adipiscing veniam dolore cupidatat qui ad exercitation elit labore velit et aliquip adipiscing occaecat fugiat consequat esse sint nulla ea. Excepteur anim cillum culpa ullamco labore commodo veniam ut dolor excepteur irure duis voluptate proident ex in velit qui anim.',
        },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseMessages.mockReturnValue({
      new: 'New',
      lowStock: 'Low stock',
      addToCart: 'Add to cart',
      addedToCart: 'Added to cart',
    });

    mockConvertNumberToCurrency.mockImplementation(
      ({ value, currency }: { value: number; currency: string }) =>
        `${currency} ${value.toFixed(2)}`
    );
  });

  it('renders the main product details', () => {
    render(<ProductInfo {...baseProps} />);

    expect(screen.getByRole('heading', { name: 'Classic T-Shirt', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('A soft and comfortable everyday tee.')).toBeInTheDocument();
  });

  it('calls useMessages with the productTile namespace', () => {
    render(<ProductInfo {...baseProps} />);

    expect(mockUseMessages).toHaveBeenCalledWith('productTile');
  });

  it('renders new and low stock badges when both flags are true', () => {
    render(<ProductInfo {...baseProps} />);

    const badges = screen.getAllByTestId('badge-item');
    expect(badges).toHaveLength(2);

    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Low stock')).toBeInTheDocument();

    expect(badges[0]).toHaveAttribute('data-variant', 'default');
    expect(badges[1]).toHaveAttribute('data-variant', 'alert');
  });

  it('renders no badges when newItem and lowStock are false', () => {
    render(
      <ProductInfo
        {...baseProps}
        newItem={false}
        lowStock={false}
      />
    );

    expect(screen.queryByTestId('badge-list')).not.toBeInTheDocument();
    expect(screen.queryByText('New')).not.toBeInTheDocument();
    expect(screen.queryByText('Low stock')).not.toBeInTheDocument();
  });

  it('renders the sale price and previous price when sale price is present', () => {
    render(<ProductInfo {...baseProps} />);

    expect(mockConvertNumberToCurrency).toHaveBeenCalledWith({ value: 25, currency: 'GBP' });
    expect(mockConvertNumberToCurrency).toHaveBeenCalledWith({ value: 20, currency: 'GBP' });

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('GBP 20.00');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('GBP 25.00');
  });

  it('renders only the regular price when the sale price string is empty', () => {
    mockConvertNumberToCurrency.mockImplementation(
      ({ value, currency }: { value: number; currency: string }) => {
        if (value === 20) {
          return '';
        }

        return `${currency} ${value.toFixed(2)}`;
      }
    );

    render(<ProductInfo {...baseProps} />);

    const priceHeading = screen.getByRole('heading', { level: 2 });
    expect(priceHeading).toHaveTextContent('GBP 25.00');
    expect(priceHeading).not.toHaveTextContent('GBP 20.00');
  });

  it('omits the description when it is not provided', () => {
    render(
      <ProductInfo
        {...baseProps}
        description={undefined}
      />
    );

    expect(screen.queryByText('A soft and comfortable everyday tee.')).not.toBeInTheDocument();
  });

  it('renders the form controls with their labels', () => {
    render(<ProductInfo {...baseProps} />);

    expect(screen.getByRole('combobox', { name: 'Color' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Size' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Image' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'T-Shirt Size' })).toBeInTheDocument();
  });

  it('renders grouped t-shirt options by category', () => {
    render(<ProductInfo {...baseProps} />);

    const tshirtSelect = screen.getByRole('combobox', { name: 'T-Shirt Size' });

    expect(within(tshirtSelect).getByRole('group', { name: 'Kids' })).toBeInTheDocument();
    expect(within(tshirtSelect).getByRole('group', { name: 'Adults' })).toBeInTheDocument();

    expect(within(tshirtSelect).getByRole('option', { name: 'Kids Small' })).toHaveValue('kids-s');
    expect(within(tshirtSelect).getByRole('option', { name: 'Adult Small' })).toHaveValue(
      'adult-s'
    );
  });

  it('falls back to Other category when tshirt option category is missing', () => {
    render(
      <ProductInfo
        {...baseProps}
        data={{
          options: {
            ...baseProps.data.options,
            tshirt: [{ label: 'Mystery', value: 'mystery', displayValue: 'Mystery Size' }],
          },
          moreInformation: [],
        }}
      />
    );

    const tshirtSelect = screen.getByRole('combobox', { name: 'T-Shirt Size' });
    expect(within(tshirtSelect).getByRole('group', { name: 'Other' })).toBeInTheDocument();
  });

  it('renders disabled tshirt options', () => {
    render(<ProductInfo {...baseProps} />);

    const tshirtSelect = screen.getByRole('combobox', { name: 'T-Shirt Size' });
    const disabledOption = within(tshirtSelect).getByRole('option', { name: 'Adult Medium' });

    expect(disabledOption).toBeDisabled();
  });

  it('submits the default selected values', async () => {
    const onSubmit = vi.fn();

    render(
      <ProductInfo
        {...baseProps}
        onSubmit={onSubmit}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add to cart' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      color: 'red',
      size: 's',
      image: 'front',
      tshirt: 'kids-s',
    });
  });

  it('submits changed values', async () => {
    const onSubmit = vi.fn();

    render(
      <ProductInfo
        {...baseProps}
        onSubmit={onSubmit}
      />
    );

    const colorSelect = screen.getByRole('combobox', { name: 'Color' });
    const sizeSelect = screen.getByRole('combobox', { name: 'Size' });
    const imageSelect = screen.getByRole('combobox', { name: 'Image' });
    const tshirtSelect = screen.getByRole('combobox', { name: 'T-Shirt Size' });

    fireEvent.change(colorSelect, { target: { value: 'blue' } });
    fireEvent.change(sizeSelect, { target: { value: 'm' } });
    fireEvent.change(imageSelect, { target: { value: 'back' } });
    fireEvent.change(tshirtSelect, { target: { value: 'adult-s' } });

    await waitFor(() => {
      expect(colorSelect).toHaveValue('blue');
      expect(sizeSelect).toHaveValue('m');
      expect(imageSelect).toHaveValue('back');
      expect(tshirtSelect).toHaveValue('adult-s');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Add to cart' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      color: 'blue',
      size: 'm',
      image: 'back',
      tshirt: 'adult-s',
    });
  });

  it('disables the submit button when the item is out of stock', () => {
    render(
      <ProductInfo
        {...baseProps}
        inStock={false}
      />
    );

    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeDisabled();
  });

  it('disables the submit button and changes label while submitting', () => {
    render(
      <ProductInfo
        {...baseProps}
        isSubmitting
      />
    );

    expect(screen.getByRole('button', { name: 'Added to cart' })).toBeDisabled();
  });

  it('renders accordion information sections', () => {
    render(<ProductInfo {...baseProps} />);

    expect(screen.getByTestId('accordion')).toHaveAttribute('data-default-open-ids', 'item-1');
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Returns Policy')).toBeInTheDocument();
    expect(screen.getAllByTestId('accordion-item')).toHaveLength(2);
    expect(screen.getAllByTestId('accordion-panel')).toHaveLength(2);
  });

  it('logs an error and then throws when any required option group is empty', () => {
    expect(() =>
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
      )
    ).toThrow();

    expect(mockLoggerError).toHaveBeenCalledWith(
      'ProductInfo requires at least one option for color, size, image, and tshirt.'
    );
  });

  it('does not log an error when all required option groups have at least one option', () => {
    render(<ProductInfo {...baseProps} />);

    expect(mockLoggerError).not.toHaveBeenCalled();
  });
});
