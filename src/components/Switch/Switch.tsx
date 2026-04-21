import { type ChangeEvent, forwardRef, type InputHTMLAttributes, useId } from 'react';
import clsx from 'clsx';

import { Stack } from '@/components/Layout';

import styles from './Switch.module.css';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Visible label shown next to the switch. */
  label: string;
  /** Optional supporting description shown under the label. */
  description?: string;
  /** Convenience callback that receives the checked state directly. */
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    id,
    label,
    description,
    className,
    disabled = false,
    checked,
    defaultChecked,
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
    <div className={clsx(styles.root, className)}>
      <label
        className={clsx(styles.labelWrapper, disabled && styles.disabled)}
        htmlFor={inputId}
      >
        <span className={styles.control}>
          <input
            {...rest}
            ref={ref}
            id={inputId}
            className={styles.input}
            type="checkbox"
            role="switch"
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
            className={styles.track}
            aria-hidden="true"
          >
            <span className={styles.thumb} />
          </span>
        </span>

        <span className={styles.text}>
          <Stack gap="sm">
            <span className={styles.label}>{label}</span>

            {description ? (
              <span
                id={descriptionId}
                className={styles.description}
              >
                {description}
              </span>
            ) : null}
          </Stack>
        </span>
      </label>
    </div>
  );
});
