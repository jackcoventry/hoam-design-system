import styles from '@/components/Navigation/Navigation.module.css';

export type NavRootProps = {
  innerRef: React.RefObject<HTMLElement>;
  onLeave: () => void;
  onEnter: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  children: React.ReactNode;
};

export function NavRoot({
  innerRef,
  onLeave,
  onEnter,
  onKeyDown,
  children,
}: Readonly<NavRootProps>) {
  return (
    <header
      ref={innerRef}
      onPointerLeave={onLeave}
      onPointerEnter={onEnter}
      onKeyDown={onKeyDown}
      role="none"
      className={styles.root}
    >
      {children}
    </header>
  );
}
