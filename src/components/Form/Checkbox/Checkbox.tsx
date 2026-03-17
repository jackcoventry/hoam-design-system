import { type ChangeEvent, forwardRef, type InputHTMLAttributes, useId } from 'react';
import clsx from 'clsx';

import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    id,
    label,
    description,
    className,
    disabled = false,
    checked,
    defaultChecked,
    indeterminate = false,
    onChange,
    onCheckedChange,
    required,
    name,
    value,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    onCheckedChange?.(event.currentTarget.checked);
  };

  return (
    <label
      className={clsx(styles.root, disabled && styles.disabled, className)}
      htmlFor={inputId}
    >
      <span className={styles.control}>
        <input
          {...rest}
          ref={(node) => {
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }

            if (node) {
              node.indeterminate = indeterminate;
            }
          }}
          id={inputId}
          className={styles.input}
          type="checkbox"
          disabled={disabled}
          required={required}
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          aria-describedby={descriptionId}
          onChange={handleChange}
        />

        <span
          className={styles.box}
          aria-hidden="true"
        >
          <span className={styles.icon} />
        </span>
      </span>

      <span className={styles.text}>
        <span className={styles.label}>{label}</span>

        {description ? (
          <span
            id={descriptionId}
            className={styles.description}
          >
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
});
