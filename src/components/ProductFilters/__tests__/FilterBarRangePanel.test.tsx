import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FilterBarRangePanel } from '@/components/ProductFilters/FilterBarRangePanel';
import type {
  FilterRangeValue,
  FilterValue,
  RangeGroup,
} from '@/components/ProductFilters/ProductFilters.types';

const mockUseMessages = vi.fn<
  (namespace: string) => {
    minimumShort: string;
    maximumShort: string;
    minimum: string;
    maximum: string;
  }
>();

const mockClamp = vi.fn<(input: number, min: number, max: number) => number>();

const mockGetRangeValue =
  vi.fn<(value: FilterValue, groupId: string) => FilterRangeValue | undefined>();

const mockSetRangeValue =
  vi.fn<(value: FilterValue, groupId: string, nextRange: FilterRangeValue) => FilterValue>();

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => mockUseMessages(namespace),
}));

vi.mock('@/components/ProductFilters/ProductFilters.utils', () => ({
  clamp: (input: number, min: number, max: number): number => mockClamp(input, min, max),
  getRangeValue: (value: FilterValue, groupId: string): FilterRangeValue | undefined =>
    mockGetRangeValue(value, groupId),
  setRangeValue: (value: FilterValue, groupId: string, nextRange: FilterRangeValue): FilterValue =>
    mockSetRangeValue(value, groupId, nextRange),
}));

vi.mock('@/components/ProductFilters/ProductFilters.module.css', () => ({
  default: {
    rangePanelBody: 'rangePanelBody',
    rangeInputs: 'rangeInputs',
    rangeField: 'rangeField',
    rangeFieldLabel: 'rangeFieldLabel',
    numberInput: 'numberInput',
    dualSlider: 'dualSlider',
    sliderTrack: 'sliderTrack',
    sliderRange: 'sliderRange',
    slider: 'slider',
    rangeSummary: 'rangeSummary',
  },
}));

vi.mock('@/styles/Util.module.css', () => ({
  default: {
    srOnly: 'srOnly',
  },
}));

