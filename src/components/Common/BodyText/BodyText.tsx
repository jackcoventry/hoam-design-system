import { PropsWithChildren } from 'react';

import { Stack } from '@/components/Layout';

import styles from '@/components/Common/BodyText/BodyText.module.css';

export function BodyText({ children }: Readonly<PropsWithChildren>) {
  return (
    <section className={styles.root}>
      <Stack gap="md">{children}</Stack>
    </section>
  );
}
