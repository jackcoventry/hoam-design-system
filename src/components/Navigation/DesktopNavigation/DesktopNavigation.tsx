import DesktopNavigationActions from '@/components/Navigation/DesktopNavigation/DesktopNavigationActions';
import DesktopNavigationItems from '@/components/Navigation/DesktopNavigation/DesktopNavigationItems';
import DesktopNavigationLogo from '@/components/Navigation/DesktopNavigation/DesktopNavigationLogo';
import { useKeyboardNav } from '@/components/Navigation/hooks/useKeyboardNav';
import type {
  NavTopLevelItem,
  NavUserItem,
  NavigationProps,
} from '@/components/Navigation/types/Navigation.types';
import { querySubItemVisibility } from '@/components/Navigation/utils/helpers';
import { useCallback, useMemo, useRef, useState } from 'react';
import '../Navigation.css';

type DesktopNavigationProps = {
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

export default function DesktopNavigation({
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

    if (isFixedVariant) {
      setLogoSrc(LOGO.WHITE);
    }
  }, [LOGO.WHITE, handleAllNavigationClose, isFixedVariant]);

  const handleHeaderPointerEnter = useCallback(() => {
    clearLeave();

    if (isFixedVariant) {
      setLogoSrc(LOGO.DEFAULT);
    }
  }, [LOGO.DEFAULT, clearLeave, isFixedVariant]);

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
      className="hoam-navigation__root"
    >
      <div className="hoam-navigation">
        <div className="container">
          <div className="grid">
            <div className="span-12">
              <div
                className="hoam-navigation__inner"
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
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
