import { Basket, BasketFooter } from '@/components/Basket';
import {
  SearchForm,
  SearchFormResult,
  SearchFormSchemaType,
  SearchLoader,
  SearchResults,
} from '@/components/Form/SearchForm/SearchForm';
import { Modal } from '@/components/Modal/Modal';
import { SubmitHandler } from 'react-hook-form';

export type NavigationModalsProps = {
  openSearchModal: boolean;
  openBasketModal: boolean;
  onCloseSearch: () => void;
  onCloseBasket: () => void;
  searchData: SearchFormResult[] | null | undefined;
  searchLoading: boolean;
  searchError: unknown;
  onSearchSubmit: SubmitHandler<SearchFormSchemaType>;
  basketItems: React.ComponentProps<typeof Basket>['items'];
  basketTotal: number;
};

export function NavigationModals({
  openSearchModal,
  openBasketModal,
  onCloseSearch,
  onCloseBasket,
  searchData,
  searchLoading,
  searchError,
  onSearchSubmit,
  basketItems,
  basketTotal,
}: Readonly<NavigationModalsProps>) {
  const safeSearchData = searchData ?? [];
  const safeSearchError = searchError instanceof Error ? searchError : undefined;

  return (
    <>
      <Modal
        isOpen={openSearchModal}
        onClose={onCloseSearch}
        variant="modal"
      >
        <Modal.Header padded={false}>
          <SearchForm
            onSubmit={onSearchSubmit}
            loading={searchLoading}
          />
        </Modal.Header>

        <Modal.Body padded={false}>
          {searchLoading && !safeSearchError ? <SearchLoader /> : null}
          {safeSearchData.length > 0 && !safeSearchError && !searchLoading ? (
            <SearchResults items={safeSearchData} />
          ) : null}
        </Modal.Body>
      </Modal>

      <Modal
        isOpen={openBasketModal}
        onClose={onCloseBasket}
        variant="drawer"
      >
        <Modal.Header>
          <Modal.Title>Your Basket</Modal.Title>
          <Modal.CloseButton callback={onCloseBasket} />
        </Modal.Header>

        <Modal.Body>
          <Basket
            items={basketItems}
            total={basketTotal}
          />
        </Modal.Body>

        <Modal.Footer>
          <BasketFooter total={basketTotal} />
        </Modal.Footer>
      </Modal>
    </>
  );
}
