import { useId, useRef, useState } from 'react';

import { Icon } from '@/components/Icon';
import { Container, Grid, GridItem } from '@/components/Layout';
import { MobileNavigationItem } from '@/components/Navigation/MobileNavigation/MobileNavigationItem';
import type { NavTreeItem } from '@/components/Navigation/types';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useMessages } from '@/hooks/useMessages';
import { SITE } from '@/constants/site';

import styles from '@/components/Navigation/MobileNavigation/MobileNavigation.module.css';

type MobileNavigationProps = {
  items: NavTreeItem[];
};

export function MobileNavigation({ items }: Readonly<MobileNavigationProps>) {
  const t = useMessages('navigation');
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
        <Container width="full">
          <Grid>
            <GridItem span={12}>
              <div className={styles.inner}>
                <a
                  href="/"
                  className={styles.logo}
                >
                  {SITE.title}
                </a>

                <button
                  type="button"
                  className={styles.toggle}
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                  aria-label={isOpen ? t.close : t.open}
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <Icon id="three-dots-vertical" />
                </button>
              </div>
            </GridItem>
          </Grid>
        </Container>
      </div>

      <div
        id={menuId}
        data-state={isOpen ? 'open' : 'closed'}
        className={styles.mobileMenu}
      >
        <nav aria-label={t.mainNavigation}>
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
