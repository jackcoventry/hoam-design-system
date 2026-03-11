import { PropsWithChildren } from 'react';

import styles from '@/components/Form/FieldWrapper/FieldWrapper.module.css';

type Props = {
  error?: string | undefined;
};

export function FieldWrapper({ children, error }: PropsWithChildren<Props>) {
  return (
    <div className={styles.root}>
      <div className={styles.content}>{children}</div>
      {error && (
        <div
          className={styles.error}
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
