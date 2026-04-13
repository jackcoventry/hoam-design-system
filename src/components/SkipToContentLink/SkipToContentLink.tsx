import { Button } from '@/components/Button';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/SkipToContentLink/SkipToContentLink.module.css';

export function SkipToContentLink() {
  const t = useMessages('skipToContent');
  return (
    <Button
      as="a"
      href="#content"
      className={styles.root}
      variant="secondary"
    >
      {t.text}
    </Button>
  );
}
