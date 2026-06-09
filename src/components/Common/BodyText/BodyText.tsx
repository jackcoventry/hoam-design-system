import clsx from 'clsx';
import type { ElementType, PropsWithChildren } from 'react';

import { Stack } from '@/components/Layout';

import styles from '@/components/Common/BodyText/BodyText.module.css';

export type BodyTextProps = PropsWithChildren<{
  /** HTML element used for the body text root. */
  as?: ElementType;
  /** Optional class applied to the body text root. */
  className?: string;
}>;

export function BodyText({
  as: Component = 'section',
  children,
  className,
}: Readonly<BodyTextProps>) {
  return (
    <Component className={clsx(styles.root, className)}>
      <Stack gap="md">{children}</Stack>
    </Component>
  );
}