describe('FilterBarRangePanel', () => {
  const group: RangeGroup = {
    id: 'price',
    label: 'Price',
    kind: 'range',
    min: 0,
    max: 500,
    step: 10,
    minLabel: '£0',
    maxLabel: '£500',
  };

  const value: FilterValue = {
    options: {},
    ranges: {
      price: { min: 50, max: 300 },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseMessages.mockReturnValue({
      minimumShort: 'Min',
      maximumShort: 'Max',
      minimum: 'Minimum',
      maximum: 'Maximum',
    });

    mockGetRangeValue.mockReturnValue({ min: 50, max: 300 });

    mockClamp.mockImplementation((input: number, min: number, max: number) =>
      Math.min(Math.max(input, min), max)
    );

    mockSetRangeValue.mockImplementation(
      (currentValue: FilterValue, groupId: string, nextRange: FilterRangeValue) => ({
        ...currentValue,
        ranges: {
          ...currentValue.ranges,
          [groupId]: nextRange,
        },
      })
    );
  });

  it('renders number inputs and range sliders with current values', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={vi.fn()}
      />
    );

    const spinbuttons = screen.getAllByRole('spinbutton');
    const sliders = screen.getAllByRole('slider');

    expect(spinbuttons).toHaveLength(2);
    expect(spinbuttons[0]).toHaveValue(50);
    expect(spinbuttons[1]).toHaveValue(300);

    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toHaveValue('50');
    expect(sliders[1]).toHaveValue('300');
  });

  it('renders summary labels', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText('£0')).toBeInTheDocument();
    expect(screen.getByText('£500')).toBeInTheDocument();
  });

  it('falls back to generated currency summary labels when custom labels are missing', () => {
    const groupWithoutLabels: RangeGroup = (({ ...rest }) => rest)(group);

    render(
      <FilterBarRangePanel
        baseId="filters"
        group={groupWithoutLabels}
        value={value}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText('£0')).toBeInTheDocument();
    expect(screen.getByText('£500')).toBeInTheDocument();
  });

  it('renders accessible labels for the sliders', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole('slider', { name: 'Minimum Price' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Maximum Price' })).toBeInTheDocument();
  });

  it('uses group step when provided', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={vi.fn()}
      />
    );

    const spinbuttons = screen.getAllByRole('spinbutton');
    const sliders = screen.getAllByRole('slider');

    expect(spinbuttons[0]).toHaveAttribute('step', '10');
    expect(spinbuttons[1]).toHaveAttribute('step', '10');
    expect(sliders[0]).toHaveAttribute('step', '10');
    expect(sliders[1]).toHaveAttribute('step', '10');
  });

  it('defaults step to 1 when omitted', () => {
    const groupWithoutStep: RangeGroup = Object.fromEntries(
      Object.entries(group).filter(([key]) => key !== 'step')
    ) as RangeGroup;

    render(
      <FilterBarRangePanel
        baseId="filters"
        group={groupWithoutStep}
        value={value}
        onChange={vi.fn()}
      />
    );

    const spinbuttons = screen.getAllByRole('spinbutton');
    expect(spinbuttons[0]).toHaveAttribute('step', '1');
    expect(spinbuttons[1]).toHaveAttribute('step', '1');
  });

  it('calls onChange when the minimum number input changes', () => {
    const onChange = vi.fn();

    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChange}
      />
    );

    const spinbuttons = screen.getAllByRole('spinbutton');
    const minInput = spinbuttons[0];
    if (!minInput) {
      throw new Error('Expected minimum input to exist');
    }

    fireEvent.change(minInput, {
      target: { value: '70' },
    });

    expect(mockSetRangeValue).toHaveBeenCalledWith(value, 'price', {
      min: 70,
      max: 300,
    });
    expect(onChange).toHaveBeenCalledWith({
      options: {},
      ranges: {
        price: { min: 70, max: 300 },
      },
    });
  });

  it('calls onChange when the maximum number input changes', () => {
    const onChange = vi.fn();

    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChange}
      />
    );

    const spinbuttons = screen.getAllByRole('spinbutton');
    const maxInput = spinbuttons[1];
    if (!maxInput) {
      throw new Error('Expected maximum input to exist');
    }

    fireEvent.change(maxInput, {
      target: { value: '280' },
    });

    expect(mockSetRangeValue).toHaveBeenCalledWith(value, 'price', {
      min: 50,
      max: 280,
    });
    expect(onChange).toHaveBeenCalledWith({
      options: {},
      ranges: {
        price: { min: 50, max: 280 },
      },
    });
  });

  it('calls onChange when the minimum slider changes', () => {
    const onChange = vi.fn();

    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChange}
      />
    );

    const minSlider = screen.getByRole('slider', { name: 'Minimum Price' });

    fireEvent.change(minSlider, {
      target: { value: '90' },
    });

    expect(mockSetRangeValue).toHaveBeenCalledWith(value, 'price', {
      min: 90,
      max: 300,
    });
    expect(onChange).toHaveBeenCalledWith({
      options: {},
      ranges: {
        price: { min: 90, max: 300 },
      },
    });
  });

  it('calls onChange when the maximum slider changes', () => {
    const onChange = vi.fn();

    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChange}
      />
    );

    const maxSlider = screen.getByRole('slider', { name: 'Maximum Price' });

    fireEvent.change(maxSlider, {
      target: { value: '250' },
    });

    expect(mockSetRangeValue).toHaveBeenCalledWith(value, 'price', {
      min: 50,
      max: 250,
    });
    expect(onChange).toHaveBeenCalledWith({
      options: {},
      ranges: {
        price: { min: 50, max: 250 },
      },
    });
  });

  it('clamps the minimum number input to the group minimum when cleared', () => {
    const onChange = vi.fn();

    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChange}
      />
    );

    const spinbuttons = screen.getAllByRole('spinbutton');
    const minInput = spinbuttons[0];
    if (!minInput) {
      throw new Error('Expected minimum input to exist');
    }

    fireEvent.change(minInput, {
      target: { value: '' },
    });

    expect(mockSetRangeValue).toHaveBeenCalledWith(value, 'price', {
      min: 0,
      max: 300,
    });

    expect(onChange).toHaveBeenCalledWith({
      options: {},
      ranges: {
        price: { min: 0, max: 300 },
      },
    });
  });

  it('clamps the maximum number input to the current minimum when cleared', () => {
    const onChange = vi.fn();

    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChange}
      />
    );

    const spinbuttons = screen.getAllByRole('spinbutton');
    const maxInput = spinbuttons[1];
    if (!maxInput) {
      throw new Error('Expected maximum input to exist');
    }

    fireEvent.change(maxInput, {
      target: { value: '' },
    });

    expect(mockSetRangeValue).toHaveBeenCalledWith(value, 'price', {
      min: 50,
      max: 50,
    });

    expect(onChange).toHaveBeenCalledWith({
      options: {},
      ranges: {
        price: { min: 50, max: 50 },
      },
    });
  });

  it('uses group min and max when no current range value exists', () => {
    mockGetRangeValue.mockReturnValue(undefined);

    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={{
          options: {},
          ranges: {},
        }}
        onChange={vi.fn()}
      />
    );

    const spinbuttons = screen.getAllByRole('spinbutton');
    expect(spinbuttons[0]).toHaveValue(0);
    expect(spinbuttons[1]).toHaveValue(500);
  });

  it('clamps and normalises reversed min and max values', () => {
    mockGetRangeValue.mockReturnValue({ min: 400, max: 100 });

    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={vi.fn()}
      />
    );

    const spinbuttons = screen.getAllByRole('spinbutton');
    expect(spinbuttons[0]).toHaveValue(100);
    expect(spinbuttons[1]).toHaveValue(400);
  });
});
