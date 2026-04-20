import { fireEvent, render, screen, within } from '@testing-library/react';
import type { PropsWithChildren, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FilterBar } from '@/components/ProductFilters/ProductFilters';
import type {
  FilterBarProps,
  FilterGroup,
  FilterValue,
  RangeGroup,
} from '@/components/ProductFilters/ProductFilters.types';

type ProductFiltersMessages = {
  title: string;
  sortBy: string;
  toggle: string;
  reset: string;
  clear: string;
  active: string;
  remove: string;
  minimumValueChip: (value: string) => string;
  maximumValueChip: (value: string) => string;
};

type FormattingValue = {
  locale: string;
  currency: string;
};

type Chip = {
  key: string;
  groupId: string;
  groupLabel: string;
  label: string;
};

type SelectableGroup = Extract<FilterGroup, { kind: 'checkbox' | 'radio' }>;

function omitKey<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const clone = { ...obj };
  delete clone[key];
  return clone;
}

const useMessagesMock = vi.fn<(key: 'productFilters') => ProductFiltersMessages>();
const useFormattingMock = vi.fn<() => FormattingValue>();
const useMediaQueryMock = vi.fn<(query: string) => boolean>();

const buildChipsMock =
  vi.fn<
    (
      groups: readonly FilterGroup[],
      value: FilterValue,
      locale: string,
      currency: string,
      messages: {
        minimumValueChip: (value: string) => string;
        maximumValueChip: (value: string) => string;
      }
    ) => Chip[]
  >();
const clearGroupMock = vi.fn<(value: FilterValue, group: FilterGroup) => FilterValue>();
const getSelectedCountMock = vi.fn<(group: FilterGroup, value: FilterValue) => number>();
const isOptionGroupMock = vi.fn<(group: FilterGroup) => boolean>();
const isRangeGroupMock = vi.fn<(group: FilterGroup) => boolean>();
const setRangeValueMock =
  vi.fn<(value: FilterValue, groupId: string, nextRange: Record<string, never>) => FilterValue>();
const toggleOptionSelectionMock =
  vi.fn<(value: FilterValue, group: SelectableGroup, optionId: string) => FilterValue>();

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (key: 'productFilters') => useMessagesMock(key),
}));

vi.mock('@/lib/i18n/formatting/useFormatting', () => ({
  useFormatting: () => useFormattingMock(),
}));

vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: (query: string) => useMediaQueryMock(query),
}));

vi.mock('@/styles/breakpoints', () => ({
  BREAKPOINTS: {
    UP: {
      MD: '48rem',
    },
  },
}));

vi.mock('@/components/ProductFilters/ProductFilters.utils', () => ({
  buildChips: (
    groups: readonly FilterGroup[],
    value: FilterValue,
    locale: string,
    currency: string,
    messages: {
      minimumValueChip: (value: string) => string;
      maximumValueChip: (value: string) => string;
    }
  ) => buildChipsMock(groups, value, locale, currency, messages),
  clearGroup: (value: FilterValue, group: FilterGroup) => clearGroupMock(value, group),
  getSelectedCount: (group: FilterGroup, value: FilterValue) => getSelectedCountMock(group, value),
  isOptionGroup: (group: FilterGroup) => isOptionGroupMock(group),
  isRangeGroup: (group: FilterGroup) => isRangeGroupMock(group),
  setRangeValue: (value: FilterValue, groupId: string, nextRange: Record<string, never>) =>
    setRangeValueMock(value, groupId, nextRange),
  toggleOptionSelection: (value: FilterValue, group: SelectableGroup, optionId: string) =>
    toggleOptionSelectionMock(value, group, optionId),
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

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    onClick,
    type,
    disabled,
    ...rest
  }: PropsWithChildren<{
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    'aria-label'?: string;
  }>) => (
    <button
      type={type ?? 'button'}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/Form/Select/Select', () => {
  function Select({
    id,
    value,
    onChange,
    children,
  }: {
    id?: string;
    value?: string;
    onChange?: (nextValue: string) => void;
    children: ReactNode;
  }) {
    return (
      <select
        id={id}
        aria-label={typeof id === 'string' && id.endsWith('-sort') ? 'Sort by' : undefined}
        value={value}
        onChange={(event) => onChange?.(event.currentTarget.value)}
      >
        {children}
      </select>
    );
  }

  Select.Option = function Option({ value, children }: { value: string; children: ReactNode }) {
    return <option value={value}>{children}</option>;
  };

  return { Select };
});

