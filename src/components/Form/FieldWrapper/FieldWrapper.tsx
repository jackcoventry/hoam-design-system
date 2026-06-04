import { PropsWithChildren } from 'react';
import clsx from 'clsx';

import styles from '@/components/Form/FieldWrapper/FieldWrapper.module.css';

export type FieldWrapperProps = {
  /** Validation error rendered below the field content. */
  error?: string | undefined;
  /** Optional id used to associate the error with the field via `aria-describedby`. */
  errorId?: string | undefined;
  /** Optional class applied to the field wrapper root. */
  className?: string;
};

export function FieldWrapper({
  children,
  error,
  errorId,
  className,
}: PropsWithChildren<FieldWrapperProps>) {
  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.content}>{children}</div>
      {error && (
        <div
          id={errorId}
          className={styles.error}
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
