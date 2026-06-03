import { SubmitHandler } from 'react-hook-form';

import { SearchForm, SearchFormSchemaType } from '@/components/Form';
import { Modal } from '@/components/Modal';
import { ModalVariant } from '@/components/Modal/Modal';

import styles from '@/components/Navigation/Modals/SearchModal.module.css';

export type SearchModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<SearchFormSchemaType>;
  variant: ModalVariant;
};

export function SearchModal({
  open,
  onClose,
  onSubmit,
  variant,
}: Readonly<SearchModalProps>) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      variant={variant}
      surface="transparent"
    >
      <Modal.Header padded={false}>
        <div className={styles.header}>
          <SearchForm
            onClose={onClose}
            onSubmit={onSubmit}
            loading={false}
            showCloseButton={false}
          />
          <Modal.CloseButton />
        </div>
      </Modal.Header>
    </Modal>
  );
}
