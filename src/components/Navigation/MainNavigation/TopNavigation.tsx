import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/Navigation/Navigation.module.css';

export type TopNavigationProps = {
  /** Top navigation items rendered inside the list. */
  children: React.ReactNode;
};

export function TopNavigation({ children }: Readonly<TopNavigationProps>) {
  const t = useMessages('navigation');
  return (
    <nav aria-label={t.mainNavigation}>
      <ul className={styles.list}>{children}</ul>
    </nav>
  );
}
