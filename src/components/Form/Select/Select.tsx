import * as React from 'react';

/**
 * For single options, the value will be a string.
 * For multi-select, it should be an array of strings.
 */
type OnChangeValue<M extends boolean> = M extends true ? string[] : string;

export interface SelectProps<M extends boolean = false>
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    'onChange' | 'value' | 'defaultValue' | 'multiple'
  > {
  value: OnChangeValue<M>;
  onChange?: (value: OnChangeValue<M>, event: React.ChangeEvent<HTMLSelectElement>) => void;
  multiple?: M;
  label?: string;
}

const SelectRoot = React.forwardRef(function Select<M extends boolean = false>(
  {
    id,
    name,
    label,
    value,
    onChange,
    multiple,
    required,
    disabled,
    children,
    ...rest
  }: SelectProps<M>,
  ref: React.ForwardedRef<HTMLSelectElement>
) {
  const autoId = React.useId();
  const labelId = React.useId();
  const actualId = id ?? autoId;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!onChange) return;
    if (multiple) {
      const vals = Array.from(e.target.selectedOptions).map((o) => o.value);
      onChange(vals as OnChangeValue<M>, e);
    } else {
      onChange(e.target.value as OnChangeValue<M>, e);
    }
  };

  return (
    <div>
      {label && (
        <label
          id={labelId}
          htmlFor={actualId}
        >
          {label}
          {required ? ' *' : null}
        </label>
      )}

      <select
        id={actualId}
        name={name}
        ref={ref}
        aria-labelledby={label ? labelId : undefined}
        required={required}
        disabled={disabled}
        multiple={Boolean(multiple)}
        value={value as any}
        onChange={handleChange}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
});

export interface SelectOptionProps
  extends Omit<React.OptionHTMLAttributes<HTMLOptionElement>, 'label' | 'value'> {
  value: string;
  label?: string; // shown if no children
  children?: React.ReactNode;
}

const Option = React.forwardRef<HTMLOptionElement, SelectOptionProps>(
  ({ value, label, children, ...rest }, ref) => (
    <option
      ref={ref}
      value={value}
      {...rest}
    >
      {children ?? label ?? value}
    </option>
  )
);

export interface SelectOptGroupProps extends React.OptgroupHTMLAttributes<HTMLOptGroupElement> {
  label: string;
  children?: React.ReactNode;
}

const OptGroup = React.forwardRef<HTMLOptGroupElement, SelectOptGroupProps>(
  ({ label, children, ...rest }, ref) => (
    <optgroup
      ref={ref}
      label={label}
      {...rest}
    >
      {children}
    </optgroup>
  )
);

export interface SelectPlaceholderProps {
  children: React.ReactNode;
  value?: string;
}

const Placeholder = ({ children, value = '' }: SelectPlaceholderProps) => (
  <option
    value={value}
    disabled
    hidden
  >
    {children}
  </option>
);

export const Select = Object.assign(SelectRoot, {
  Option,
  OptGroup,
  Placeholder,
});
