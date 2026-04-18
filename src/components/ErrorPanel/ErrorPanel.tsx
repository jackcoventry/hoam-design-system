import clsx from 'clsx';

import { Button } from '@/components/Button';
import { Stack } from '@/components/Layout';
import mindfullnessIllustration from '@/assets/illustrations/mindfullness.svg';

import styles from '@/components/ErrorPanel/ErrorPanel.module.css';
import typography from '@/styles/Typography.module.css';

export type Props = {
  message: string;
  returnLabel?: string;
  returnUrl?: string;
};

export function ErrorPanel({
  message,
  returnLabel = 'Return home',
  returnUrl = '/',
}: Readonly<Props>) {
  return (
    <Stack
      gap="lg"
      className={styles.root}
    >
      <img
        src={mindfullnessIllustration}
        alt="An illustration of a woman meditating"
        className={styles.image}
      />
      <h2 className={clsx(styles.title, typography.heading)}>{message}</h2>
      <Button
        as="a"
        href={returnUrl}
        className={styles.button}
      >
        {returnLabel}
      </Button>
    </Stack>
  );
}
