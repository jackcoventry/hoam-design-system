import { Button } from '@/components/Button';

import styles from '@/components/SkipToContentLink/SkipToContentLink.module.css';

export function SkipToContentLink() {
  return (
    <Button
      as="a"
      href="#content"
      className={styles.root}
      variant="secondary"
    >
      Skip to main content
    </Button>
  );
}
