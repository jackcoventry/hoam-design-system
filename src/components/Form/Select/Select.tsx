import {
  type ChangeEvent,
  Children,
  type ForwardedRef,
  forwardRef,
  isValidElement,
  type OptgroupHTMLAttributes,
  type OptionHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
  useId,
  useMemo,
} from 'react';

import styles from '@/components/Form/Select/Select.module.css';

export type OnChangeValue<M extends boolean> = M extends true ? string[] : string;

export interface SelectProps<M extends boolean = false>
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    'onChange' | 'value' | 'defaultValue' | 'multiple'
  > {
  /** Current selected value, or selected values when `multiple` is true. */
  value: OnChangeValue<M>;
  /** Called with the normalized selected value and the original change event. */
  onChange: (value: OnChangeValue<M>, event: ChangeEvent<HTMLSelectElement>) => void;
  /** Enables native multi-select behavior and changes `value` to a string array. */
  multiple?: M;
  /** Optional visible label rendered above the control. */
  label?: string;
  /** Optional disabled option rendered before the supplied options. */
  placeholder?: string;
  /** Submitted value for the placeholder option, defaults to an empty string. */
  placeholderValue?: string;
}

export interface SelectOptionProps
  extends Omit<OptionHTMLAttributes<HTMLOptionElement>, 'label' | 'value'> {
  /** Submitted value for the option. */
  value: string;
  /** Optional text label used when no children are provided. */
  label?: string;
  /** Optional custom option content. */
  children?: ReactNode;
}

export interface SelectOptGroupProps extends OptgroupHTMLAttributes<HTMLOptGroupElement> {
  /** Visible label for the option group. */
  label: string;
  /** Grouped options rendered inside the optgroup. */
  children?: ReactNode;
}

type OptionLookup = Map<string, string>;

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

function hasChildrenProp(child: ReactNode): child is ReactElement<{ children?: ReactNode }> {
  return isValidElement<{ children?: ReactNode }>(child);
}

function hasOptionProps(
  child: ReactNode
): child is ReactElement<{ children?: ReactNode; label?: string; value: string }> {
  return (
    isValidElement<{ children?: ReactNode; label?: string; value?: unknown }>(child) &&
    typeof child.props.value === 'string'
  );
}

function getTextFromNode(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextFromNode).join('');
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getTextFromNode(node.props.children);
  }

  return '';
}

function buildOptionLookup(
  children: ReactNode,
  placeholder?: string,
  placeholderValue = ''
): OptionLookup {
  const lookup: OptionLookup = new Map();

  if (placeholder !== undefined) {
    lookup.set(placeholderValue, placeholder.length > 0 ? placeholder : placeholderValue);
  }

  function walk(nodes: ReactNode): void {
    Children.forEach(nodes, (child) => {
      if (hasOptionProps(child)) {
        const textLabel = getTextFromNode(child.props.children);
        const displayLabel =
          child.props.label ?? (textLabel.length > 0 ? textLabel : child.props.value);

        lookup.set(child.props.value, displayLabel);
        return;
      }

      if (hasChildrenProp(child)) {
        walk(child.props.children);
      }
    });
  }

  walk(children);

  return lookup;
}

const SelectRoot = forwardRef(function Select<M extends boolean = false>(
  {
    id,
    name,
    label,
    placeholder,
    placeholderValue = '',
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

  const optionLookup = useMemo(
    () => buildOptionLookup(children, placeholder, placeholderValue),
    [children, placeholder, placeholderValue]
  );

  const displayValue = Array.isArray(value)
    ? value.map((item) => optionLookup.get(item) ?? item).join(', ')
    : (optionLookup.get(value) ?? value);

  return (
    <div className={styles.root}>
      {label ? (
        <div className={styles.labelRow}>
          <label
            className={styles.label}
            htmlFor={actualId}
          >
            <span className={styles.labelText}>{label}</span>
          </label>

          <span className={styles.labelValue}>{displayValue}</span>
        </div>
      ) : null}

      <div className={styles.control}>
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
          {placeholder !== undefined ? (
            <option
              value={placeholderValue}
              disabled
              hidden
            >
              {placeholder}
            </option>
          ) : null}
          {children}
        </select>

        {multiple ? null : (
          <span
            aria-hidden="true"
            className={styles.arrow}
          />
        )}
      </div>
    </div>
  );
});

export const Select = Object.assign(SelectRoot, {
  Option,
  OptGroup,
});
