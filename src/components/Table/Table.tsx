import styles from '@/components/Table/Table.module.css';
import { PropsWithChildren } from 'react';

function Table({ children }: Readonly<PropsWithChildren>) {
  return (
    <table className={styles.root}>
      <tbody>{children}</tbody>
    </table>
  );
}
export default Table;
