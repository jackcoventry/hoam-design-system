import styles from '@/components/Table/Table.module.css';
import { PropsWithChildren } from 'react';

export function Table({ children }: Readonly<PropsWithChildren>) {
  return (
    <table className={styles.root}>
      <tbody>{children}</tbody>
    </table>
  );
}
