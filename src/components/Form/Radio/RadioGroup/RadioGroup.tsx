import { type ReactNode, useId } from 'react';
import clsx from 'clsx';

import styles from './RadioGroup.module.css';
import utils from '@/styles/Util.module.css';

export interface RadioGroupProps {
  legend: string;
  description?: string;
  error?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
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
