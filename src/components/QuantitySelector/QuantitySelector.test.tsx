// QuantitySelector.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import QuantitySelector, { QuantitySelectorProps } from './QuantitySelector';

// --- Mock your Button so tests interact with a real <button> element ---
vi.mock('@/components/Button/Button', () => {
  const React = require('react') as typeof import('react');
  const Button = React.forwardRef<HTMLButtonElement, any>(
    (
      props: { [x: string]: any; ariaLabel: any; children: any },
      ref: React.Ref<HTMLButtonElement>
    ) => {
      const { ariaLabel, children, ...rest } = props;
      return (
        <button
          ref={ref}
          aria-label={ariaLabel}
          {...rest}
        >
          {children}
        </button>
      );
    }
  );
  Button.displayName = 'MockButton';
  return { Button };
});

function TestWrapper({
  initial = 2,
  props,
}: Readonly<{ initial?: number; props?: Partial<QuantitySelectorProps> }>) {
  const [val, setVal] = React.useState(initial);
  return (
    <QuantitySelector
      value={val}
      onChange={setVal}
      ariaLabel="Quantity"
      incrementLabel="Increase quantity"
      decrementLabel="Decrease quantity"
      {...props}
    />
  );
}

describe('QuantitySelector', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders current value and a disabled, read-only spinbutton input with correct aria attributes', () => {
    render(
      <TestWrapper
        initial={3}
        props={{ min: 1, max: 10 }}
      />
    );

    const spin = screen.getByRole('spinbutton');
    expect(spin).toHaveAttribute('aria-valuenow', '3');
    expect(spin).toHaveAttribute('aria-valuemin', '1');
    expect(spin).toHaveAttribute('aria-valuemax', '10');
    expect(spin).toHaveAttribute('readonly');
    expect(spin).toBeDisabled();
  });

  it('increments once on mouse down and stops on mouse up', () => {
    render(
      <TestWrapper
        initial={2}
        props={{ min: 0, max: 10 }}
      />
    );

    const increaseButton = screen.getByRole('button', {
      name: /increase quantity/i,
    });
    const spin = screen.getByRole('spinbutton');

    fireEvent.mouseDown(increaseButton); // immediate +1
    expect(spin).toHaveAttribute('aria-valuenow', '3');

    // ensure no further increments without hold
    vi.advanceTimersByTime(1000);
    fireEvent.mouseUp(increaseButton);
    expect(spin).toHaveAttribute('aria-valuenow', '3');
  });

  it('decrements once on mouse down and stops on mouse up', () => {
    render(
      <TestWrapper
        initial={2}
        props={{ min: 0, max: 10 }}
      />
    );

    const decreaseButton = screen.getByRole('button', {
      name: /decrease quantity/i,
    });
    const spin = screen.getByRole('spinbutton');

    fireEvent.mouseDown(decreaseButton); // immediate -1
    expect(spin).toHaveAttribute('aria-valuenow', '1');

    vi.advanceTimersByTime(1000);
    fireEvent.mouseUp(decreaseButton);
    expect(spin).toHaveAttribute('aria-valuenow', '1');
  });

  it('respects max during long-press', () => {
    render(
      <TestWrapper
        initial={2}
        props={{ min: 0, max: 3 }}
      />
    );

    const inc = screen.getByRole('button', { name: /increase quantity/i });
    const spin = screen.getByRole('spinbutton');

    fireEvent.mouseDown(inc); // -> 3
    expect(spin).toHaveAttribute('aria-valuenow', '3');

    // hold long enough that repeats would happen, but value should clamp to 3
    vi.advanceTimersByTime(300 + 500);
    fireEvent.mouseUp(inc);
    expect(spin).toHaveAttribute('aria-valuenow', '3');

    // plus button should be disabled at max
    expect(inc).toBeDisabled();
  });

  it('respects min during long-press', () => {
    render(
      <TestWrapper
        initial={1}
        props={{ min: 1, max: 10 }}
      />
    );

    const dec = screen.getByRole('button', { name: /decrease quantity/i });
    const spin = screen.getByRole('spinbutton');

    fireEvent.mouseDown(dec); // would go to 0, but min=1 → clamp
    expect(spin).toHaveAttribute('aria-valuenow', '1');

    vi.advanceTimersByTime(300 + 500);
    fireEvent.mouseUp(dec);
    expect(spin).toHaveAttribute('aria-valuenow', '1');

    // minus button disabled at min
    expect(dec).toBeDisabled();
  });

  it('keyboard Space/Enter on focused buttons triggers a single step; holding repeats the trigger', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <TestWrapper
        initial={5}
        props={{ min: 0, max: 10 }}
      />
    );

    const inc = screen.getByRole('button', { name: /increase quantity/i });
    const spin = screen.getByRole('spinbutton');

    // Focus increment and press Space once
    inc.focus();
    await user.keyboard('[Space]');
    expect(spin).toHaveAttribute('aria-valuenow', '6');

    // Hold Space to trigger repeats
    // Simulate keydown and keep pressed (user-event doesn't keep it down by default)
    fireEvent.keyDown(inc, { key: ' ' });
    vi.advanceTimersByTime(300); // first repeat tick
    expect(spin).toHaveAttribute('aria-valuenow', '7');
    vi.advanceTimersByTime(140);
    expect(spin).toHaveAttribute('aria-valuenow', '8');

    // release
    fireEvent.keyUp(inc, { key: ' ' });
  });

  it('applies aria labels from props', () => {
    render(
      <TestWrapper
        initial={2}
        props={{
          incrementLabel: 'Add one item',
          decrementLabel: 'Remove one item',
        }}
      />
    );

    expect(screen.getByRole('button', { name: /add one item/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove one item/i })).toBeInTheDocument();
  });

  it('reflects external value changes (controlled)', () => {
    function External() {
      const [v, setV] = React.useState(2);
      return (
        <>
          <button onClick={() => setV(9)}>set to 9</button>
          <QuantitySelector
            value={v}
            onChange={setV}
            ariaLabel="Quantity"
            incrementLabel="Increase quantity"
            decrementLabel="Decrease quantity"
          />
        </>
      );
    }

    render(<External />);
    const spin = screen.getByRole('spinbutton');
    expect(spin).toHaveAttribute('aria-valuenow', '2');

    fireEvent.click(screen.getByText('set to 9'));
    expect(spin).toHaveAttribute('aria-valuenow', '9');
  });
});
