import { PropsWithChildren } from 'react';

import styles from '@/components/Form/FieldWrapper/FieldWrapper.module.css';

export type FieldWrapperProps = {
  /** Validation error rendered below the field content. */
  error?: string | undefined;
  /** Optional id used to associate the error with the field via `aria-describedby`. */
  errorId?: string | undefined;
};

export function FieldWrapper({ children, error, errorId }: PropsWithChildren<FieldWrapperProps>) {
  return (
    <div className={styles.root}>
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
