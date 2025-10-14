import React from "react";

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  id?: string;
  name?: string;
  ariaLabel?: string;
  incrementLabel?: string;
  decrementLabel?: string;
}

function clamp(n: number, min: number, max: number) {
  // Ensures a number stays between the min and max bounds.
  if (Number.isFinite(min)) n = Math.max(n, min);
  if (Number.isFinite(max)) n = Math.min(n, max);
  return n;
}

export const QuantitySelector = React.forwardRef<
  HTMLInputElement,
  QuantitySelectorProps
>(
  (
    {
      value = 0,
      onChange,
      min = 0,
      max = Number.POSITIVE_INFINITY,
      disabled = true,
      id,
      name,
      ariaLabel,
      incrementLabel = "Increase quantity",
      decrementLabel = "Decrease quantity",
    },
    ref
  ) => {
    const ariaMin = Number.isFinite(min) ? min : undefined;
    const ariaMax = Number.isFinite(max) ? max : undefined;

    const [text, setText] = React.useState(String(value));

    React.useEffect(() => {
      setText(String(clamp(value, min, max)));
    }, [value, min, max]);

    const apply = (next: number) => onChange(clamp(next, min, max));
    const update = (dir: 1 | -1, multiplier = 1) =>
      apply(value + dir * multiplier);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setText(raw);
      const n = Number(raw);
      if (!Number.isNaN(n)) onChange(n);
    };

    const handleBlur = () => {
      const n = Number(text);
      if (!Number.isNaN(n)) apply(n);
      else setText(String(value));
    };

    const keyDispatch: Record<string, () => void> = {
      ArrowUp: () => update(1),
      ArrowDown: () => update(-1),
      PageUp: () => update(1, 5),
      PageDown: () => update(-1, 5),
      Home: () => apply(min),
      End: () => apply(max),
    } as const;

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      const fn = keyDispatch[e.key];
      if (fn) {
        e.preventDefault();
        fn();
      }
    };

    const createButtonHandlers = (dir: 1 | -1) => ({
      onClick: () => update(dir),
    });

    const atMin = value <= min;
    const atMax = value >= max;

    return (
      <div className="hoam-quantity-selector">
        <button
          type="button"
          aria-label={decrementLabel}
          disabled={atMin}
          {...createButtonHandlers(-1)}
        >
          −
        </button>
        <input
          ref={ref}
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={text}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          role="spinbutton"
          aria-label={ariaLabel}
          aria-valuenow={value}
          aria-valuemin={ariaMin}
          aria-valuemax={ariaMax}
          aria-disabled={disabled || undefined}
          disabled={disabled}
        />
        <button
          type="button"
          aria-label={incrementLabel}
          disabled={atMax}
          {...createButtonHandlers(1)}
        >
          +
        </button>
      </div>
    );
  }
);

export default QuantitySelector;
