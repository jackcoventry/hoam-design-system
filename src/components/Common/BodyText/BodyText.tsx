import { PropsWithChildren } from 'react';
import clsx from 'clsx';

import { Stack } from '@/components/Layout';

import styles from '@/components/Common/BodyText/BodyText.module.css';

export type BodyTextProps = PropsWithChildren<{
  /** Optional class applied to the body text root. */
  className?: string;
}>;

export function BodyText({ children, className }: Readonly<BodyTextProps>) {
  return (
    <section className={clsx(styles.root, className)}>
      <Stack gap="md">{children}</Stack>
    </section>
  );
}
