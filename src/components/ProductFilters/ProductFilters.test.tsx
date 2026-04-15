import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FilterBar } from '@/components/ProductFilters/ProductFilters';
import type {
  ActiveChip,
  CheckboxGroup,
  FilterBarProps,
  FilterGroup,
  FilterValue,
  RangeGroup,
  SortOption,
} from '@/components/ProductFilters/ProductFilters.types';

const mockUseMessages = vi.fn<
  (namespace: string) => {
    title: string;
    sortBy: string;
    toggle: string;
    reset: string;
    clear: string;
    active: string;
    remove: string;
  }
>();

const mockUseMediaQuery = vi.fn<(query: string) => boolean>();

const mockBuildChips =
  vi.fn<(groups: readonly FilterGroup[], value: FilterValue) => ActiveChip[]>();
const mockGetSelectedCount = vi.fn<(group: FilterGroup, value: FilterValue) => number>();
const mockIsOptionGroup = vi.fn<(group: FilterGroup) => boolean>();
const mockIsRangeGroup = vi.fn<(group: FilterGroup) => boolean>();
const mockToggleOptionSelection =
  vi.fn<(value: FilterValue, group: CheckboxGroup, optionId: string) => FilterValue>();
const mockClearGroup = vi.fn<(value: FilterValue, group: FilterGroup) => FilterValue>();
const mockSetRangeValue =
  vi.fn<(value: FilterValue, groupId: string, nextRange: Record<string, never>) => FilterValue>();

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => mockUseMessages(namespace),
}));

vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: (query: string) => mockUseMediaQuery(query),
}));

vi.mock('@/styles/breakpoints', () => ({
  BREAKPOINTS: {
    UP: {
      MD: '48rem',
    },
  },
}));

vi.mock('@/components/ProductFilters/ProductFilters.utils', () => ({
  buildChips: (groups: readonly FilterGroup[], value: FilterValue): ActiveChip[] =>
    mockBuildChips(groups, value),
  clearGroup: (value: FilterValue, group: FilterGroup): FilterValue => mockClearGroup(value, group),
  getSelectedCount: (group: FilterGroup, value: FilterValue): number =>
    mockGetSelectedCount(group, value),
  isOptionGroup: (group: FilterGroup): boolean => mockIsOptionGroup(group),
  isRangeGroup: (group: FilterGroup): boolean => mockIsRangeGroup(group),
  setRangeValue: (
    value: FilterValue,
    groupId: string,
    nextRange: Record<string, never>
  ): FilterValue => mockSetRangeValue(value, groupId, nextRange),
  toggleOptionSelection: (
    value: FilterValue,
    group: CheckboxGroup,
    optionId: string
  ): FilterValue => mockToggleOptionSelection(value, group, optionId),
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
    <div data-testid="accordion-header">{children}</div>
  ),
  AccordionPanel: ({ children }: { children: ReactNode }) => (
    <div data-testid="accordion-panel">{children}</div>
  ),
}));

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
    size,
    variant,
    icon,
    'aria-label': ariaLabel,
  }: {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    size?: string;
    variant?: string;
    icon?: string;
    'aria-label'?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-size={size}
      data-variant={variant}
      data-icon={icon}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/Form/Select/Select', () => {
  function SelectOption({ children, value }: Readonly<{ children: ReactNode; value: string }>) {
    return <option value={value}>{children}</option>;
  }

  SelectOption.displayName = 'Select.Option';

  function Select({
    children,
    id,
    value,
    onChange,
  }: Readonly<{
    children: ReactNode;
    id?: string;
    value?: string;
    onChange?: (value: string) => void;
  }>) {
    return (
      <select
        id={id}
        aria-label="Sort select"
        value={value}
        onChange={(event) => onChange?.(event.currentTarget.value)}
      >
        {children}
      </select>
    );
  }

  Select.displayName = 'Select';
  Select.Option = SelectOption;

  return { Select };
});

vi.mock('@/components/Layout', () => ({
  Stack: ({ children }: { children: ReactNode }) => <div data-testid="stack">{children}</div>,
}));

