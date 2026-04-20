import clsx from 'clsx';

import { Button } from '@/components/Button';
import { Stack } from '@/components/Layout';
import { useMessages } from '@/hooks/useMessages';
import mindfullnessIllustration from '@/assets/illustrations/mindfullness.svg';

import styles from '@/components/ErrorPanel/ErrorPanel.module.css';
import typography from '@/styles/Typography.module.css';

export type ErrorPanelProps = {
  /** Main error message shown as the panel heading. */
  message: string;
  /** Optional override for the return-action label. */
  returnLabel?: string;
  /** Destination used by the return action. */
  returnUrl?: string;
};

export function ErrorPanel({ message, returnLabel, returnUrl = '/' }: Readonly<ErrorPanelProps>) {
  const t = useMessages('errorPanel');

  return (
    <Stack
      gap="lg"
      className={styles.root}
    >
      <img
        src={mindfullnessIllustration}
        alt={t.illustrationAlt}
        className={styles.image}
      />
      <h2 className={clsx(styles.title, typography.heading)}>{message}</h2>
      <Button
        as="a"
        href={returnUrl}
        className={styles.button}
      >
        {returnLabel ?? t.returnHome}
      </Button>
    </Stack>
  );
}
