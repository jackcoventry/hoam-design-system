/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, {
  KeyboardEvent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/Button';
import { useModalStack } from '@/components/Modal/ModalStackContext';
import { useMessages } from '@/hooks/useMessages';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { logger } from '@/utils/logger';
import { FOCUSABLE_SELECTORS } from '@/constants/focusable-selectors';

import styles from '@/components/Modal/Modal.module.css';
import typography from '@/styles/Typography.module.css';

export const Variants = ['modal', 'drawer'] as const;
export type ModalVariant = (typeof Variants)[number];
type ModalPhase = 'closed' | 'opening' | 'open' | 'closing';

type ModalContextValue = {
  titleId: string;
  close: () => void;
};

const ModalContext = React.createContext<ModalContextValue | null>(null);

function useModalContext(componentName: string): ModalContextValue {
  const ctx = useContext(ModalContext);

  logger.invariant(ctx, `${componentName} must be used within <Modal>`);

  return ctx;
}

export type ModalRootProps = {
  isOpen: boolean;
  onClose?: () => void;
  'aria-label'?: string;
  id?: string;
  variant?: ModalVariant;
};

export type ModalSectionProps = PropsWithChildren<{
  padded?: boolean;
}>;

export type ModalTitleProps = PropsWithChildren;

export type ModalCloseButtonProps = {
  'aria-label'?: string;
  callback?: () => void;
};

function ModalRoot({
  isOpen,
  onClose,
  children,
  'aria-label': ariaLabel,
  id,
  variant = 'modal',
}: Readonly<PropsWithChildren<ModalRootProps>>) {
  const t = useMessages('modal');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const hasOpenedRef = useRef(isOpen);
  const phaseRafRef = useRef<number | null>(null);

  const [phase, setPhase] = useState<ModalPhase>(isOpen ? 'open' : 'closed');
  const prefersReducedMotion = usePrefersReducedMotion();

  const instanceId = useId();
  const titleId = useId();

  const { isTopMost } = useModalStack(instanceId, isOpen);

  const isRendered = phase !== 'closed';

  const close = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const clearPhaseRaf = useCallback(() => {
    if (phaseRafRef.current !== null) {
      globalThis.cancelAnimationFrame(phaseRafRef.current);
      phaseRafRef.current = null;
    }
  }, []);

  const focusElement = useCallback((element: HTMLElement | null) => {
    if (!element) return;

    element.focus({ preventScroll: true });
  }, []);

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!dialogRef.current) return [];

    return Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(
      (el) =>
        !el.hasAttribute('disabled') &&
        el.tabIndex !== -1 &&
        el.getAttribute('aria-hidden') !== 'true'
    );
  }, []);

  const focusFirstElement = useCallback(() => {
    const items = getFocusableElements();

    if (items.length > 0) {
      focusElement(items[0] ?? null);
      return;
    }

    focusElement(dialogRef.current);
  }, [focusElement, getFocusableElements]);

  useEffect(() => {
    clearPhaseRaf();

    const wasOpen = hasOpenedRef.current;
    hasOpenedRef.current = isOpen;

    if (!wasOpen && isOpen) {
      lastFocusedRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;

      if (prefersReducedMotion) {
        phaseRafRef.current = globalThis.requestAnimationFrame(() => {
          setPhase('open');
          phaseRafRef.current = null;
        });

        return clearPhaseRaf;
      }

      phaseRafRef.current = globalThis.requestAnimationFrame(() => {
        setPhase('opening');
        phaseRafRef.current = null;
      });

      return clearPhaseRaf;
    }

    if (wasOpen && !isOpen) {
      if (prefersReducedMotion) {
        phaseRafRef.current = globalThis.requestAnimationFrame(() => {
          setPhase('closed');
          phaseRafRef.current = null;
        });

        return clearPhaseRaf;
      }

      phaseRafRef.current = globalThis.requestAnimationFrame(() => {
        setPhase((current) => (current === 'closed' ? 'closed' : 'closing'));
        phaseRafRef.current = null;
      });

      return clearPhaseRaf;
    }

    return clearPhaseRaf;
  }, [clearPhaseRaf, isOpen, prefersReducedMotion]);

  useEffect(() => {
    if (phase !== 'closed' || isOpen) return;

    focusElement(lastFocusedRef.current);
  }, [focusElement, isOpen, phase]);

  useEffect(() => {
    if (phase !== 'open' || !isTopMost) return;

    const raf = globalThis.requestAnimationFrame(() => {
      focusFirstElement();
    });

    return () => {
      globalThis.cancelAnimationFrame(raf);
    };
  }, [focusFirstElement, isTopMost, phase]);

  useEffect(() => clearPhaseRaf, [clearPhaseRaf]);

  useEffect(() => {
    if (!isRendered || !isTopMost) return;

    const siblings = Array.from(document.body.children).filter((node) => node !== rootRef.current);

    for (const element of siblings) {
      if (element instanceof HTMLElement) {
        element.inert = true;
        element.setAttribute('aria-hidden', 'true');
      }
    }

    return () => {
      for (const element of siblings) {
        if (element instanceof HTMLElement) {
          element.inert = false;
          element.removeAttribute('aria-hidden');
        }
      }
    };
  }, [isRendered, isTopMost]);

  useEffect(() => {
    if (!isRendered || !isTopMost) return;

    const handleDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      event.preventDefault();
      close();
    };

    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [close, isRendered, isTopMost]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isRendered || !isTopMost) return;
    if (event.key !== 'Tab') return;

    const items = getFocusableElements();

    if (items.length === 0) {
      event.preventDefault();
      focusElement(dialogRef.current);
      return;
    }

    const activeElement = document.activeElement as HTMLElement | null;
    const currentIndex = activeElement ? items.indexOf(activeElement) : -1;
    const lastIndex = items.length - 1;

    const nextIndex = event.shiftKey
      ? currentIndex <= 0
        ? lastIndex
        : currentIndex - 1
      : currentIndex === lastIndex
        ? 0
        : currentIndex + 1;

    event.preventDefault();
    focusElement(items[nextIndex] ?? null);
  };

  const handleAnimationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.target !== dialogRef.current) return;

    if (phase === 'opening') {
      setPhase('open');
      return;
    }

    if (phase === 'closing') {
      setPhase('closed');
    }
  };

  const contextValue = useMemo<ModalContextValue>(
    () => ({
      titleId,
      close,
    }),
    [titleId, close]
  );

  if (typeof document === 'undefined' || !isRendered) return null;

  return createPortal(
    <div
      ref={rootRef}
      id={id}
      className={styles.root}
      data-variant={variant}
      data-state={phase}
    >
      <button
        type="button"
        className={styles.backdrop}
        aria-label={t.close}
        tabIndex={-1}
        onClick={close}
      />
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : titleId}
        onKeyDown={handleKeyDown}
        onAnimationEnd={handleAnimationEnd}
        tabIndex={-1}
      >
        <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>
      </div>
    </div>,
    document.body
  );
}

function ModalHeader({ children, padded = true }: Readonly<ModalSectionProps>) {
  return (
    <header
      className={styles.header}
      data-padded={padded ? 'true' : 'false'}
    >
      {children}
    </header>
  );
}

function ModalTitle({ children }: Readonly<ModalTitleProps>) {
  const { titleId } = useModalContext('Modal.Title');

  return (
    <h2
      id={titleId}
      className={typography.heading}
    >
      {children}
    </h2>
  );
}

function ModalCloseButton(props: Readonly<ModalCloseButtonProps>) {
  const t = useMessages('modal');
  const { 'aria-label': ariaLabel = t.close, callback } = props;
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
      className={styles.closeButton}
      iconOnly
      icon="close"
      size="small"
    />
  );
}

function ModalBody({ children, padded = true }: Readonly<ModalSectionProps>) {
  return (
    <div
      className={styles.body}
      data-padded={padded ? 'true' : 'false'}
    >
      {children}
    </div>
  );
}

function ModalFooter({ children, padded = true }: Readonly<ModalSectionProps>) {
  return (
    <footer
      className={styles.footer}
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
