import { Button } from '@/components/Button';

import styles from '@/components/ErrorPanel/ErrorPanel.module.css';

export type Props = {
  message: string;
};

export function ErrorPanel({ message }: Readonly<Props>) {
  return (
    <div className={styles.root}>
      <img
        src="/mindfullness.svg"
        alt="An illustration of a woman meditating"
        className={styles.image}
      />
      <h2 className={styles.title}>{message}</h2>
      <Button
        as="a"
        href="/"
        className={styles.button}
      >
        Return to homepage
      </Button>
    </div>
  );
}
