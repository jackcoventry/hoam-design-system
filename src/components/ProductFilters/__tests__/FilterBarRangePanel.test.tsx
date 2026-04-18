import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FilterBarRangePanel } from '@/components/ProductFilters/FilterBarRangePanel';
import type { FilterValue, RangeGroup } from '@/components/ProductFilters/ProductFilters.types';

type ProductFiltersMessages = {
  minimumShort: string;
  maximumShort: string;
  minimum: string;
  maximum: string;
};

type RangeValue = {
  min?: number;
  max?: number;
};

const useMessagesMock = vi.fn<(key: 'productFilters') => ProductFiltersMessages>();

const clampMock = vi.fn<(value: number, min: number, max: number) => number>();
const getRangeValueMock = vi.fn<(value: FilterValue, groupId: string) => RangeValue | undefined>();
const setRangeValueMock =
  vi.fn<
    (value: FilterValue, groupId: string, nextRange: { min: number; max: number }) => FilterValue
  >();

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (key: 'productFilters') => useMessagesMock(key),
}));

vi.mock('@/components/ProductFilters/ProductFilters.utils', () => ({
  clamp: (value: number, min: number, max: number) => clampMock(value, min, max),
  getRangeValue: (value: FilterValue, groupId: string) => getRangeValueMock(value, groupId),
  setRangeValue: (value: FilterValue, groupId: string, nextRange: { min: number; max: number }) =>
    setRangeValueMock(value, groupId, nextRange),
}));

