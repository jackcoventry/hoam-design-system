import { Button } from '@/components/Button/Button';
import FOCUSABLE_SELECTORS from '@/constants/focusable-selectors';
import React, {
  KeyboardEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';
import { useModalStack } from './ModalStackContext';

type ModalVariant = 'modal' | 'drawer';

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

type ModalRootProps = {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  /**
   * Optional accessible name fallback when no <Modal.Title> is used.
   */
  ariaLabel?: string;
  id?: string;
  variant?: ModalVariant;
};

function ModalRoot({
  isOpen,
  onClose,
  children,
  ariaLabel,
  id,
  variant = 'modal',
}: ModalRootProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const instanceId = useId();
  const titleId = useId();

  const { isTopMost } = useModalStack(instanceId, isOpen);

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!dialogRef.current) return [];
    return Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(
      (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1
    );
  }, []);

  const focusFirstElement = useCallback(() => {
    const items = getFocusableElements();
    if (items.length > 0) {
      items[0].focus();
    } else {
      dialogRef.current?.focus();
    }
  }, [getFocusableElements]);

  // Move focus into the dialog when it opens and is top-most
  useEffect(() => {
    if (!isOpen || !isTopMost) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const raf = requestAnimationFrame(() => {
      focusFirstElement();
    });

    return () => cancelAnimationFrame(raf);
  }, [isOpen, isTopMost, focusFirstElement]);

  // Restore focus when closed
  useEffect(() => {
    if (!isOpen && lastFocusedRef.current) {
      lastFocusedRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen || !isTopMost) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      onClose?.();
      return;
    }

    if (e.key === 'Tab') {
      const items = getFocusableElements();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }

      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      const lastIndex = items.length - 1;
      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
      } else {
        nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
      }

      e.preventDefault();
      items[nextIndex].focus();
    }
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isOpen || !isTopMost) return;
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  if (typeof document === 'undefined') return null; // SSR / tests safety

  const close = () => onClose?.();
  const variantAttr = variant ?? 'modal';
  const contextValue: ModalContextValue = {
    titleId,
    close,
  };

  const ariaLabelledBy = ariaLabel ? undefined : titleId;

  return createPortal(
    <div
      id={id}
      className="hoam-modal"
      data-open={isOpen ? 'true' : 'false'}
      data-variant={variantAttr}
      onClick={handleOverlayClick}
      role="none"
    >
      <div
        ref={dialogRef}
        className="hoam-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-hidden={isOpen ? undefined : true}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>
      </div>
    </div>,
    document.body
  );
}

/**
 * <Modal.Header> — structural wrapper for the header area
 */
function ModalHeader({ children }: { children: ReactNode }) {
  return <header className="hoam-modal__header">{children}</header>;
}

/**
 * <Modal.Title> — accessible title, wires up aria-labelledby via titleId
 */
function ModalTitle({ children }: { children: ReactNode }) {
  const { titleId } = useModalContext('Modal.Title');
  return <h2 id={titleId}>{children}</h2>;
}

/**
 * <Modal.CloseButton> — standardised close button hooked into Modal.close()
 */
type ModalCloseButtonProps = {
  ariaLabel?: string;
  callback?: () => void;
};

function ModalCloseButton({ ariaLabel = 'Close dialog', callback }: ModalCloseButtonProps) {
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

/**
 * <Modal.Body> — content area
 */
function ModalBody({ children }: { children: ReactNode }) {
  return <div className="hoam-modal__body">{children}</div>;
}

/**
 * Compound export:
 *   <Modal.Root> with <Modal.Header>, <Modal.Title>, <Modal.CloseButton>, <Modal.Body>
 */
const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Title: ModalTitle,
  CloseButton: ModalCloseButton,
  Body: ModalBody,
});

export default Modal;
export { ModalBody, ModalCloseButton, ModalHeader, ModalRoot, ModalTitle };
