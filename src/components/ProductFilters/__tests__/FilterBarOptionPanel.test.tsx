import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FilterBarOptionPanel } from '@/components/ProductFilters/FilterBarOptionPanel';
import type {
  CheckboxGroup,
  FilterGroup,
  FilterValue,
  RadioGroup,
} from '@/components/ProductFilters/ProductFilters.types';

const mockUseMessages = vi.fn<(namespace: string) => { noFilters: string }>();

const mockIsOptionSelected =
  vi.fn<(value: FilterValue, groupId: string, optionId: string) => boolean>();

const mockIsRadioGroup = vi.fn<(group: FilterGroup) => boolean>();

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => mockUseMessages(namespace),
}));

vi.mock('@/components/ProductFilters/ProductFilters.utils', () => ({
  isOptionSelected: (value: FilterValue, groupId: string, optionId: string): boolean =>
    mockIsOptionSelected(value, groupId, optionId),
  isRadioGroup: (group: FilterGroup): boolean => mockIsRadioGroup(group),
}));

vi.mock('@/components/Form/Checkbox', () => ({
  Checkbox: ({
    label,
    checked,
    onCheckedChange,
    id,
    name,
    value,
  }: {
    label: string;
    checked?: boolean;
    onCheckedChange?: () => void;
    id?: string;
    name?: string;
    value?: string;
  }) => (
    <input
      id={id}
      aria-label={label}
      type="checkbox"
      name={name}
      value={value}
      checked={checked}
      onChange={() => onCheckedChange?.()}
    />
  ),
}));

vi.mock('@/components/Form/Radio', () => ({
  Radio: ({
    label,
    checked,
    onCheckedChange,
    name,
    value,
  }: {
    label: string;
    checked?: boolean;
    onCheckedChange?: () => void;
    name?: string;
    value?: string;
  }) => (
    <input
      aria-label={label}
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={() => onCheckedChange?.()}
    />
  ),
}));

vi.mock('@/components/Layout', () => ({
  Stack: ({ children }: { children: ReactNode; gap?: string }) => (
    <div data-testid="stack">{children}</div>
  ),
}));

vi.mock('@/components/ProductFilters/ProductFilters.module.css', () => ({
  default: {
    fieldset: 'fieldset',
    optionList: 'optionList',
    optionRow: 'optionRow',
    optionRowDisabled: 'optionRowDisabled',
    optionCount: 'optionCount',
    emptyState: 'emptyState',
  },
}));

vi.mock('@/styles/Util.module.css', () => ({
  default: {
    srOnly: 'srOnly',
  },
}));

describe('FilterBarOptionPanel', () => {
  const checkboxGroup: CheckboxGroup = {
    id: 'colour',
    label: 'Colour',
    kind: 'checkbox',
    options: [
      { id: 'red', label: 'Red', count: 12 },
      { id: 'blue', label: 'Blue', count: 4 },
    ],
  };

  const radioGroup: RadioGroup = {
    id: 'size',
    label: 'Size',
    kind: 'radio',
    options: [
      { id: 's', label: 'Small' },
      { id: 'm', label: 'Medium' },
    ],
  };

  const checkboxValue: FilterValue = {
    options: {
      colour: ['red'],
    },
    ranges: {},
  };

  const radioValue: FilterValue = {
    options: {
      size: ['s'],
    },
    ranges: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseMessages.mockReturnValue({
      noFilters: 'No filters available',
    });

    mockIsOptionSelected.mockImplementation(
      (value: FilterValue, groupId: string, optionId: string) =>
        (value.options[groupId] ?? []).includes(optionId)
    );

    mockIsRadioGroup.mockImplementation((group: FilterGroup) => group.kind === 'radio');
  });

  it('renders checkbox options for non-radio groups', () => {
    render(
      <FilterBarOptionPanel
        baseId="filters"
        group={checkboxGroup}
        value={checkboxValue}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByRole('checkbox', { name: 'Red' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Blue' })).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('renders radio options for radio groups', () => {
    render(
      <FilterBarOptionPanel
        baseId="filters"
        group={radioGroup}
        value={radioValue}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByRole('radio', { name: 'Small' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Medium' })).toBeInTheDocument();
  });

  it('uses isOptionSelected to determine checked state', () => {
    render(
      <FilterBarOptionPanel
        baseId="filters"
        group={checkboxGroup}
        value={checkboxValue}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByRole('checkbox', { name: 'Red' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Blue' })).not.toBeChecked();
  });

  it('calls onToggle when a checkbox option changes', () => {
    const onToggle = vi.fn();

    render(
      <FilterBarOptionPanel
        baseId="filters"
        group={checkboxGroup}
        value={checkboxValue}
        onToggle={onToggle}
      />
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Red' }));
    expect(onToggle).toHaveBeenCalledWith('red');
  });

  it('calls onToggle when a radio option changes', () => {
    const onToggle = vi.fn();

    render(
      <FilterBarOptionPanel
        baseId="filters"
        group={radioGroup}
        value={radioValue}
        onToggle={onToggle}
      />
    );

    fireEvent.click(screen.getByRole('radio', { name: 'Medium' }));
    expect(onToggle).toHaveBeenCalledWith('m');
  });

  it('applies the disabled row class for disabled options', () => {
    const disabledGroup: CheckboxGroup = {
      id: 'colour',
      label: 'Colour',
      kind: 'checkbox',
      options: [{ id: 'red', label: 'Red', disabled: true }],
    };

    const { container } = render(
      <FilterBarOptionPanel
        baseId="filters"
        group={disabledGroup}
        value={checkboxValue}
        onToggle={vi.fn()}
      />
    );

    expect(container.querySelector('.optionRow')).toHaveClass('optionRowDisabled');
  });

  it('does not render a count when count is not a number', () => {
    const groupWithoutCount: CheckboxGroup = {
      id: 'colour',
      label: 'Colour',
      kind: 'checkbox',
      options: [{ id: 'red', label: 'Red' }],
    };

    render(
      <FilterBarOptionPanel
        baseId="filters"
        group={groupWithoutCount}
        value={checkboxValue}
        onToggle={vi.fn()}
      />
    );

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('renders the empty state when there are no options', () => {
    const emptyGroup: CheckboxGroup = {
      id: 'colour',
      label: 'Colour',
      kind: 'checkbox',
      options: [],
    };

    render(
      <FilterBarOptionPanel
        baseId="filters"
        group={emptyGroup}
        value={checkboxValue}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText('No filters available')).toBeInTheDocument();
  });
});
