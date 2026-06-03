/** Props for the modal root, sections, title, and close button. */
export type {
  ModalCloseButtonProps,
  ModalRootProps,
  ModalSectionProps,
  ModalSurface,
  ModalTitleProps,
  ModalVariant,
} from '@/components/Modal/Modal';
/** Modal primitives for dialogs and drawers. */
export {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalRoot,
  ModalTitle,
  Surfaces,
  Variants,
} from '@/components/Modal/Modal';
/** Provider and hook for coordinating stacked modal state. */
export { ModalStackProvider, useModalStack } from '@/components/Modal/ModalStackContext';
