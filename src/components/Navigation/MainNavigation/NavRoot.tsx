import styles from '@/components/Navigation/Navigation.module.css';

export type NavRootProps = {
  /** Ref attached to the navigation root element. */
  innerRef: React.RefObject<HTMLElement | null>;
  /** Called when the pointer leaves the navigation root. */
  onLeave: () => void;
  /** Called when the pointer enters the navigation root. */
  onEnter: () => void;
  /** Keyboard handler attached to the navigation root. */
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  /** Navigation content rendered inside the root. */
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
