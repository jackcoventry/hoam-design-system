import { useCallback, useMemo, useRef, useState } from 'react';

import { Container, Grid, GridItem } from '@/components/Layout';
import {
  DesktopNavigationActions,
  DesktopNavigationItems,
  DesktopNavigationLogo,
} from '@/components/Navigation';
import { querySubItemVisibility } from '@/components/Navigation/helpers';
import type { NavigationProps, NavTopLevelItem, NavUserItem } from '@/components/Navigation/types';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';

import styles from '@/components/Navigation/Navigation.module.css';

export type DesktopNavigationProps = {
  items: NavTopLevelItem[];
  userItems: NavUserItem[];
  variant: NavigationProps['variant'];
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
  variant = 'default',
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

  const isDefaultVariant = variant === 'default';
  const isFixedVariant = variant === 'fixed';
  const isStickyVariant = variant === 'sticky';
  const isRTL = typeof document !== 'undefined' && document.dir === 'rtl';

  const mapArrow = useCallback(
    (key: string) =>
      isRTL && (key === 'ArrowLeft' || key === 'ArrowRight')
        ? key === 'ArrowRight'
          ? 'ArrowLeft'
          : 'ArrowRight'
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

  const LOGO = {
    DEFAULT: '/logo.png',
    WHITE: '/logo-white.png',
  } as const;

  const [logoSrc, setLogoSrc] = useState<string>(isDefaultVariant ? LOGO.DEFAULT : LOGO.WHITE);

  const handleHeaderPointerLeave = useCallback(() => {
    handleAllNavigationClose();

    if (isStickyVariant) {
      setLogoSrc(LOGO.WHITE);
    }
  }, [LOGO.WHITE, handleAllNavigationClose, isStickyVariant]);

  const handleHeaderPointerEnter = useCallback(() => {
    clearLeave();

    if (isStickyVariant) {
      setLogoSrc(LOGO.DEFAULT);
    }
  }, [LOGO.DEFAULT, clearLeave, isStickyVariant]);

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
      data-variant={variant}
      className={styles.root}
    >
      <Container>
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
                logoSrc={logoSrc}
                onResetNavigation={resetNavigation}
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