vi.mock('@/components/Loading', () => ({
  Spinner: () => <div data-testid="spinner">Loading</div>,
}));

vi.mock('@/components/ProductFilters/FilterBarOptionPanel', () => ({
  FilterBarOptionPanel: ({
    group,
    onToggle,
  }: {
    group: CheckboxGroup;
    onToggle: (optionId: string) => void;
  }) => (
    <div data-testid="option-panel">
      <span>{group.label} options</span>
      <button
        type="button"
        onClick={() => onToggle('red')}
      >
        Toggle option
      </button>
    </div>
  ),
}));

vi.mock('@/components/ProductFilters/FilterBarRangePanel', () => ({
  FilterBarRangePanel: ({
    group,
    onChange,
  }: {
    group: RangeGroup;
    onChange: (value: FilterValue) => void;
  }) => (
    <div data-testid="range-panel">
      <span>{group.label} range</span>
      <button
        type="button"
        onClick={() =>
          onChange({
            options: {},
            ranges: { price: { min: 20, max: 80 } },
          })
        }
      >
        Change range
      </button>
    </div>
  ),
}));

vi.mock('@/components/ProductFilters/ProductFilters.module.css', () => ({
  default: {
    root: 'root',
    topRow: 'topRow',
    titleWrapper: 'titleWrapper',
    filterToggle: 'filterToggle',
    globalActions: 'globalActions',
    sortControl: 'sortControl',
    sortLabel: 'sortLabel',
    layout: 'layout',
    sidebar: 'sidebar',
    accordion: 'accordion',
    groupLabel: 'groupLabel',
    panelActions: 'panelActions',
    panelTextButton: 'panelTextButton',
    content: 'content',
    chips: 'chips',
    chipLabel: 'chipLabel',
    chipGroup: 'chipGroup',
    items: 'items',
    spinnerWrapper: 'spinnerWrapper',
  },
}));

