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
      disabled = false,
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

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {};

    const atMin = value <= min;
    const atMax = value >= max;

    return (
      <div className="hoam-quantity-selector">
        <button>-</button>
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
        <button>+</button>
      </div>
    );
  }
);

export default QuantitySelector;
