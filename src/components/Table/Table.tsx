import { PropsWithChildren } from 'react';
import clsx from 'clsx';

import styles from '@/components/Table/Table.module.css';

export type TableProps = PropsWithChildren<{
  /** Optional class applied to the table wrapper. */
  className?: string;
}>;

export type TableHeaderProps = PropsWithChildren;
export type TableBodyProps = PropsWithChildren;

export function Table({ children, className }: Readonly<TableProps>) {
  return (
    <div className={clsx(styles.root, className)}>
      <table className={styles.table}>{children}</table>
    </div>
  );
}

export function TableHeader({ children }: Readonly<TableHeaderProps>) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }: Readonly<TableBodyProps>) {
  return <tbody>{children}</tbody>;
}