describe('FilterBar', () => {
  const priceGroup: RangeGroup = {
    id: 'price',
    label: 'Price',
    kind: 'range',
    min: 0,
    max: 500,
  };

  const colourGroup: CheckboxGroup = {
    id: 'colour',
    label: 'Colour',
    kind: 'checkbox',
    options: [{ id: 'red', label: 'Red' }],
  };

  const groups: readonly FilterGroup[] = [priceGroup, colourGroup];

  const value: FilterValue = {
    options: {
      colour: ['red'],
    },
    ranges: {
      price: { min: 10, max: 100 },
    },
  };

  const sortOptions: readonly SortOption[] = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price', value: 'price' },
  ];

  function renderFilterBar(
    props?: Partial<FilterBarProps> & {
      children?: ReactNode;
    }
  ) {
    const filterBarProps: FilterBarProps = {
      groups: props?.groups ?? groups,
      value: props?.value ?? value,
      onChange: props?.onChange ?? vi.fn(),
      ...(props?.onClearAll ? { onClearAll: props.onClearAll } : {}),
      ...(props?.title === undefined ? {} : { title: props.title }),
      ...(props?.className === undefined ? {} : { className: props.className }),
      ...(props?.sortLabel === undefined ? {} : { sortLabel: props.sortLabel }),
      ...(props?.sortOptions === undefined ? {} : { sortOptions: props.sortOptions }),
      ...(props?.sortValue === undefined ? {} : { sortValue: props.sortValue }),
      ...(props?.onSortChange === undefined ? {} : { onSortChange: props.onSortChange }),
      ...(props?.loading === undefined ? {} : { loading: props.loading }),
    };

    return render(
      <FilterBar {...filterBarProps}>{props?.children ?? <div>Products</div>}</FilterBar>
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseMessages.mockReturnValue({
      title: 'Filters',
      sortBy: 'Sort by',
      toggle: 'Toggle filters',
      reset: 'Reset all',
      clear: 'Clear',
      active: 'Active filters',
      remove: 'Remove',
    });

    mockUseMediaQuery.mockReturnValue(true);

    mockBuildChips.mockReturnValue([]);
    mockGetSelectedCount.mockImplementation((group: FilterGroup) => (group.id === 'price' ? 1 : 0));
    mockIsRangeGroup.mockImplementation((group: FilterGroup) => group.kind === 'range');
    mockIsOptionGroup.mockImplementation((group: FilterGroup) => group.kind !== 'range');

    mockToggleOptionSelection.mockReturnValue({
      options: { colour: [] },
      ranges: { price: { min: 10, max: 100 } },
    });

    mockClearGroup.mockReturnValue({
      options: { colour: [] },
      ranges: { price: {} },
    });

    mockSetRangeValue.mockReturnValue({
      options: { colour: ['red'] },
      ranges: { price: {} },
    });
  });

  it('renders the default translated title as the toolbar label', () => {
    renderFilterBar();

    expect(mockUseMessages).toHaveBeenCalledWith('productFilters');
    expect(mockUseMediaQuery).toHaveBeenCalledWith('(min-width: 48rem)');
    expect(screen.getByRole('toolbar', { name: 'Filters' })).toBeInTheDocument();
  });

  it('renders a custom title as the toolbar label', () => {
    renderFilterBar({ title: 'Product filters' });

    expect(screen.getByRole('toolbar', { name: 'Product filters' })).toBeInTheDocument();
  });

  it('renders the filter toggle button and toggles collapsed state', () => {
    const { container } = renderFilterBar();

    const root = container.querySelector('.root');
    const accordion = container.querySelector('.accordion');

    expect(root).toHaveAttribute('data-hide-sidebar', 'false');
    expect(accordion).toHaveAttribute('aria-hidden', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Toggle filters' }));

    expect(root).toHaveAttribute('data-hide-sidebar', 'true');
    expect(accordion).toHaveAttribute('aria-hidden', 'true');
  });

  it('starts collapsed on mobile', () => {
    mockUseMediaQuery.mockReturnValue(false);

    const { container } = renderFilterBar();

    const root = container.querySelector('.root');
    expect(root).toHaveAttribute('data-hide-sidebar', 'true');
  });

  it('renders the reset button when chips exist and calls onClearAll', () => {
    const onClearAll = vi.fn();
    mockBuildChips.mockReturnValue([
      { key: 'c1', groupId: 'colour', groupLabel: 'Colour', label: 'Red' },
    ]);

    renderFilterBar({ onClearAll });

    fireEvent.click(screen.getByRole('button', { name: 'Reset all' }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it('does not render the reset button when there are no chips', () => {
    mockBuildChips.mockReturnValue([]);

    renderFilterBar();

    expect(screen.queryByRole('button', { name: 'Reset all' })).not.toBeInTheDocument();
  });

  it('renders sort controls when sort options and handler are provided', () => {
    const onSortChange = vi.fn();

    renderFilterBar({
      sortOptions,
      sortValue: 'featured',
      onSortChange,
    });

    expect(screen.getByText('Sort by')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Sort select'), {
      target: { value: 'price' },
    });

    expect(onSortChange).toHaveBeenCalledWith('price');
  });

  it('does not render sort controls without sort options or handler', () => {
    renderFilterBar();

    expect(screen.queryByText('Sort by')).not.toBeInTheDocument();
  });

  it('renders range and option panels according to group type', () => {
    renderFilterBar();

    expect(screen.getByText('Price range')).toBeInTheDocument();
    expect(screen.getByText('Colour options')).toBeInTheDocument();
    expect(screen.getByTestId('range-panel')).toBeInTheDocument();
    expect(screen.getByTestId('option-panel')).toBeInTheDocument();
  });

  it('calls onChange with toggleOptionSelection result from option panel', () => {
    const onChange = vi.fn();

    renderFilterBar({ onChange });

    fireEvent.click(screen.getByRole('button', { name: 'Toggle option' }));

    expect(mockToggleOptionSelection).toHaveBeenCalledWith(
      value,
      expect.objectContaining({ id: 'colour' }),
      'red'
    );
    expect(onChange).toHaveBeenCalledWith({
      options: { colour: [] },
      ranges: { price: { min: 10, max: 100 } },
    });
  });

  it('passes range panel changes through onChange', () => {
    const onChange = vi.fn();

    renderFilterBar({ onChange });

    fireEvent.click(screen.getByRole('button', { name: 'Change range' }));

    expect(onChange).toHaveBeenCalledWith({
      options: {},
      ranges: { price: { min: 20, max: 80 } },
    });
  });

  it('renders a clear button for groups with selected items and clears the group', () => {
    const onChange = vi.fn();

    renderFilterBar({ onChange });

    const clearButtons = screen.getAllByRole('button', { name: 'Clear' });
    const firstClearButton = clearButtons[0];
    if (!firstClearButton) {
      throw new Error('Expected at least one clear button');
    }

    fireEvent.click(firstClearButton);

    expect(mockClearGroup).toHaveBeenCalledWith(value, expect.objectContaining({ id: 'price' }));
    expect(onChange).toHaveBeenCalledWith({
      options: { colour: [] },
      ranges: { price: {} },
    });
  });

  it('does not render a group clear button when selected count is zero', () => {
    mockGetSelectedCount.mockReturnValue(0);

    renderFilterBar();

    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('renders active chips and removes an option chip when clicked', () => {
    const onChange = vi.fn();

    mockBuildChips.mockReturnValue([
      {
        key: 'chip-1',
        groupId: 'colour',
        groupLabel: 'Colour',
        label: 'Red',
      },
    ]);

    renderFilterBar({ onChange });

    const chipButton = screen.getByRole('button', { name: 'Remove Red' });
    expect(screen.getByText('Active filters:')).toBeInTheDocument();
    expect(screen.getByText('Colour:')).toBeInTheDocument();

    fireEvent.click(chipButton);

    expect(mockToggleOptionSelection).toHaveBeenCalledWith(
      value,
      expect.objectContaining({ id: 'colour' }),
      'red'
    );
    expect(onChange).toHaveBeenCalledWith({
      options: { colour: [] },
      ranges: { price: { min: 10, max: 100 } },
    });
  });

  it('clears a range chip when clicked', () => {
    const onChange = vi.fn();

    mockBuildChips.mockReturnValue([
      {
        key: 'chip-1',
        groupId: 'price',
        groupLabel: 'Price',
        label: '£10 - £100',
      },
    ]);

    renderFilterBar({ onChange });

    fireEvent.click(screen.getByRole('button', { name: 'Remove £10 - £100' }));

    expect(mockSetRangeValue).toHaveBeenCalledWith(value, 'price', {});
    expect(onChange).toHaveBeenCalledWith({
      options: { colour: ['red'] },
      ranges: { price: {} },
    });
  });

  it('does nothing when chip group cannot be found', () => {
    const onChange = vi.fn();

    mockBuildChips.mockReturnValue([
      {
        key: 'chip-1',
        groupId: 'missing',
        groupLabel: 'Missing',
        label: 'Ghost',
      },
    ]);

    renderFilterBar({ onChange });

    fireEvent.click(screen.getByRole('button', { name: 'Remove Ghost' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('does nothing when an option chip label does not match a group option', () => {
    const onChange = vi.fn();

    mockBuildChips.mockReturnValue([
      {
        key: 'chip-1',
        groupId: 'colour',
        groupLabel: 'Colour',
        label: 'Purple',
      },
    ]);

    renderFilterBar({ onChange });

    fireEvent.click(screen.getByRole('button', { name: 'Remove Purple' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders a spinner when loading is true', () => {
    renderFilterBar({ loading: true });

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByText('Products')).not.toBeInTheDocument();
  });

  it('renders children when loading is false', () => {
    renderFilterBar();

    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
  });

  it('passes className to the root element', () => {
    const { container } = renderFilterBar({ className: 'custom-root' });

    expect(container.querySelector('.root')).toHaveClass('custom-root');
  });
});
