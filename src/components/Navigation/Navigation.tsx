import { useMemo, useState } from 'react';
import clsx from 'clsx';

import { Button } from '@/components/Button';
import {
  BasketModal,
  DesktopNavigation,
  MobileNavigation,
  SearchModal,
} from '@/components/Navigation';
import type { NavigationProps } from '@/components/Navigation/types';
import { useMegaNavState } from '@/hooks/useNavState';

import styles from '@/components/Navigation/Navigation.module.css';
import utils from '@/styles/Util.module.css';

export function Navigation({
  items = [],
  userItems = [],
  searchEndpoint = '',
  basketEndpoint = '',
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

  const handleSearchModalClose = () => {
    setOpenSearchModal(false);
  };

  const handleBasketModalClose = () => {
    setOpenBasketModal(false);
  };

  return (
    <>
      <MobileNavigation items={mobileNavigation} />

      <DesktopNavigation
        items={items}
        userItems={userItems}
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
        endpoint={searchEndpoint}
        open={openSearchModal}
        onClose={handleSearchModalClose}
        variant="modal"
      />

      <BasketModal
        endpoint={basketEndpoint}
        open={openBasketModal}
        onClose={handleBasketModalClose}
        variant="drawer"
      />
    </>
  );
}
