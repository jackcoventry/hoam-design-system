import { Button } from '@/components/Button/Button';

import { forwardRef, KeyboardEvent, useEffect, useRef, useState } from 'react';
import './QuantitySelector.css';

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  id?: string;
  name?: string;
  ariaLabel?: string;
  incrementLabel?: string;
  decrementLabel?: string;
}

// Ensures a number stays between the min and max bounds.
function clamp(n: number, min: number, max: number) {
  if (Number.isFinite(min)) n = Math.max(n, min);
  if (Number.isFinite(max)) n = Math.min(n, max);
  return n;
}

export const QuantitySelector = forwardRef<HTMLInputElement, QuantitySelectorProps>(
  (
    {
      value = 0,
      onChange,
      min = 0,
      max = Number.POSITIVE_INFINITY,
      id,
      name,
      ariaLabel,
      incrementLabel = 'Increase quantity',
      decrementLabel = 'Decrease quantity',
    },
    ref
  ) => {
    const ariaMin = Number.isFinite(min) ? min : undefined;
    const ariaMax = Number.isFinite(max) ? max : undefined;
    const latestValueRef = useRef(value);
    const atMin = value <= min;
    const atMax = value >= max;

    const [text, setText] = useState(String(value));

    useEffect(() => {
      setText(String(clamp(value, min, max)));
    }, [value, min, max]);

    useEffect(() => {
      latestValueRef.current = value;
    }, [value]);

    // Takes a new number, clamps it and triggers the onChange callback
    const apply = (next: number) => onChange(clamp(next, min, max));

    // Updates the value by a delta, optionally multiplied
    const update = (dir: 1 | -1, multiplier = 1) =>
      apply(latestValueRef.current + dir * multiplier);

    // Handles pressing and holding the increment/decrement buttons
    const pressTimeout = useRef<number | null>(null);
    const pressDirection = useRef<1 | -1 | 0>(0);

    const stopPress = () => {
      pressDirection.current = 0;
      if (pressTimeout.current) {
        window.clearTimeout(pressTimeout.current);
        pressTimeout.current = null;
      }
    };

    const pressTick = (dir: 1 | -1, delay: number) => {
      if (pressDirection.current !== dir) return; // stopped or changed
      update(dir);
      const nextDelay = Math.max(50, delay - 10); // accelerate a bit
      pressTimeout.current = window.setTimeout(() => pressTick(dir, nextDelay), nextDelay);
    };

    const startPress = (dir: 1 | -1) => {
      stopPress();
      pressDirection.current = dir;
      update(dir);
      pressTimeout.current = window.setTimeout(() => pressTick(dir, 140), 300);
    };

    const createButtonHandlers = (dir: 1 | -1) => ({
      onMouseDown: () => startPress(dir),
      onMouseUp: stopPress,
      onMouseLeave: stopPress,
      onTouchStart: () => startPress(dir),
      onTouchEnd: stopPress,
      onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
        // Support keyboard activation on focused buttons
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault(); // avoid page scroll and rely on our handler
          startPress(dir);
        }
      },
      onKeyUp: (e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          stopPress();
        }
      },
    });

    useEffect(() => stopPress, []); // cleanup

    return (
      <div className="hoam-quantity-selector">
        {ariaLabel && <span className="hoam-quantity-selector__label">{ariaLabel}</span>}

        <div className="hoam-quantity-selector__inner">
          <Button
            ariaLabel={decrementLabel}
            disabled={atMin}
            size="small"
            {...createButtonHandlers(-1)}
          >
            −
          </Button>
          <input
            ref={ref}
            id={id}
            name={name}
            type="text"
            value={text}
            role="spinbutton"
            readOnly
            disabled
            aria-label={ariaLabel}
            aria-valuenow={value}
            aria-valuemin={ariaMin}
            aria-valuemax={ariaMax}
            className="hoam-quantity-selector__input"
          />
          <Button
            ariaLabel={incrementLabel}
            disabled={atMax}
            variant="secondary"
            size="small"
            {...createButtonHandlers(1)}
          >
            +
          </Button>
        </div>
      </div>
    );
  }
);

QuantitySelector.displayName = 'QuantitySelector';

export default QuantitySelector;
