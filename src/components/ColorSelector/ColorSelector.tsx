import React from "react";

type ColorSelectorProps = {
  id?: string;
  name?: string;
  value?: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  options: { label: string; value: string; name: string }[];
};

const ColorSelector = React.forwardRef<RadioNodeList, ColorSelectorProps>(
  ({ value, options = [], onChange }, ref) => {
    return (
      <div>
        Colors
        {options?.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name={option.name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    );
  }
);

export default ColorSelector;
