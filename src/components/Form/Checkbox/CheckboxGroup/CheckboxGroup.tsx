import { type ReactNode, useId } from 'react';
import clsx from 'clsx';

import styles from './CheckboxGroup.module.css';

export interface CheckboxGroupProps {
  legend: string;
  description?: string;
  error?: string;
  children: ReactNode;
  className?: string;
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
      <legend className="sr-only">{legend}</legend>
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
