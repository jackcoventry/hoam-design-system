import { useCallback, useMemo, useState } from 'react';

import { DesktopNavigation } from '@/components/Navigation/DesktopNavigation/DesktopNavigation';
import { MobileNavigation } from '@/components/Navigation/MobileNavigation/MobileNavigation';
import { BasketModal } from '@/components/Navigation/Modals/BasketModal';
import { SearchModal } from '@/components/Navigation/Modals/SearchModal';
import type { NavigationProps } from '@/components/Navigation/types';
import { useMegaNavState } from '@/hooks/useNavState';
import { SITE } from '@/constants/site';

export function Navigation({
  items = [],
  userItems = [],
  brandLabel = SITE.title,
  homeHref = '/',
  searchSubmit,
  basketData = [],
}: Readonly<NavigationProps>) {
  const {
    openIndex,
    setOpenIndex,
    openGroupId,
    setOpenGroupId,
    setKeyboarding,
    handleTopNavigationOpen,
    handleAllNavigationClose,
    clearLeave,
    resetNavigation,
  } = useMegaNavState();

  const mobileNavigation = useMemo(() => [...items, ...userItems], [items, userItems]);

  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openBasketModal, setOpenBasketModal] = useState(false);

  const handleSearchModalClose = useCallback(() => {
    setOpenSearchModal(false);
  }, []);

  const handleBasketModalOpen = useCallback(() => {
    setOpenBasketModal(true);
  }, []);

  const handleBasketModalClose = useCallback(() => {
    setOpenBasketModal(false);
  }, []);

  const handleSearchModalOpen = useCallback(() => {
    setOpenSearchModal(true);
  }, []);

  return (
    <>
      <MobileNavigation
        items={mobileNavigation}
        brandLabel={brandLabel}
        homeHref={homeHref}
      />

      <DesktopNavigation
        items={items}
        userItems={userItems}
        brandLabel={brandLabel}
        homeHref={homeHref}
        openIndex={openIndex}
        resetNavigation={resetNavigation}
        setOpenIndex={setOpenIndex}
        openGroupId={openGroupId}
        setOpenGroupId={setOpenGroupId}
        setKeyboarding={setKeyboarding}
        handleTopNavigationOpen={handleTopNavigationOpen}
        handleAllNavigationClose={handleAllNavigationClose}
        clearLeave={clearLeave}
        onOpenSearch={handleSearchModalOpen}
        onOpenBasket={handleBasketModalOpen}
      />

      <SearchModal
        open={openSearchModal}
        onClose={handleSearchModalClose}
        variant="modal"
        onSubmit={searchSubmit}
      />

      <BasketModal
        open={openBasketModal}
        onClose={handleBasketModalClose}
        variant="drawer"
        data={basketData}
      />
    </>
  );
}
