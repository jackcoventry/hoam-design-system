import { PropsWithChildren } from 'react';

import styles from '@/components/Table/Table.module.css';

export function Table({ children }: Readonly<PropsWithChildren>) {
  return (
    <table className={styles.root}>
      <tbody>{children}</tbody>
    </table>
  );
}
