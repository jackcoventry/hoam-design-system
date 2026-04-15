import { type ReactElement, useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { FilterBar } from './ProductFilters';
import type { FilterGroup, FilterValue } from './ProductFilters.types';

const groups: FilterGroup[] = [
  {
    id: 'roast',
    label: 'Roast',
    kind: 'checkbox',
    options: [
      { id: 'light', label: 'Light', count: 12 },
      { id: 'medium', label: 'Medium', count: 18 },
      { id: 'dark', label: 'Dark', count: 9 },
    ],
  },
  {
    id: 'origin',
    label: 'Origin',
    kind: 'checkbox',
    searchable: true,
    searchPlaceholder: 'Search origin',
    options: [
      { id: 'ethiopia', label: 'Ethiopia', count: 6 },
      { id: 'colombia', label: 'Colombia', count: 11 },
      { id: 'brazil', label: 'Brazil', count: 8 },
    ],
  },
  {
    id: 'availability',
    label: 'Availability',
    kind: 'radio',
    options: [
      { id: 'all', label: 'All' },
      { id: 'in-stock', label: 'In stock only' },
    ],
  },
  {
    id: 'price',
    label: 'Price',
    kind: 'range',
    min: 5,
    max: 40,
    step: 1,
    minLabel: '£5',
    maxLabel: '£40',
  },
];

const initialValue: FilterValue = {
  options: {
    roast: [],
    origin: [],
    availability: ['all'],
  },
  ranges: {
    price: {},
  },
};

type TestHarnessProps = {
  initial?: FilterValue;
  onApply?: (value: FilterValue) => void;
  onClearAll?: () => void;
  onSortChange?: (nextSortValue: string) => void;
};

function TestHarness({
  initial = initialValue,
  onApply = vi.fn(),
  onClearAll = vi.fn(),
  onSortChange = vi.fn(),
}: Readonly<TestHarnessProps>): ReactElement {
  const [value, setValue] = useState<FilterValue>(initial);
  const [sortValue, setSortValue] = useState<string>('featured');

  return (
    <FilterBar
      title="Filter coffee"
      groups={groups}
      value={value}
      onChange={setValue}
      onApply={onApply}
      onClearAll={() => {
        setValue(initialValue);
        onClearAll();
      }}
      sortOptions={[
        { value: 'featured', label: 'Featured' },
        { value: 'price-low-high', label: 'Price: Low to high' },
      ]}
      sortValue={sortValue}
      onSortChange={(nextSortValue) => {
        setSortValue(nextSortValue);
        onSortChange(nextSortValue);
      }}
    />
  );
}

describe('FilterBar', () => {
  it('renders the title, sort control, and filter triggers', () => {
    render(<TestHarness />);

    expect(screen.getByRole('heading', { name: 'Filter coffee' })).toBeInTheDocument();

    expect(screen.getByLabelText('Sort by')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /roast/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /origin/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /availability/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /price/i })).toBeInTheDocument();
  });

  it('opens and closes an option panel via the trigger', async () => {
    const user = userEvent.setup();

    render(<TestHarness />);

    const roastTrigger = screen.getByRole('button', { name: /roast/i });

    await user.click(roastTrigger);

    expect(screen.getByRole('dialog', { name: 'Roast' })).toBeInTheDocument();
    expect(screen.getByLabelText('Light')).toBeInTheDocument();

    await user.click(roastTrigger);

    expect(screen.queryByRole('dialog', { name: 'Roast' })).not.toBeInTheDocument();
  });

  it('closes a panel on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();

    render(<TestHarness />);

    const originTrigger = screen.getByRole('button', { name: /origin/i });

    await user.click(originTrigger);
    expect(screen.getByRole('dialog', { name: 'Origin' })).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog', { name: 'Origin' })).not.toBeInTheDocument();
    expect(originTrigger).toHaveFocus();
  });

  it('selects and deselects checkbox options', async () => {
    const user = userEvent.setup();

    render(<TestHarness />);

    await user.click(screen.getByRole('button', { name: /roast/i }));

    const lightCheckbox = screen.getByLabelText('Light');
    const mediumCheckbox = screen.getByLabelText('Medium');

    expect(lightCheckbox).not.toBeChecked();
    expect(mediumCheckbox).not.toBeChecked();

    await user.click(lightCheckbox);
    expect(lightCheckbox).toBeChecked();

    await user.click(mediumCheckbox);
    expect(mediumCheckbox).toBeChecked();

    await user.click(lightCheckbox);
    expect(lightCheckbox).not.toBeChecked();
  });

  it('switches radio selections correctly', async () => {
    const user = userEvent.setup();

    render(<TestHarness />);

    await user.click(screen.getByRole('button', { name: /availability/i }));

    const allRadio = screen.getByLabelText('All');
    const inStockRadio = screen.getByLabelText('In stock only');

    expect(allRadio).toBeChecked();
    expect(inStockRadio).not.toBeChecked();

    await user.click(inStockRadio);

    expect(inStockRadio).toBeChecked();
    expect(allRadio).not.toBeChecked();
  });

  it('filters searchable options as the user types', async () => {
    const user = userEvent.setup();

    render(<TestHarness />);

    await user.click(screen.getByRole('button', { name: /origin/i }));

    const searchInput = screen.getByPlaceholderText('Search origin');

    await user.type(searchInput, 'eth');

    expect(screen.getByLabelText('Ethiopia')).toBeInTheDocument();
    expect(screen.queryByLabelText('Colombia')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Brazil')).not.toBeInTheDocument();
  });

  it('changes the sort dropdown', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();

    render(<TestHarness onSortChange={onSortChange} />);

    await user.selectOptions(screen.getByLabelText('Sort by'), 'price-low-high');

    expect(onSortChange).toHaveBeenCalledWith('price-low-high');
    expect(screen.getByLabelText('Sort by')).toHaveValue('price-low-high');
  });

  it('updates the range inputs', async () => {
    const user = userEvent.setup();

    render(<TestHarness />);

    await user.click(screen.getByRole('button', { name: /price/i }));

    const minInput = screen.getByLabelText('Min');
    const maxInput = screen.getByLabelText('Max');

    expect(minInput).toHaveValue(5);
    expect(maxInput).toHaveValue(40);

    await user.clear(minInput);
    await user.type(minInput, '10');

    await user.clear(maxInput);
    await user.type(maxInput, '25');

    expect(minInput).toHaveValue(10);
    expect(maxInput).toHaveValue(25);

    expect(screen.getByText('Selected: £10 – £25')).toBeInTheDocument();
  });

  it('renders active chips when filters are selected and removes them when clicked', async () => {
    const user = userEvent.setup();

    render(<TestHarness />);

    await user.click(screen.getByRole('button', { name: /roast/i }));
    await user.click(screen.getByLabelText('Medium'));

    const chip = screen.getByRole('button', {
      name: 'Remove Medium from Roast',
    });

    expect(chip).toBeInTheDocument();

    await user.click(chip);

    await user.click(screen.getByRole('button', { name: /roast/i }));
    expect(screen.getByLabelText('Medium')).not.toBeChecked();
  });

  it('clears a single group from inside the panel', async () => {
    const user = userEvent.setup();

    render(<TestHarness />);

    await user.click(screen.getByRole('button', { name: /roast/i }));
    await user.click(screen.getByLabelText('Light'));
    await user.click(screen.getByLabelText('Dark'));

    expect(screen.getByRole('button', { name: 'Remove Light from Roast' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Dark from Roast' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(
      screen.queryByRole('button', { name: 'Remove Light from Roast' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Remove Dark from Roast' })
    ).not.toBeInTheDocument();
  });

  it('calls onClearAll when the global clear button is pressed', async () => {
    const user = userEvent.setup();
    const onClearAll = vi.fn();

    render(<TestHarness onClearAll={onClearAll} />);

    await user.click(screen.getByRole('button', { name: 'Clear all' }));

    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it('calls onApply with the current filter value', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();

    render(<TestHarness onApply={onApply} />);

    await user.click(screen.getByRole('button', { name: /roast/i }));
    await user.click(screen.getByLabelText('Dark'));

    await user.click(screen.getByRole('button', { name: 'Apply filters' }));

    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onApply).toHaveBeenCalledWith({
      options: {
        roast: ['dark'],
        origin: [],
        availability: ['all'],
      },
      ranges: {
        price: {},
      },
    });
  });

  it('closes an open panel when clicking outside', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button type="button">Outside</button>
        <TestHarness />
      </div>
    );

    await user.click(screen.getByRole('button', { name: /origin/i }));
    expect(screen.getByRole('dialog', { name: 'Origin' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside' }));

    expect(screen.queryByRole('dialog', { name: 'Origin' })).not.toBeInTheDocument();
  });

  it('shows the selected count on a trigger when filters are active', async () => {
    const user = userEvent.setup();

    render(<TestHarness />);

    const roastTrigger = screen.getByRole('button', { name: /roast/i });

    await user.click(roastTrigger);
    await user.click(screen.getByLabelText('Light'));
    await user.click(screen.getByLabelText('Medium'));

    expect(within(roastTrigger).getByText('2')).toBeInTheDocument();
  });
});
