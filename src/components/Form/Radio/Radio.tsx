import { type ChangeEvent, type ComponentPropsWithoutRef, forwardRef, useId } from 'react';
import clsx from 'clsx';

import styles from './Radio.module.css';
import utils from '@/styles/Util.module.css';

export interface RadioProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  /** Visible label shown next to the radio input. */
  label: string;
  /** Optional supporting description shown below the label. */
  description?: string;
  /** Convenience callback that receives the checked state directly. */
  onCheckedChange?: (checked: boolean) => void;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { id, label, description, className, disabled = false, onChange, onCheckedChange, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const descriptionId = description ? `${inputId}-description` : undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    onCheckedChange?.(event.currentTarget.checked);
  };

  return (
    <div className={clsx(styles.wrapper, className)}>
      <label
        className={clsx(styles.root, disabled && styles.disabled)}
        htmlFor={inputId}
      >
        <span className={styles.control}>
          <input
            {...rest}
            ref={ref}
            id={inputId}
            className={clsx(styles.input, utils.focus)}
            type="radio"
            disabled={disabled}
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            onChange={handleChange}
          />

          <span
            className={clsx(styles.outer, utils.focusTarget)}
            aria-hidden="true"
          >
            <span className={styles.inner} />
          </span>
        </span>

        <span className={styles.text}>
          <span
            id={labelId}
            className={styles.label}
          >
            {label}
          </span>
        </span>
      </label>

      {description ? (
        <span
          id={descriptionId}
          className={styles.description}
        >
          {description}
        </span>
      ) : null}
    </div>
  );
});
