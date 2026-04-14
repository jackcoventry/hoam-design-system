import { Children, isValidElement, PropsWithChildren, ReactElement, ReactNode } from 'react';

import { logger } from '@/utils/logger';

import styles from '@/components/Table/Table.module.css';

type TableHeaderElement = ReactElement<React.ComponentProps<typeof TableHeader>>;
type TableBodyElement = ReactElement<React.ComponentProps<typeof TableBody>>;

function getTableParts(children: ReactNode): {
  header: TableHeaderElement;
  body: TableBodyElement;
} {
  const childArray = Children.toArray(children);

  logger.invariant(
    childArray.length === 2,
    '<Table /> must contain exactly two children: <TableHeader /> and <typeof TableBody />'
  );

  const [headerChild, bodyChild] = childArray;

  logger.invariant(
    isValidElement(headerChild) && headerChild?.type === TableHeader,
    'The first child of Table must be <TableHeader />'
  );

  logger.invariant(
    isValidElement(bodyChild) && bodyChild?.type === TableBody,
    'The second child of Table must be <TableBody />'
  );

  return {
    header: headerChild as TableHeaderElement,
    body: bodyChild as TableBodyElement,
  };
}

export function Table({ children }: Readonly<PropsWithChildren>) {
  const { header, body } = getTableParts(children);

  return (
    <div className={styles.root}>
      <table className={styles.table}>
        {header}
        {body}
      </table>
    </div>
  );
}

export function TableHeader({ children }: Readonly<PropsWithChildren>) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }: Readonly<PropsWithChildren>) {
  return <tbody>{children}</tbody>;
}
