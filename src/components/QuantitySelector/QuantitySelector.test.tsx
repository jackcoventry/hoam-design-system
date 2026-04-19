import { act, createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { QuantitySelector } from '@/components/QuantitySelector';

describe('QuantitySelector', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the current value in the spinbutton', () => {
    render(
      <QuantitySelector
        value={2}
        onChange={vi.fn()}
        aria-label="Quantity"
      />
    );

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });

    expect(input).toHaveValue('2');
    expect(input).toHaveAttribute('aria-valuenow', '2');
  });

  it('falls back to a default accessible name', () => {
    render(
      <QuantitySelector
        value={2}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue('2');
  });

  it('renders min and max aria values when provided', () => {
    render(
      <QuantitySelector
        value={2}
        onChange={vi.fn()}
        min={1}
        max={5}
        aria-label="Quantity"
      />
    );

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });

    expect(input).toHaveAttribute('aria-valuemin', '1');
    expect(input).toHaveAttribute('aria-valuemax', '5');
  });

  it('calls onChange with incremented value', () => {
    const onChange = vi.fn();

    render(
      <QuantitySelector
        value={2}
        onChange={onChange}
        aria-label="Quantity"
      />
    );

    fireEvent.mouseDown(screen.getByRole('button', { name: 'Increase quantity' }));

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('calls onChange with decremented value', () => {
    const onChange = vi.fn();

    render(
      <QuantitySelector
        value={2}
        onChange={onChange}
        aria-label="Quantity"
      />
    );

    fireEvent.mouseDown(screen.getByRole('button', { name: 'Decrease quantity' }));

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('disables the decrement button at the minimum', () => {
    render(
      <QuantitySelector
        value={0}
        onChange={vi.fn()}
        min={0}
        aria-label="Quantity"
      />
    );

    expect(screen.getByRole('button', { name: 'Decrease quantity' })).toBeDisabled();
  });

  it('disables the increment button at the maximum', () => {
    render(
      <QuantitySelector
        value={5}
        onChange={vi.fn()}
        max={5}
        aria-label="Quantity"
      />
    );

    expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeDisabled();
  });

  it('clamps incremented values to the maximum', () => {
    const onChange = vi.fn();

    render(
      <QuantitySelector
        value={5}
        onChange={onChange}
        min={0}
        max={5}
        aria-label="Quantity"
      />
    );

    const button = screen.getByRole('button', { name: 'Increase quantity' });

    expect(button).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('clamps decremented values to the minimum', () => {
    const onChange = vi.fn();

    render(
      <QuantitySelector
        value={0}
        onChange={onChange}
        min={0}
        max={5}
        aria-label="Quantity"
      />
    );

    const button = screen.getByRole('button', { name: 'Decrease quantity' });

    expect(button).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('supports press and hold on increment', () => {
    const onChange = vi.fn();

    render(
      <QuantitySelector
        value={1}
        onChange={onChange}
        min={0}
        max={10}
        aria-label="Quantity"
      />
    );

    const button = screen.getByRole('button', { name: 'Increase quantity' });

    fireEvent.mouseDown(button);

    expect(onChange).toHaveBeenCalledWith(2);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onChange).toHaveBeenCalledWith(2);

    act(() => {
      vi.advanceTimersByTime(140);
    });

    expect(onChange).toHaveBeenLastCalledWith(2);

    fireEvent.mouseUp(button);
  });

  it('stops press and hold when mouse is released', () => {
    const onChange = vi.fn();

    render(
      <QuantitySelector
        value={1}
        onChange={onChange}
        min={0}
        max={10}
        aria-label="Quantity"
      />
    );

    const button = screen.getByRole('button', { name: 'Increase quantity' });

    fireEvent.mouseDown(button);
    fireEvent.mouseUp(button);

    const callCountAfterRelease = onChange.mock.calls.length;

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onChange.mock.calls.length).toBe(callCountAfterRelease);
  });

  it('supports keyboard activation on the buttons', () => {
    const onChange = vi.fn();

    render(
      <QuantitySelector
        value={2}
        onChange={onChange}
        aria-label="Quantity"
      />
    );

    const button = screen.getByRole('button', { name: 'Increase quantity' });

    fireEvent.keyDown(button, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith(3);

    fireEvent.keyUp(button, { key: 'Enter' });
  });

  it('forwards a ref to the input', () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <QuantitySelector
        ref={ref}
        value={2}
        onChange={vi.fn()}
        aria-label="Quantity"
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('forwards id and name to the input', () => {
    render(
      <QuantitySelector
        value={2}
        onChange={vi.fn()}
        id="quantity"
        name="quantity"
        aria-label="Quantity"
      />
    );

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });

    expect(input).toHaveAttribute('id', 'quantity');
    expect(input).toHaveAttribute('name', 'quantity');
  });
});
