import { Basket, BasketFooter, BasketItemProps } from '@/components/Basket';
import { Modal } from '@/components/Modal';
import { ModalVariant } from '@/components/Modal/Modal';
import { useMessages } from '@/hooks/useMessages';

import typography from '@/styles/Typography.module.css';

export type BasketModalProps = {
  open: boolean;
  onClose: () => void;
  variant: ModalVariant;
  data: BasketItemProps[];
};

export function BasketModal({ open, onClose, data, variant }: Readonly<BasketModalProps>) {
  const t = useMessages('navigation');
  const basketTotal = data?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      variant={variant}
    >
      <Modal.Header>
        <Modal.Title>
          <span className={typography.heading}>{t.modalBasket}</span>
        </Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>

      <Modal.Body>
        <Basket
          items={data ?? []}
          total={basketTotal}
        />
      </Modal.Body>

      <Modal.Footer>
        <BasketFooter total={basketTotal} />
      </Modal.Footer>
    </Modal>
  );
}