describe('FilterBarRangePanel', () => {
  const onChangeMock = vi.fn<(nextValue: FilterValue) => void>();

  const group: RangeGroup = {
    kind: 'range',
    id: 'price',
    label: 'Price',
    min: 0,
    max: 100,
    step: 5,
  };

  const value: FilterValue = {
    options: {},
    ranges: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();

    useMessagesMock.mockReturnValue({
      minimumShort: 'Min',
      maximumShort: 'Max',
      minimum: 'Minimum',
      maximum: 'Maximum',
    });

    clampMock.mockImplementation((valueToClamp, min, max) =>
      Math.min(Math.max(valueToClamp, min), max)
    );

    getRangeValueMock.mockReturnValue({
      min: 20,
      max: 80,
    });

    setRangeValueMock.mockImplementation((currentValue, groupId, nextRange) => ({
      ...currentValue,
      ranges: {
        ...currentValue.ranges,
        [groupId]: nextRange,
      },
    }));
  });

  it('renders number inputs and sliders with the current clamped values', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    expect(screen.getByRole('spinbutton', { name: 'Min' })).toHaveValue(20);
    expect(screen.getByRole('spinbutton', { name: 'Max' })).toHaveValue(80);

    expect(screen.getByRole('slider', { name: 'Minimum Price' })).toHaveValue('20');
    expect(screen.getByRole('slider', { name: 'Maximum Price' })).toHaveValue('80');
  });

  it('uses the group min and max when no current range value exists', () => {
    getRangeValueMock.mockReturnValue(undefined);

    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    expect(screen.getByRole('spinbutton', { name: 'Min' })).toHaveValue(0);
    expect(screen.getByRole('spinbutton', { name: 'Max' })).toHaveValue(100);
    expect(screen.getByRole('slider', { name: 'Minimum Price' })).toHaveValue('0');
    expect(screen.getByRole('slider', { name: 'Maximum Price' })).toHaveValue('100');
  });

  it('uses the default step of 1 when group.step is not provided', () => {
    const groupWithoutStep: RangeGroup = { ...group };
    delete (groupWithoutStep as Partial<RangeGroup>).step;

    render(
      <FilterBarRangePanel
        baseId="filters"
        group={groupWithoutStep}
        value={value}
        onChange={onChangeMock}
      />
    );

    expect(screen.getByRole('spinbutton', { name: 'Min' })).toHaveAttribute('step', '1');
    expect(screen.getByRole('spinbutton', { name: 'Max' })).toHaveAttribute('step', '1');
    expect(screen.getByRole('slider', { name: 'Minimum Price' })).toHaveAttribute('step', '1');
    expect(screen.getByRole('slider', { name: 'Maximum Price' })).toHaveAttribute('step', '1');
  });

  it('clamps and normalises reversed current values before rendering', () => {
    getRangeValueMock.mockReturnValue({
      min: 90,
      max: 10,
    });

    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    expect(screen.getByRole('spinbutton', { name: 'Min' })).toHaveValue(10);
    expect(screen.getByRole('spinbutton', { name: 'Max' })).toHaveValue(90);
  });

  it('clamps out-of-bounds current values before rendering', () => {
    getRangeValueMock.mockReturnValue({
      min: -25,
      max: 125,
    });

    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    expect(screen.getByRole('spinbutton', { name: 'Min' })).toHaveValue(0);
    expect(screen.getByRole('spinbutton', { name: 'Max' })).toHaveValue(100);
  });

  it('renders slider ids using the baseId and group id', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    expect(screen.getByRole('slider', { name: 'Minimum Price' })).toHaveAttribute(
      'id',
      'filters-price-min'
    );
    expect(screen.getByRole('slider', { name: 'Maximum Price' })).toHaveAttribute(
      'id',
      'filters-price-max'
    );
  });

  it('updates the minimum value from the number input', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Min' }), {
      target: { value: '30' },
    });

    expect(setRangeValueMock).toHaveBeenCalledWith(value, 'price', {
      min: 30,
      max: 80,
    });

    expect(onChangeMock).toHaveBeenCalledWith({
      options: {},
      ranges: {
        price: {
          min: 30,
          max: 80,
        },
      },
    });
  });

  it('clamps the minimum number input against the current safe maximum', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Min' }), {
      target: { value: '999' },
    });

    expect(setRangeValueMock).toHaveBeenCalledWith(value, 'price', {
      min: 80,
      max: 80,
    });
  });

  it('treats an empty minimum number input as 0', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Min' }), {
      target: { value: '' },
    });

    expect(setRangeValueMock).toHaveBeenCalledWith(value, 'price', {
      min: 0,
      max: 80,
    });
  });

  it('updates the maximum value from the number input', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Max' }), {
      target: { value: '60' },
    });

    expect(setRangeValueMock).toHaveBeenCalledWith(value, 'price', {
      min: 20,
      max: 60,
    });

    expect(onChangeMock).toHaveBeenCalledWith({
      options: {},
      ranges: {
        price: {
          min: 20,
          max: 60,
        },
      },
    });
  });

  it('clamps the maximum number input against the current safe minimum', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Max' }), {
      target: { value: '-100' },
    });

    expect(setRangeValueMock).toHaveBeenCalledWith(value, 'price', {
      min: 20,
      max: 20,
    });
  });

  it('treats an empty maximum number input as the safe minimum', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Max' }), {
      target: { value: '' },
    });

    expect(setRangeValueMock).toHaveBeenCalledWith(value, 'price', {
      min: 20,
      max: 20,
    });
  });

  it('updates the minimum value from the minimum slider', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    fireEvent.change(screen.getByRole('slider', { name: 'Minimum Price' }), {
      target: { value: '35' },
    });

    expect(setRangeValueMock).toHaveBeenCalledWith(value, 'price', {
      min: 35,
      max: 80,
    });

    expect(onChangeMock).toHaveBeenCalledWith({
      options: {},
      ranges: {
        price: {
          min: 35,
          max: 80,
        },
      },
    });
  });

  it('updates the maximum value from the maximum slider', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    fireEvent.change(screen.getByRole('slider', { name: 'Maximum Price' }), {
      target: { value: '70' },
    });

    expect(setRangeValueMock).toHaveBeenCalledWith(value, 'price', {
      min: 20,
      max: 70,
    });

    expect(onChangeMock).toHaveBeenCalledWith({
      options: {},
      ranges: {
        price: {
          min: 20,
          max: 70,
        },
      },
    });
  });

  it('clamps the minimum slider against the safe maximum', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    fireEvent.change(screen.getByRole('slider', { name: 'Minimum Price' }), {
      target: { value: '95' },
    });

    expect(setRangeValueMock).toHaveBeenCalledWith(value, 'price', {
      min: 80,
      max: 80,
    });
  });

  it('clamps the maximum slider against the safe minimum', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    fireEvent.change(screen.getByRole('slider', { name: 'Maximum Price' }), {
      target: { value: '10' },
    });

    expect(setRangeValueMock).toHaveBeenCalledWith(value, 'price', {
      min: 20,
      max: 20,
    });
  });

  it('renders the slider range track styles from the computed percentages', () => {
    const { container } = render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    const sliderRange = container.querySelector('div[style]');

    expect(sliderRange).toHaveStyle({
      left: '20%',
      right: '20%',
    });
  });

  it('requests the expected message namespace', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    expect(useMessagesMock).toHaveBeenCalledWith('productFilters');
  });

  it('calls getRangeValue with the provided filter value and group id', () => {
    render(
      <FilterBarRangePanel
        baseId="filters"
        group={group}
        value={value}
        onChange={onChangeMock}
      />
    );

    expect(getRangeValueMock).toHaveBeenCalledWith(value, 'price');
  });
});
