import FOCUSABLE_SELECTORS from '@/constants/focusable-selectors';
import React, { KeyboardEvent, ReactNode, useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
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

function Modal({ isOpen, onClose, children, title, showTitle, id }: Readonly<ModalProps>) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const instanceId = useId();
  const titleId = useId();

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null; // A bit of safety for SSR and testing

  const ariaLabel = showTitle ? undefined : title;
  const ariaLabelledBy = showTitle ? titleId : undefined;

  const handleOverlayClick = () => {};
  const handleKeyDown = () => {};

  return createPortal(
    <div
      id={id}
      className="modal-overlay"
      onClick={handleOverlayClick}
    >
      <div
        ref={dialogRef}
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {showTitle && (
          <header className="modal-header">
            <h2 id={titleId}>{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="modal-close-button"
              aria-label="Close dialog"
            >
              ×
            </button>
          </header>
        )}

        {!showTitle && (
          <button
            type="button"
            onClick={onClose}
            className="hoam-modal__close-button"
            aria-label="Close dialog"
          >
            ×
          </button>
        )}

        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
