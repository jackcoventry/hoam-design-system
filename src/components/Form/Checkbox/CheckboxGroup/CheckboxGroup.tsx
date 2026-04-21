import { type ReactNode, useId } from 'react';
import clsx from 'clsx';

import styles from './CheckboxGroup.module.css';
import utils from '@/styles/Util.module.css';

export interface CheckboxGroupProps {
  /** Accessible legend for the checkbox group. */
  legend: string;
  /** Optional supporting description shown below the legend. */
  description?: string;
  /** Validation error shown below the group. */
  error?: string;
  /** Checkbox items rendered inside the group. */
  children: ReactNode;
  /** Adds custom class names to the fieldset. */
  className?: string;
  /** Marks the group as required in the UI. */
  required?: boolean;
}

export function CheckboxGroup({
  legend,
  description,
  error,
  children,
  className,
  required = false,
}: Readonly<CheckboxGroupProps>) {
  const baseId = useId();
  const descriptionId = description ? `${baseId}-description` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;

  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset
      className={clsx(styles.root, className)}
      aria-describedby={describedBy}
    >
      <legend className={utils.srOnly}>{legend}</legend>
      <span className={styles.legend}>
        {legend}
        {required ? <span className={styles.required}> *</span> : null}
      </span>

      {description ? (
        <p
          id={descriptionId}
          className={styles.description}
        >
          {description}
        </p>
      ) : null}

      <div className={styles.items}>{children}</div>

      {error ? (
        <p
          id={errorId}
          className={styles.error}
        >
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
