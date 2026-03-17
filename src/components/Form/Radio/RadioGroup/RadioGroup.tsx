import { type ReactNode, useId } from 'react';

import styles from './RadioGroup.module.css';

export interface RadioGroupProps {
  legend: string;
  description?: string;
  error?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function RadioGroup({
  legend,
  description,
  error,
  children,
  className,
  required = false,
}: Readonly<RadioGroupProps>) {
  const baseId = useId();
  const descriptionId = description ? `${baseId}-description` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;

  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset
      className={cx(styles.root, className)}
      aria-describedby={describedBy}
    >
      <legend className={styles.legend}>
        {legend}
        {required ? <span className={styles.required}> *</span> : null}
      </legend>

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
