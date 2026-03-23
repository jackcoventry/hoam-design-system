import { useMemo } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { SearchForm, SearchFormSchemaType, SearchLoader, SearchResults } from '@/components/Form';
import { Modal } from '@/components/Modal';
import { ModalVariant } from '@/components/Modal/Modal';
import { useFetchSignal } from '@/hooks/useFetch';
import { getSearchResults } from '@/utils/fetchers/getSearchResults';

type SearchModalTypes = {
  endpoint: string;
  open: boolean;
  onClose: () => void;
  variant: ModalVariant;
};

export function SearchModal({ endpoint, open, onClose, variant }: Readonly<SearchModalTypes>) {
  const fetcher = useMemo(() => getSearchResults(endpoint), [endpoint]);

  const { data, error, loading, reload } = useFetchSignal(fetcher, {
    manual: true,
  });

  const safeData = data ?? [];
  const safeError = error instanceof Error ? error : undefined;

  const onSubmit: SubmitHandler<SearchFormSchemaType> = async () => {
    await reload();
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      variant={variant}
    >
      <Modal.Header padded={false}>
        <SearchForm
          onSubmit={onSubmit}
          loading={loading}
        />
      </Modal.Header>

      <Modal.Body padded={false}>
        {loading && !safeError ? <SearchLoader /> : null}
        {safeData.length > 0 && !safeError && !loading ? <SearchResults items={safeData} /> : null}
      </Modal.Body>
    </Modal>
  );
}
