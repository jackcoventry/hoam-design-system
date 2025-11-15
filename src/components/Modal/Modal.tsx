import FOCUSABLE_SELECTORS from '@/constants/focusable-selectors';
import React, { KeyboardEvent, ReactNode, useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useModalStack } from './ModalStackContext';

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  /**
   * Required. The accessible name for the modal.
   * - If showTitle=true: visible <h2>, aria-labelledby used
   * - If showTitle=false: hidden title, aria-label used
   */
  title: string;
  showTitle?: boolean;
  /** Optional id for testing - might not need eventually */
  id?: string;
};

function Modal({ isOpen, onClose, children, title, showTitle = true, id }: ModalProps) {
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

  useEffect(() => {
    if (!isOpen || !isTopMost) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const raf = requestAnimationFrame(focusFirstElement);

    return () => {
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(raf);
    };
  }, [isOpen, isTopMost, focusFirstElement]);

  useEffect(() => {
    if (!isOpen && lastFocusedRef.current) {
      lastFocusedRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isTopMost) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
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
      let nextIndex = currentIndex;

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
    if (!isTopMost) return;
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null; // A bit of safety for SSR and testing

  const ariaLabel = showTitle ? undefined : title;
  const ariaLabelledBy = showTitle ? titleId : undefined;

  return createPortal(
    <div
      id={id}
      className="hoam-modal__overlay"
      onClick={handleOverlayClick}
      role="none"
    >
      <div
        ref={dialogRef}
        className="hoam-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <header className="hoam-modal__header">
          {showTitle && <h2 id={titleId}>{title}</h2>}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="hoam-modal__close-button"
          >
            X
          </button>
        </header>

        <div className="hoam-modal__body">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
