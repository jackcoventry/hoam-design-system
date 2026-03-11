import { useId, useRef, useState } from 'react';

import { MobileNavigationItem } from '@/components/Navigation/MobileNavigation/MobileNavigationItem';
import type { NavTreeItem } from '@/components/Navigation/types';
import { useFocusTrap } from '@/hooks/useFocusTrap';

import styles from '@/components/Navigation/MobileNavigation/MobileNavigation.module.css';

type MobileNavigationProps = {
  items: NavTreeItem[];
};

export function MobileNavigation({ items }: Readonly<MobileNavigationProps>) {
  const navigationRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  useFocusTrap({
    containerRef: navigationRef,
    active: isOpen,
    onEscape: () => setIsOpen(false),
  });

  return (
    <header
      className={styles.root}
      ref={navigationRef}
    >
      <div className={styles.wrapper}>
        <div className="container-fluid">
          <div className="grid">
            <div className="span-12">
              <div className={styles.inner}>
                <a
                  href="/"
                  className={styles.logo}
                >
                  <img
                    src="/logo.png"
                    alt="Hoam Logo"
                  />
                </a>

                <button
                  type="button"
                  className={styles.toggle}
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                  aria-label={isOpen ? 'Close menu' : 'Open menu'}
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <svg
                    className="icon"
                    width="1.25em"
                    height="1.25em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <use xlinkHref="/icons/icons.svg#three-dots-vertical" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id={menuId}
        data-state={isOpen ? 'open' : 'closed'}
        className={styles.mobileMenu}
      >
        <nav aria-label="Main navigation">
          <ul className={styles.list}>
            {items.map((item) => (
              <MobileNavigationItem
                key={item.id}
                item={item}
              />
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
