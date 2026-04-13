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
  value: OnChangeValue<M>;
  onChange: (value: OnChangeValue<M>, event: ChangeEvent<HTMLSelectElement>) => void;
  multiple?: M;
  label?: string;
}

export interface SelectOptionProps
  extends Omit<OptionHTMLAttributes<HTMLOptionElement>, 'label' | 'value'> {
  value: string;
  label?: string;
  children?: ReactNode;
}

export interface SelectOptGroupProps extends OptgroupHTMLAttributes<HTMLOptGroupElement> {
  label: string;
  children?: ReactNode;
}

export interface SelectPlaceholderProps {
  children: ReactNode;
  value?: string;
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

const Placeholder = ({ children, value = '' }: SelectPlaceholderProps) => (
  <option
    value={value}
    disabled
    hidden
  >
    {children}
  </option>
);

Placeholder.displayName = 'Placeholder';

function isOptionElement(
  child: ReactNode
): child is ReactElement<SelectOptionProps, typeof Option> {
  return isValidElement<SelectOptionProps>(child) && child.type === Option;
}

function isOptGroupElement(
  child: ReactNode
): child is ReactElement<SelectOptGroupProps, typeof OptGroup> {
  return isValidElement<SelectOptGroupProps>(child) && child.type === OptGroup;
}

function isPlaceholderElement(
  child: ReactNode
): child is ReactElement<SelectPlaceholderProps, typeof Placeholder> {
  return isValidElement<SelectPlaceholderProps>(child) && child.type === Placeholder;
}

function hasChildrenProp(child: ReactNode): child is ReactElement<{ children?: ReactNode }> {
  return isValidElement<{ children?: ReactNode }>(child);
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

function buildOptionLookup(children: ReactNode): OptionLookup {
  const lookup: OptionLookup = new Map();

  function walk(nodes: ReactNode): void {
    Children.forEach(nodes, (child) => {
      if (isOptionElement(child)) {
        const textLabel = getTextFromNode(child.props.children);
        const displayLabel =
          child.props.label ?? (textLabel.length > 0 ? textLabel : child.props.value);

        lookup.set(child.props.value, displayLabel);
        return;
      }

      if (isOptGroupElement(child)) {
        walk(child.props.children);
        return;
      }

      if (isPlaceholderElement(child)) {
        const placeholderValue = child.props.value ?? '';
        const textLabel = getTextFromNode(child.props.children);
        const displayLabel = textLabel.length > 0 ? textLabel : placeholderValue;

        lookup.set(placeholderValue, displayLabel);
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

  const optionLookup = useMemo(() => buildOptionLookup(children), [children]);

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

export const Select = Object.assign(SelectRoot, {
  Option,
  OptGroup,
  Placeholder,
});
