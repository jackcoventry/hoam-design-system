import { PropsWithChildren } from 'react';

import styles from './DemoBlock.module.css';

export function DemoBlock({ children }: Readonly<PropsWithChildren>) {
  return <div className={styles.root}>{children}</div>;
}
