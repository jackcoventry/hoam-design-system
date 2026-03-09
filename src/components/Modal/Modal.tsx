import { Button } from '@/components/Button/Button';
import { FOCUSABLE_SELECTORS } from '@/constants/focusable-selectors';
import React, {
  KeyboardEvent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';
import { useModalStack } from './ModalStackContext';

export type ModalVariant = 'modal' | 'drawer';

type ModalContextValue = {
  titleId: string;
  close: () => void;
};

const ModalContext = React.createContext<ModalContextValue | null>(null);

function useModalContext(componentName: string): ModalContextValue {
  const ctx = useContext(ModalContext);

  if (!ctx) {
    throw new Error(`${componentName} must be used within <Modal>`);
  }

  return ctx;
}

export type ModalRootProps = {
  isOpen: boolean;
  onClose?: () => void;
  ariaLabel?: string;
  id?: string;
  variant?: ModalVariant;
};

export type ModalSectionProps = PropsWithChildren<{
  padded?: boolean;
}>;

export type ModalTitleProps = PropsWithChildren;

export type ModalCloseButtonProps = {
  ariaLabel?: string;
  callback?: () => void;
};

function ModalRoot({
  isOpen,
  onClose,
  children,
  ariaLabel,
  id,
  variant = 'modal',
}: Readonly<PropsWithChildren<ModalRootProps>>) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const instanceId = useId();
  const titleId = useId();

  const { isTopMost } = useModalStack(instanceId, isOpen);

  const close = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!dialogRef.current) return [];

    return Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(
      (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1
    );
  }, []);

  const focusFirstElement = useCallback(() => {
    const items = getFocusableElements();

    if (items.length > 0) {
      items[0]?.focus();
    } else {
      dialogRef.current?.focus();
    }
  }, [getFocusableElements]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && isTopMost) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;

      if (!dialog.open) {
        dialog.showModal();
      }

      const raf = requestAnimationFrame(() => {
        focusFirstElement();
      });

      return () => {
        cancelAnimationFrame(raf);
      };
    }

    if (dialog.open) {
      dialog.close();
    }

    return undefined;
  }, [focusFirstElement, isOpen, isTopMost]);

  useEffect(() => {
    if (!isOpen && lastFocusedRef.current) {
      lastFocusedRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (!isOpen || !isTopMost) return;

    if (event.key !== 'Tab') return;

    const items = getFocusableElements();

    if (items.length === 0) {
      event.preventDefault();
      return;
    }

    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    const lastIndex = items.length - 1;

    const nextIndex = event.shiftKey
      ? currentIndex <= 0
        ? lastIndex
        : currentIndex - 1
      : currentIndex === lastIndex
        ? 0
        : currentIndex + 1;

    event.preventDefault();
    items[nextIndex]?.focus();
  };

  const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement, Event>) => {
    if (!isOpen || !isTopMost) return;

    event.preventDefault();
    close();
  };

  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (!isOpen || !isTopMost) return;

    if (event.target === event.currentTarget) {
      close();
    }
  };

  const contextValue = useMemo<ModalContextValue>(
    () => ({
      titleId,
      close,
    }),
    [titleId, close]
  );

  if (typeof document === 'undefined') return null;

  return createPortal(
    /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
    <dialog
      ref={dialogRef}
      id={id}
      className="hoam-modal"
      data-open={isOpen ? 'true' : 'false'}
      data-variant={variant}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabel ? undefined : titleId}
      onCancel={handleCancel}
      onClick={handleDialogClick}
      onKeyDown={handleKeyDown}
    >
      <div className="hoam-modal__dialog">
        <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>
      </div>
    </dialog>,
    document.body
  );
}

function ModalHeader({ children, padded = true }: Readonly<ModalSectionProps>) {
  return (
    <header
      className="hoam-modal__header"
      data-padded={padded ? 'true' : 'false'}
    >
      {children}
    </header>
  );
}

function ModalTitle({ children }: Readonly<ModalTitleProps>) {
  const { titleId } = useModalContext('Modal.Title');

  return <h2 id={titleId}>{children}</h2>;
}

function ModalCloseButton({
  ariaLabel = 'Close dialog',
  callback,
}: Readonly<ModalCloseButtonProps>) {
  const { close } = useModalContext('Modal.CloseButton');

  const handleClose = () => {
    callback?.();
    close();
  };

  return (
    <Button
      type="button"
      onClick={handleClose}
      aria-label={ariaLabel}
      className="hoam-modal__close-button"
      iconOnly
      icon="close"
    />
  );
}

function ModalBody({ children, padded = true }: Readonly<ModalSectionProps>) {
  return (
    <div
      className="hoam-modal__body"
      data-padded={padded ? 'true' : 'false'}
    >
      {children}
    </div>
  );
}

function ModalFooter({ children, padded = true }: Readonly<ModalSectionProps>) {
  return (
    <footer
      className="hoam-modal__footer"
      data-padded={padded ? 'true' : 'false'}
    >
      {children}
    </footer>
  );
}

const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Title: ModalTitle,
  CloseButton: ModalCloseButton,
  Body: ModalBody,
  Footer: ModalFooter,
});

export { Modal, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalRoot, ModalTitle };
