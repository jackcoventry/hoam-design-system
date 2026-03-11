import { useMemo, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import type { SearchFormResult, SearchFormSchemaType } from '@/components/Form';
import { DesktopNavigation, MobileNavigation, NavigationModals } from '@/components/Navigation';
import type { NavigationProps } from '@/components/Navigation/types';
import { useMockRequest } from '@/hooks/useMockRequest';
import { useMegaNavState } from '@/hooks/useNavState';
import BasketItemData from '@/mocks/components/Basket';
import SearchResultsData from '@/mocks/components/SearchResults';

export function Navigation({
  items = [],
  userItems = [],
  variant = 'default',
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

  const { data, loading, error, run, reset } = useMockRequest<Array<SearchFormResult>>();

  const onSubmit: SubmitHandler<SearchFormSchemaType> = async () => {
    await run({
      delay: 1500,
      response: SearchResultsData,
    });
  };

  const handleSearchModalClose = () => {
    setOpenSearchModal(false);

    setTimeout(() => {
      reset();
    }, 500);
  };

  const handleBasketModalClose = () => {
    setOpenBasketModal(false);
  };

  const basketTotal = useMemo(
    () =>
      BasketItemData.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0),
    []
  );

  return (
    <>
      <MobileNavigation items={mobileNavigation} />

      <DesktopNavigation
        items={items}
        userItems={userItems}
        variant={variant}
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

      <NavigationModals
        openSearchModal={openSearchModal}
        openBasketModal={openBasketModal}
        onCloseSearch={handleSearchModalClose}
        onCloseBasket={handleBasketModalClose}
        searchData={data}
        searchLoading={loading}
        searchError={error}
        onSearchSubmit={onSubmit}
        basketItems={BasketItemData}
        basketTotal={basketTotal}
      />
    </>
  );
}
