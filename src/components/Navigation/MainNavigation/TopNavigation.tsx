import styles from '@/components/Navigation/Navigation.module.css';

type TopNavigationProps = {
  children: React.ReactNode;
};

export function TopNavigation({ children }: Readonly<TopNavigationProps>) {
  return (
    <nav aria-label="Main navigation">
      <ul className={styles.list}>{children}</ul>
    </nav>
  );
}
