import { SubmitHandler } from 'react-hook-form';

import {
  SearchForm,
  SearchFormResult,
  SearchFormSchemaType,
  SearchLoader,
  SearchResults,
} from '@/components/Form';
import { Modal } from '@/components/Modal';
import { ModalVariant } from '@/components/Modal/Modal';
import { AsyncState } from '@/types/async';

type SearchModalProps<TData, TError extends Error = Error> = {
  open: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<SearchFormSchemaType>;
  variant: ModalVariant;
  state: AsyncState<TData, TError>;
  data: SearchFormResult[] | null;
};

export function SearchModal<TData, TError extends Error = Error>({
  open,
  onClose,
  onSubmit,
  state,
  variant,
  data = [],
}: Readonly<SearchModalProps<TData, TError>>) {
  const loading = state?.status === 'loading';

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      variant={variant}
    >
      <Modal.Header padded={false}>
        <SearchForm
          onClose={onClose}
          onSubmit={onSubmit}
          loading={state?.status === 'loading'}
        />
      </Modal.Header>

      <Modal.Body padded={false}>
        {loading ? <SearchLoader /> : null}
        {data && data.length > 0 && !loading ? <SearchResults items={data} /> : null}
      </Modal.Body>
    </Modal>
  );
}
