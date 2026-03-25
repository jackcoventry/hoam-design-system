import { useMemo } from 'react';

import { Basket, BasketFooter } from '@/components/Basket';
import { Modal } from '@/components/Modal';
import { ModalVariant } from '@/components/Modal/Modal';
import { useFetchSignal } from '@/hooks/useFetch';
import { getBasketItems } from '@/utils/fetchers/getBasketItems';

import typography from '@/components/Common/Typography.module.css';

export type BasketModalProps = {
  endpoint: string;
  open: boolean;
  onClose: () => void;
  variant: ModalVariant;
};

export function BasketModal({ endpoint, open, onClose, variant }: Readonly<BasketModalProps>) {
  const fetcher = useMemo(() => getBasketItems(endpoint), [endpoint]);

  const { data } = useFetchSignal(fetcher);

  const basketTotal =
    data?.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0) || 0;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      variant={variant}
    >
      <Modal.Header>
        <Modal.Title>
          <span className={typography.heading}>Your Basket</span>
        </Modal.Title>
        <Modal.CloseButton callback={onClose} />
      </Modal.Header>

      <Modal.Body>
        <Basket
          items={data}
          total={basketTotal}
        />
      </Modal.Body>

      <Modal.Footer>
        <BasketFooter total={basketTotal} />
      </Modal.Footer>
    </Modal>
  );
}
