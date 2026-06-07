import { PropsWithChildren } from 'react';

import styles from './SectionHeader.module.css';
import typography from '@/styles/Typography.module.css';
import utils from '@/styles/Util.module.css';

export type SectionHeaderProps = {
  title: string;
};

export function SectionHeader({ title, children }: PropsWithChildren<SectionHeaderProps>) {
  return (
    <div className={utils.justifyBetween}>
      <h2 className={typography.heading}>{title}</h2>
      <div className={styles.slot}>{children}</div>
    </div>
  );
}
