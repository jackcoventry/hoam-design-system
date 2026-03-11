import { FOCUSABLE_SELECTORS } from '@/constants/focusable-selectors';
import { RefObject, useEffect, useRef } from 'react';

interface UseFocusTrapOptions<T extends HTMLElement = HTMLElement> {
  containerRef: RefObject<T | null>;
  active: boolean;
  onEscape?: () => void;
}

function getFocusableElements(root: HTMLElement): HTMLElement[] {
  const nodes = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));

  // Only visible, actually focusable
  return nodes.filter(
    (el) =>
      !el.hasAttribute('disabled') &&
      el.tabIndex !== -1 &&
      !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
  );
}

export function useFocusTrap({ containerRef, active, onEscape }: UseFocusTrapOptions) {
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;

    // Save the element that had focus before opening
    lastFocusedRef.current = (document.activeElement as HTMLElement) ?? null;

    // If focus is outside, move it to the first item
    const focusables = getFocusableElements(container);
    if (focusables[0] && !container.contains(document.activeElement)) {
      focusables[0].focus();
    } else if (!focusables.length) {
      // As a backup make the container focusable
      container.tabIndex = -1;
      container.focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onEscape?.();
        return;
      }

      if (e.key !== 'Tab') return;

      const items = getFocusableElements(container);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }

      const first = items[0];
      const last = items.at(-1);
      const current = document.activeElement as HTMLElement | null;

      // Cycle focus
      if (!e.shiftKey && current === last) {
        e.preventDefault();
        first?.focus();
      } else if (e.shiftKey && (current === first || !container.contains(current))) {
        e.preventDefault();
        last?.focus();
      }
    };

    const onFocusIn = (e: FocusEvent) => {
      if (!container.contains(e.target as Node)) {
        const items = getFocusableElements(container);
        if (items[0]) items[0].focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('focusin', onFocusIn, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', onFocusIn, true);
      // Restore focus to the opener
      lastFocusedRef.current?.focus?.();
    };
  }, [active, containerRef, onEscape]);
}
