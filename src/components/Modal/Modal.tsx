import { Button } from '@/components/Button/Button';
import FOCUSABLE_SELECTORS from '@/constants/focusable-selectors';
import React, { KeyboardEvent, ReactNode, useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';
import { useModalStack } from './ModalStackContext';

type ModalVariant = 'modal' | 'drawer';
type ModalHeaderProps = {};

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
  /** Optional id for testing */
  id?: string;
  variant?: ModalVariant;
  header?: ReactNode;
};

function Modal({
  isOpen,
  onClose,
  children,
  title,
  showTitle = true,
  id,
  variant = 'modal',
  header,
}: ModalProps) {
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

  const ariaLabelledBy = showTitle ? titleId : undefined;
  const ariaLabel = ariaLabelledBy && !header ? undefined : title;
  const variantAttr = variant ?? 'modal';

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
        {header ? (
          <header
            className="hoam-modal__header"
            data-title-visible={showTitle}
          >
            {header}

            <Button
              onClick={onClose}
              aria-label="Close dialog"
              className="hoam-modal__close-button"
              iconOnly
              icon="close"
            />
          </header>
        ) : (
          <header
            className="hoam-modal__header"
            data-title-visible={showTitle}
          >
            {showTitle && <h2 id={titleId}>{title}</h2>}

            <Button
              onClick={onClose}
              aria-label="Close dialog"
              className="hoam-modal__close-button"
              iconOnly
              icon="close"
            />
          </header>
        )}

        <div className="hoam-modal__body">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
