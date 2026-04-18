import { useMemo, useState } from 'react';

import {
  BasketModal,
  DesktopNavigation,
  MobileNavigation,
  SearchModal,
} from '@/components/Navigation';
import type { NavigationProps } from '@/components/Navigation/types';
import { useMegaNavState } from '@/hooks/useNavState';
import { SITE } from '@/constants/site';

export function Navigation<TData, TError extends Error = Error>({
  items = [],
  userItems = [],
  brandLabel = SITE.title,
  homeHref = '/',
  searchSubmit,
  searchData = [],
  searchState,
  basketData = [],
}: Readonly<NavigationProps<TData, TError>>) {
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

  const handleSearchModalClose = () => {
    setOpenSearchModal(false);
  };

  const handleBasketModalClose = () => {
    setOpenBasketModal(false);
  };

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
        onOpenSearch={() => setOpenSearchModal(true)}
        onOpenBasket={() => setOpenBasketModal(true)}
      />

      <SearchModal
        open={openSearchModal}
        onClose={handleSearchModalClose}
        variant="modal"
        data={searchData}
        onSubmit={searchSubmit}
        state={searchState}
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
