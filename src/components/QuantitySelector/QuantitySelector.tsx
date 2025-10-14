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
    return (
      <div className="hoam-quantity-selector">
        <button>-</button>
        <input type="text" value={value} readOnly={true} />
        <button>+</button>
      </div>
    );
  }
);

export default QuantitySelector;
