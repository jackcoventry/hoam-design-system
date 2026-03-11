import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { QuantitySelector, type QuantitySelectorProps } from '@/components/QuantitySelector';

type SetupProps = Partial<QuantitySelectorProps>;

function setup(props: SetupProps = {}) {
  const onChange = vi.fn();
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  const defaultProps: QuantitySelectorProps = {
    value: 1,
    onChange,
    min: 0,
    max: 5,
    ariaLabel: 'Quantity',
    incrementLabel: 'Increase quantity',
    decrementLabel: 'Decrease quantity',
  };

  const result = render(
    <QuantitySelector
      {...defaultProps}
      {...props}
    />
  );

  const getSpinbutton = () => screen.getByRole('spinbutton', { name: 'Quantity' });
  const getIncrementButton = () => screen.getByRole('button', { name: 'Increase quantity' });
  const getDecrementButton = () => screen.getByRole('button', { name: 'Decrease quantity' });

  return {
    user,
    onChange,
    ...result,
    getSpinbutton,
    getIncrementButton,
    getDecrementButton,
  };
}

describe('QuantitySelector', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders the current value and spinbutton attributes', () => {
    const { getSpinbutton } = setup({ value: 3, min: 1, max: 10 });

    const input = getSpinbutton();

    expect(input).toHaveValue('3');
    expect(input).toHaveAttribute('aria-valuenow', '3');
    expect(input).toHaveAttribute('aria-valuemin', '1');
    expect(input).toHaveAttribute('aria-valuemax', '10');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('readonly');
  });

  it('calls onChange with incremented value when clicking the plus button', async () => {
    const { user, onChange, getIncrementButton } = setup({ value: 2 });

    await user.click(getIncrementButton());

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('calls onChange with decremented value when clicking the minus button', async () => {
    const { user, onChange, getDecrementButton } = setup({ value: 2 });

    await user.click(getDecrementButton());

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('disables the decrement button at min', () => {
    const { getDecrementButton, getIncrementButton } = setup({
      value: 0,
      min: 0,
      max: 5,
    });

    expect(getDecrementButton()).toBeDisabled();
    expect(getIncrementButton()).not.toBeDisabled();
  });

  it('disables the increment button at max', () => {
    const { getDecrementButton, getIncrementButton } = setup({
      value: 5,
      min: 0,
      max: 5,
    });

    expect(getIncrementButton()).toBeDisabled();
    expect(getDecrementButton()).not.toBeDisabled();
  });

  it('clamps increment to max', async () => {
    const { user, onChange, getIncrementButton } = setup({
      value: 5,
      min: 0,
      max: 5,
    });

    expect(getIncrementButton()).toBeDisabled();

    // Defensive: disabled button should not fire
    await user.click(getIncrementButton());

    expect(onChange).not.toHaveBeenCalled();
  });

  it('clamps decrement to min', async () => {
    const { user, onChange, getDecrementButton } = setup({
      value: 0,
      min: 0,
      max: 5,
    });

    expect(getDecrementButton()).toBeDisabled();

    await user.click(getDecrementButton());

    expect(onChange).not.toHaveBeenCalled();
  });

  it('updates displayed text when the controlled value changes', () => {
    const onChange = vi.fn();

    const { rerender } = render(
      <QuantitySelector
        value={2}
        onChange={onChange}
        min={0}
        max={5}
        ariaLabel="Quantity"
      />
    );

    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue('2');

    rerender(
      <QuantitySelector
        value={4}
        onChange={onChange}
        min={0}
        max={5}
        ariaLabel="Quantity"
      />
    );

    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue('4');
  });

  it('clamps displayed text when controlled value is outside bounds', () => {
    const onChange = vi.fn();

    const { rerender } = render(
      <QuantitySelector
        value={10}
        onChange={onChange}
        min={0}
        max={5}
        ariaLabel="Quantity"
      />
    );

    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue('5');

    rerender(
      <QuantitySelector
        value={-3}
        onChange={onChange}
        min={0}
        max={5}
        ariaLabel="Quantity"
      />
    );

    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue('0');
  });

  it('forwards the ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <QuantitySelector
        ref={ref}
        value={1}
        onChange={vi.fn()}
        ariaLabel="Quantity"
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(screen.getByRole('spinbutton', { name: 'Quantity' }));
  });

  it('supports keyboard activation on increment button with Enter', async () => {
    const { user, onChange, getIncrementButton } = setup({ value: 2 });
    const incrementButton = getIncrementButton();

    incrementButton.focus();
    expect(incrementButton).toHaveFocus();

    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('supports keyboard activation on decrement button with Space', async () => {
    const { user, onChange, getDecrementButton } = setup({ value: 2 });
    const decrementButton = getDecrementButton();

    decrementButton.focus();
    expect(decrementButton).toHaveFocus();

    await user.keyboard(' ');

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('repeats updates while increment button is held', () => {
    const onChange = vi.fn();

    render(
      <QuantitySelector
        value={1}
        onChange={onChange}
        min={0}
        max={10}
        ariaLabel="Quantity"
      />
    );

    const incrementButton = screen.getByRole('button', {
      name: 'Increase quantity',
    });

    incrementButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith(2);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onChange).toHaveBeenLastCalledWith(2);

    act(() => {
      vi.advanceTimersByTime(140);
    });

    expect(onChange).toHaveBeenLastCalledWith(2);

    act(() => {
      vi.advanceTimersByTime(130);
    });

    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it('stops repeating when mouse is released', () => {
    const onChange = vi.fn();

    render(
      <QuantitySelector
        value={1}
        onChange={onChange}
        min={0}
        max={10}
        ariaLabel="Quantity"
      />
    );

    const incrementButton = screen.getByRole('button', {
      name: 'Increase quantity',
    });

    incrementButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(onChange).toHaveBeenCalledTimes(1);

    incrementButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('uses the latest controlled value during press repetition', () => {
    const onChange = vi.fn();

    const { rerender } = render(
      <QuantitySelector
        value={2}
        onChange={onChange}
        min={0}
        max={10}
        ariaLabel="Quantity"
      />
    );

    const incrementButton = screen.getByRole('button', {
      name: 'Increase quantity',
    });

    incrementButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(onChange).toHaveBeenLastCalledWith(3);

    rerender(
      <QuantitySelector
        value={3}
        onChange={onChange}
        min={0}
        max={10}
        ariaLabel="Quantity"
      />
    );

    act(() => {
      vi.advanceTimersByTime(300);
      vi.advanceTimersByTime(140);
    });

    expect(onChange).toHaveBeenLastCalledWith(4);
  });
});
