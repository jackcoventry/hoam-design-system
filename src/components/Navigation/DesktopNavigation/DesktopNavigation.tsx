import { useCallback, useMemo, useRef } from 'react';

import { Container, Grid, GridItem } from '@/components/Layout';
import {
  DesktopNavigationActions,
  DesktopNavigationItems,
  DesktopNavigationLogo,
} from '@/components/Navigation';
import { querySubItemVisibility } from '@/components/Navigation/helpers';
import type { NavTopLevelItem, NavUserItem } from '@/components/Navigation/types';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { KEYS } from '@/constants/keys';

import styles from '@/components/Navigation/Navigation.module.css';

export type DesktopNavigationProps = {
  items: NavTopLevelItem[];
  userItems: NavUserItem[];
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
  openGroupId: string | null;
  setOpenGroupId: (id: string | null) => void;
  setKeyboarding: () => void;
  handleTopNavigationOpen: (index: number) => void;
  handleAllNavigationClose: () => void;
  clearLeave: () => void;
  onOpenSearch: () => void;
  onOpenBasket: () => void;
  resetNavigation: () => void;
};

export function DesktopNavigation({
  items = [],
  userItems = [],
  openIndex,
  setOpenIndex,
  openGroupId,
  setOpenGroupId,
  setKeyboarding,
  handleTopNavigationOpen,
  handleAllNavigationClose,
  clearLeave,
  onOpenSearch,
  onOpenBasket,
  resetNavigation,
}: Readonly<DesktopNavigationProps>) {
  const rootRef = useRef<HTMLElement | null>(null);
  const isRTL = typeof document !== 'undefined' && document.dir === 'rtl';

  const mapArrow = useCallback(
    (key: string) =>
      isRTL && (key === KEYS.ARROW_LEFT || key === KEYS.ARROW_RIGHT)
        ? key === KEYS.ARROW_RIGHT
          ? KEYS.ARROW_LEFT
          : KEYS.ARROW_RIGHT
        : key,
    [isRTL]
  );

  const navigationQueries = useMemo(
    () => ({
      subTriggersOnly: (panelRoot: Element) =>
        querySubItemVisibility<HTMLElement>(panelRoot, '[data-sub-trigger]'),
      subInteractive: (panelRoot: Element) =>
        querySubItemVisibility<HTMLElement>(panelRoot, '[data-sub-trigger], [data-sub-link]'),
      thirdList: (container: Element, domId: string) =>
        querySubItemVisibility<HTMLElement>(container, `#${domId}-panel [data-sub-link]`),
    }),
    []
  );

  const handleNavigationKeyDown = useKeyboardNav({
    rootRef,
    items,
    setOpenIndex,
    setOpenGroupId,
    mapArrow,
    subSelectors: navigationQueries,
  });

  const openFirstCategory = useCallback(
    (topIndex: number) => {
      const firstId = items[topIndex]?.items?.[0]?.id;
      setOpenGroupId(firstId ?? null);
    },
    [items, setOpenGroupId]
  );

  const handleHeaderPointerLeave = useCallback(() => {
    handleAllNavigationClose();
  }, [handleAllNavigationClose]);

  const handleHeaderPointerEnter = useCallback(() => {
    clearLeave();
  }, [clearLeave]);

  return (
    <header
      ref={rootRef}
      onPointerLeave={handleHeaderPointerLeave}
      onPointerEnter={handleHeaderPointerEnter}
      onKeyDown={(event) => {
        setKeyboarding();
        handleNavigationKeyDown(event);
      }}
      role="none"
      className={styles.root}
    >
      <Container className={styles.gridWrapper}>
        <Grid>
          <GridItem span={12}>
            <div
              className={styles.inner}
              data-open={openIndex === null ? 'false' : 'true'}
            >
              <DesktopNavigationItems
                items={items}
                openIndex={openIndex}
                openGroupId={openGroupId}
                setOpenGroupId={setOpenGroupId}
                handleTopNavigationOpen={handleTopNavigationOpen}
                clearLeave={clearLeave}
                onOpenFirstCategory={openFirstCategory}
                onResetNavigation={resetNavigation}
              />

              <DesktopNavigationLogo onResetNavigation={resetNavigation} />

              <DesktopNavigationActions
                userItems={userItems}
                onResetNavigation={resetNavigation}
                onOpenSearch={onOpenSearch}
                onOpenBasket={onOpenBasket}
              />
            </div>
          </GridItem>
        </Grid>
      </Container>
    </header>
  );
}
