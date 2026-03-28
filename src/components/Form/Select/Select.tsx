import {
  type ChangeEvent,
  type ForwardedRef,
  forwardRef,
  type OptgroupHTMLAttributes,
  type OptionHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  useId,
} from 'react';
import clsx from 'clsx';

import utils from '@/components/Common/Util.module.css';
import styles from '@/components/Form/Select/Select.module.css';

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

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    if (multiple) {
      const values = Array.from(event.target.selectedOptions).map((option) => option.value);
      onChange(values as OnChangeValue<M>, event);
      return;
    }

    onChange(event.target.value as OnChangeValue<M>, event);
  }

  const displayValue = Array.isArray(value) ? value.join(', ') : value;

  return (
    <div className={styles.root}>
      {label ? (
        // TODO: implement global fieldlabels
        <div className={styles.labelRow}>
          <label
            className={styles.label}
            htmlFor={actualId}
          >
            <span className={styles.labelText}>{label}</span>
          </label>

          <span
            className={styles.labelValue}
            aria-hidden="true"
          >
            {displayValue}
          </span>
        </div>
      ) : null}

      <select
        id={actualId}
        className={clsx(styles.input, utils.focus)}
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
