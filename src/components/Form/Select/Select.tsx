import styles from '@/components/Form/Select.Select.module.css';
import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  OptgroupHTMLAttributes,
  OptionHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  useId,
} from 'react';

export type OnChangeValue<M extends boolean> = M extends true ? string[] : string;

export interface SelectProps<M extends boolean = false>
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    'onChange' | 'value' | 'defaultValue' | 'multiple'
  > {
  value: OnChangeValue<M>;
  onChange: (value: OnChangeValue<M>, event: ChangeEvent<HTMLSelectElement>) => void;
  multiple?: M;
  label?: string;
}

const SelectRoot = forwardRef(function Select<M extends boolean = false>(
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
  ref: ForwardedRef<HTMLSelectElement>
) {
  const autoId = useId();
  const actualId = id ?? autoId;

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!onChange) return;

    if (multiple) {
      const vals = Array.from(e.target.selectedOptions).map((o) => o.value);
      onChange(vals as OnChangeValue<M>, e);
      return;
    }

    onChange(e.target.value as OnChangeValue<M>, e);
  };

  const displayValue = Array.isArray(value) ? value.join(', ') : value;

  return (
    <div className={styles.root}>
      {label && (
        <label
          className={styles.label}
          htmlFor={actualId}
        >
          <span className={styles.labelText}>{label}</span>
          <span className={styles.labelValue}>{displayValue}</span>
        </label>
      )}

      <select
        id={actualId}
        className={styles.input}
        name={name}
        ref={ref}
        required={required}
        disabled={disabled}
        multiple={Boolean(multiple)}
        value={value}
        onChange={handleChange}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
});

SelectRoot.displayName = 'Select';

export interface SelectOptionProps
  extends Omit<OptionHTMLAttributes<HTMLOptionElement>, 'label' | 'value'> {
  value: string;
  label?: string;
  children?: ReactNode;
}

const Option = forwardRef<HTMLOptionElement, SelectOptionProps>(
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

Option.displayName = 'Option';

export interface SelectOptGroupProps extends OptgroupHTMLAttributes<HTMLOptGroupElement> {
  label: string;
  children?: ReactNode;
}

const OptGroup = forwardRef<HTMLOptGroupElement, SelectOptGroupProps>(
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

OptGroup.displayName = 'OptGroup';

export interface SelectPlaceholderProps {
  children: ReactNode;
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