vi.mock('@/components/Layout', () => ({
  Stack: ({ children }: { children: ReactNode }) => <div data-testid="stack">{children}</div>,
}));

vi.mock('@/components/ProductFilters/FilterBarOptionPanel', () => ({
  FilterBarOptionPanel: ({
    group,
    onToggle,
  }: {
    baseId: string;
    group: SelectableGroup;
    value: FilterValue;
    onToggle: (optionId: string) => void;
  }) => (
    <div data-testid={`option-panel-${group.id}`}>
      <button
        type="button"
        onClick={() => {
          const firstOption = group.options[0];

          if (firstOption) {
            onToggle(firstOption.id);
          }
        }}
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
    value,
  }: {
    baseId: string;
    group: RangeGroup;
    value: FilterValue;
    onChange: (nextValue: FilterValue) => void;
  }) => (
    <div data-testid={`range-panel-${group.id}`}>
      <button
        type="button"
        onClick={() => onChange(value)}
      >
        Change range
      </button>
    </div>
  ),
}));

describe('FilterBar', () => {
  const onChangeMock = vi.fn<(nextValue: FilterValue) => void>();
  const onClearAllMock = vi.fn<() => void>();
  const onSortChangeMock = vi.fn<(nextValue: string) => void>();

  const priceGroup: RangeGroup = {
    kind: 'range',
    id: 'price',
    label: 'Price',
    min: 0,
    max: 100,
    step: 5,
  };

  const colourGroup: SelectableGroup = {
    kind: 'checkbox',
    id: 'colour',
    label: 'Colour',
    options: [
      {
        id: 'red',
        label: 'Red',
      },
      {
        id: 'blue',
        label: 'Blue',
      },
    ],
  };

  const value: FilterValue = {
    options: {},
    ranges: {},
  };

  const baseProps: FilterBarProps = {
    groups: [priceGroup, colourGroup],
    value,
    onChange: onChangeMock,
    onClearAll: onClearAllMock,
    sortOptions: [
      { label: 'Featured', value: 'featured' },
      { label: 'Price: Low to High', value: 'price-asc' },
    ],
    sortValue: 'featured',
    onSortChange: onSortChangeMock,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    useMessagesMock.mockReturnValue({
      title: 'Filters',
      sortBy: 'Sort by',
      toggle: 'Toggle filters',
      reset: 'Reset',
      clear: 'Clear',
      active: 'Active filters',
      remove: 'Remove',
      minimumValueChip: (value: string) => `${value} and up`,
      maximumValueChip: (value: string) => `Up to ${value}`,
    });

    useFormattingMock.mockReturnValue({
      locale: 'en-GB',
      currency: 'GBP',
    });

    useMediaQueryMock.mockReturnValue(false);

    buildChipsMock.mockReturnValue([]);

    clearGroupMock.mockImplementation((currentValue, group) => ({
      ...currentValue,
      options: {
        ...currentValue.options,
        [group.id]: [],
      },
    }));

    getSelectedCountMock.mockImplementation((group) => (group.id === 'colour' ? 2 : 0));

    isRangeGroupMock.mockImplementation((group) => group.kind === 'range');
    isOptionGroupMock.mockImplementation(
      (group) => group.kind === 'checkbox' || group.kind === 'radio'
    );

    setRangeValueMock.mockImplementation((currentValue, groupId) => ({
      ...currentValue,
      ranges: {
        ...currentValue.ranges,
        [groupId]: {},
      },
    }));

    toggleOptionSelectionMock.mockImplementation((currentValue, group, optionId) => ({
      ...currentValue,
      options: {
        ...currentValue.options,
        [group.id]: [optionId],
      },
    }));
  });

  it('renders the default title as the sidebar toolbar aria-label', () => {
    const { container } = render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    const accordion = screen.getByTestId('accordion');
    const toolbar = accordion.closest('[role="toolbar"]');

    expect(toolbar).not.toBeNull();
    expect(toolbar).toHaveAttribute('aria-label', 'Filters');

    expect(container).toBeTruthy();
  });

  it('uses a custom title when provided', () => {
    render(
      <FilterBar
        {...baseProps}
        title="Shop filters"
      >
        <div>Rendered products</div>
      </FilterBar>
    );

    const accordion = screen.getByTestId('accordion');
    const toolbar = accordion.closest('[role="toolbar"]');

    expect(toolbar).not.toBeNull();
    expect(toolbar).toHaveAttribute('aria-label', 'Shop filters');
  });

  it('renders children content', () => {
    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(screen.getByText('Rendered products')).toBeInTheDocument();
  });

  it('starts collapsed on non-desktop screens', () => {
    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    const accordionWrapper = screen.getByTestId('accordion').parentElement;
    expect(accordionWrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('starts expanded on desktop screens', () => {
    useMediaQueryMock.mockReturnValue(true);

    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    const accordionWrapper = screen.getByTestId('accordion').parentElement;
    expect(accordionWrapper).toHaveAttribute('aria-hidden', 'false');
  });

  it('toggles the collapsed state when the filter toggle button is clicked', () => {
    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    const toggleButton = screen.getByRole('button', { name: 'Toggle filters' });
    const accordionWrapper = screen.getByTestId('accordion').parentElement;

    expect(accordionWrapper).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(toggleButton);
    expect(accordionWrapper).toHaveAttribute('aria-hidden', 'false');

    fireEvent.click(toggleButton);
    expect(accordionWrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the reset button only when there are active chips', () => {
    buildChipsMock.mockReturnValue([
      {
        key: 'chip-1',
        groupId: 'colour',
        groupLabel: 'Colour',
        label: 'Red',
      },
    ]);

    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('does not render the reset button when there are no chips', () => {
    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(screen.queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument();
  });

  it('calls onClearAll when the reset button is clicked', () => {
    buildChipsMock.mockReturnValue([
      {
        key: 'chip-1',
        groupId: 'colour',
        groupLabel: 'Colour',
        label: 'Red',
      },
    ]);

    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onClearAllMock).toHaveBeenCalledTimes(1);
  });

  it('renders the sort control when sort options and onSortChange are provided', () => {
    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Featured')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Price: Low to High' })).toBeInTheDocument();
  });

  it('does not render the sort control when sortOptions is omitted', () => {
    const propsWithoutSortOptions = omitKey(baseProps, 'sortOptions');

    render(
      <FilterBar {...propsWithoutSortOptions}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(screen.queryByLabelText('Sort by')).not.toBeInTheDocument();
  });

  it('does not render the sort control when sortOptions is empty', () => {
    render(
      <FilterBar
        {...baseProps}
        sortOptions={[]}
      >
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(screen.queryByLabelText('Sort by')).not.toBeInTheDocument();
  });

  it('does not render the sort control when onSortChange is omitted', () => {
    const propsWithoutSortChange = omitKey(baseProps, 'onSortChange');

    render(
      <FilterBar {...propsWithoutSortChange}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(screen.queryByLabelText('Sort by')).not.toBeInTheDocument();
  });

  it('renders the sort control when sortValue is omitted', () => {
    const propsWithoutSortValue = omitKey(baseProps, 'sortValue');

    render(
      <FilterBar {...propsWithoutSortValue}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Featured' })).toBeInTheDocument();
  });

  it('calls onSortChange when the sort value changes', () => {
    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    fireEvent.change(screen.getByLabelText('Sort by'), {
      target: { value: 'price-asc' },
    });

    expect(onSortChangeMock).toHaveBeenCalledWith('price-asc');
  });

  it('renders one accordion item per group', () => {
    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    const items = screen.getAllByTestId('accordion-item');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute('data-id', 'price');
    expect(items[1]).toHaveAttribute('data-id', 'colour');
  });

  it('passes the expected default open ids to Accordion', () => {
    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(screen.getByTestId('accordion')).toHaveAttribute('data-default-open-ids', 'price');
  });

  it('renders the range panel for range groups', () => {
    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(screen.getByTestId('range-panel-price')).toBeInTheDocument();
    expect(screen.queryByTestId('option-panel-price')).not.toBeInTheDocument();
  });

  it('renders the option panel for checkbox/radio groups', () => {
    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(screen.getByTestId('option-panel-colour')).toBeInTheDocument();
    expect(screen.queryByTestId('range-panel-colour')).not.toBeInTheDocument();
  });

  it('renders a clear button for groups with selected items', () => {
    useMediaQueryMock.mockReturnValue(true);

    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('does not render a clear button when no groups have selected items', () => {
    useMediaQueryMock.mockReturnValue(true);
    getSelectedCountMock.mockReturnValue(0);

    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('clears a group when its clear button is clicked', () => {
    useMediaQueryMock.mockReturnValue(true);

    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(clearGroupMock).toHaveBeenCalledWith(value, colourGroup);
    expect(onChangeMock).toHaveBeenCalledWith({
      options: {
        colour: [],
      },
      ranges: {},
    });
  });

  it('calls onChange when the range panel changes', () => {
    useMediaQueryMock.mockReturnValue(true);

    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    fireEvent.click(
      within(screen.getByTestId('range-panel-price')).getByRole('button', {
        name: 'Change range',
      })
    );

    expect(onChangeMock).toHaveBeenCalledWith(value);
  });

  it('toggles an option when the option panel requests it', () => {
    useMediaQueryMock.mockReturnValue(true);

    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    fireEvent.click(
      within(screen.getByTestId('option-panel-colour')).getByRole('button', {
        name: 'Toggle option',
      })
    );

    expect(toggleOptionSelectionMock).toHaveBeenCalledWith(value, colourGroup, 'red');
    expect(onChangeMock).toHaveBeenCalledWith({
      options: {
        colour: ['red'],
      },
      ranges: {},
    });
  });

  it('renders the active chips label and chip buttons when chips exist', () => {
    buildChipsMock.mockReturnValue([
      {
        key: 'chip-1',
        groupId: 'price',
        groupLabel: 'Price',
        label: '£10 - £20',
      },
      {
        key: 'chip-2',
        groupId: 'colour',
        groupLabel: 'Colour',
        label: 'Red',
      },
    ]);

    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(screen.getByRole('group', { name: 'Active filters' })).toBeInTheDocument();
    expect(screen.getByText('Active filters:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove £10 - £20' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Red' })).toBeInTheDocument();
  });

  it('does not render the active chips label when there are no chips', () => {
    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(screen.queryByText('Active filters:')).not.toBeInTheDocument();
  });

  it('removes a range chip by clearing its range value', () => {
    buildChipsMock.mockReturnValue([
      {
        key: 'chip-1',
        groupId: 'price',
        groupLabel: 'Price',
        label: '£10 - £20',
      },
    ]);

    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove £10 - £20' }));

    expect(setRangeValueMock).toHaveBeenCalledWith(value, 'price', {});
    expect(onChangeMock).toHaveBeenCalledWith({
      options: {},
      ranges: {
        price: {},
      },
    });
  });

  it('removes an option chip by toggling the matched option', () => {
    buildChipsMock.mockReturnValue([
      {
        key: 'chip-1',
        groupId: 'colour',
        groupLabel: 'Colour',
        label: 'Red',
      },
    ]);

    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove Red' }));

    expect(toggleOptionSelectionMock).toHaveBeenCalledWith(value, colourGroup, 'red');
    expect(onChangeMock).toHaveBeenCalledWith({
      options: {
        colour: ['red'],
      },
      ranges: {},
    });
  });

  it('does nothing when a chip group cannot be found', () => {
    buildChipsMock.mockReturnValue([
      {
        key: 'chip-1',
        groupId: 'missing',
        groupLabel: 'Missing',
        label: 'Ghost',
      },
    ]);

    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove Ghost' }));

    expect(setRangeValueMock).not.toHaveBeenCalled();
    expect(toggleOptionSelectionMock).not.toHaveBeenCalled();
    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('does nothing when an option chip does not match any option in the group', () => {
    buildChipsMock.mockReturnValue([
      {
        key: 'chip-1',
        groupId: 'colour',
        groupLabel: 'Colour',
        label: 'Green',
      },
    ]);

    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove Green' }));

    expect(toggleOptionSelectionMock).not.toHaveBeenCalled();
    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('calls buildChips with groups, value, locale, currency, and chip formatters', () => {
    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(buildChipsMock).toHaveBeenCalledWith(baseProps.groups, value, 'en-GB', 'GBP', {
      minimumValueChip: expect.any(Function),
      maximumValueChip: expect.any(Function),
    });
  });

  it('calls useMediaQuery with the md breakpoint query', () => {
    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(useMediaQueryMock).toHaveBeenCalledWith('(min-width: 48rem)');
  });

  it('requests the expected message namespace', () => {
    render(
      <FilterBar {...baseProps}>
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(useMessagesMock).toHaveBeenCalledWith('productFilters');
  });

  it('applies the provided className alongside the root styling', () => {
    const { container } = render(
      <FilterBar
        {...baseProps}
        className="custom-class"
      >
        <div>Rendered products</div>
      </FilterBar>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
