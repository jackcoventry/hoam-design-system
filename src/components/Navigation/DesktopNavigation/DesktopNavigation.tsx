import { useCallback, useMemo, useRef } from 'react';

import { Container, Grid, GridItem } from '@/components/Layout';
import { DesktopNavigationActions } from '@/components/Navigation/DesktopNavigation/DesktopNavigationActions';
import { DesktopNavigationItems } from '@/components/Navigation/DesktopNavigation/DesktopNavigationItems';
import { DesktopNavigationLogo } from '@/components/Navigation/DesktopNavigation/DesktopNavigationLogo';
import { querySubItemVisibility } from '@/components/Navigation/helpers';
import type { NavTopLevelItem, NavUserItem } from '@/components/Navigation/types';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { KEYS } from '@/constants/keys';

import styles from '@/components/Navigation/Navigation.module.css';

export type DesktopNavigationProps = {
  /** Primary top-level navigation items. */
  items: NavTopLevelItem[];
  /** Secondary user action items. */
  userItems: NavUserItem[];
  /** Accessible label for the brand or home link. */
  brandLabel: string;
  /** Destination used for the brand or home link. */
  homeHref: string;
  /** Index of the currently open top-level item. */
  openIndex: number | null;
  /** Sets the currently open top-level item index. */
  setOpenIndex: (index: number | null) => void;
  /** Identifier of the currently open second-level group. */
  openGroupId: string | null;
  /** Sets the currently open second-level group identifier. */
  setOpenGroupId: (id: string | null) => void;
  /** Marks keyboard interaction as active for navigation state. */
  setKeyboarding: () => void;
  /** Opens a top-level item by index. */
  handleTopNavigationOpen: (index: number) => void;
  /** Closes all open desktop navigation state. */
  handleAllNavigationClose: () => void;
  /** Clears pending leave timers or state. */
  clearLeave: () => void;
  /** Opens the search modal action. */
  onOpenSearch: () => void;
  /** Opens the basket modal action. */
  onOpenBasket: () => void;
  /** Resets navigation state to its default closed position. */
  resetNavigation: () => void;
};

export function DesktopNavigation({
  items = [],
  userItems = [],
  brandLabel,
  homeHref,
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
  const isRTL = useMemo(
    () => typeof document !== 'undefined' && document.dir === 'rtl',
    []
  );

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

  const handleHeaderKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      setKeyboarding();
      handleNavigationKeyDown(event);
    },
    [handleNavigationKeyDown, setKeyboarding]
  );

  return (
    <header
      ref={rootRef}
      onPointerLeave={handleHeaderPointerLeave}
      onPointerEnter={handleHeaderPointerEnter}
      onKeyDown={handleHeaderKeyDown}
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

              <DesktopNavigationLogo
                onResetNavigation={resetNavigation}
                brandLabel={brandLabel}
                homeHref={homeHref}
              />

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
