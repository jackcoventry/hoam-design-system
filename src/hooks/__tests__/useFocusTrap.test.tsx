import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode, RefObject } from 'react';
import { vi } from 'vitest';

import { useFocusTrap } from '@/hooks/useFocusTrap';

vi.mock('@/constants/focusable-selectors', () => ({
  FOCUSABLE_SELECTORS: 'button, [href], input, select, textarea, [tabindex]',
}));

type HarnessProps = {
  active: boolean;
  onEscape?: () => void;
  containerRef?: RefObject<HTMLDivElement | null>;
  children?: ReactNode;
};

function makeElementVisible(element: HTMLElement) {
  Object.defineProperty(element, 'offsetWidth', {
    configurable: true,
    get: () => 100,
  });

  Object.defineProperty(element, 'offsetHeight', {
    configurable: true,
    get: () => 20,
  });

  Object.defineProperty(element, 'getClientRects', {
    configurable: true,
    value: () => [{ width: 100, height: 20 }],
  });
}

function FocusTrapHarness({
  active,
  onEscape,
  containerRef: externalRef,
  children,
}: Readonly<HarnessProps>) {
  const fallbackRef = createRef<HTMLDivElement>();
  const containerRef = externalRef ?? fallbackRef;
  const focusTrapOptions = onEscape
    ? {
        containerRef,
        active,
        onEscape,
      }
    : {
        containerRef,
        active,
      };

  useFocusTrap(focusTrapOptions);
  return (
    <div>
      <button type="button">Outside before</button>
      <div ref={containerRef}>{children}</div>
      <button type="button">Outside after</button>
    </div>
  );
}

describe('useFocusTrap', () => {
  it('focuses the container when there are no focusable elements', () => {
    const containerRef = createRef<HTMLDivElement>();

    render(
      <FocusTrapHarness
        active
        containerRef={containerRef}
      >
        <div>Only content</div>
      </FocusTrapHarness>
    );

    const container = containerRef.current;

    expect(container).not.toBeNull();
    expect(container).toHaveAttribute('tabindex', '-1');
    expect(container).toHaveFocus();
  });

  it('calls onEscape when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onEscape = vi.fn();

    render(
      <FocusTrapHarness
        active
        onEscape={onEscape}
      >
        <button type="button">First inside</button>
      </FocusTrapHarness>
    );

    const firstInside = screen.getByRole('button', { name: 'First inside' });
    makeElementVisible(firstInside);
    firstInside.focus();

    await user.keyboard('{Escape}');

    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('cycles focus from the last element to the first on Tab', async () => {
    const user = userEvent.setup();

    render(
      <FocusTrapHarness active>
        <button type="button">First inside</button>
        <button type="button">Last inside</button>
      </FocusTrapHarness>
    );

    const first = screen.getByRole('button', { name: 'First inside' });
    const last = screen.getByRole('button', { name: 'Last inside' });

    makeElementVisible(first);
    makeElementVisible(last);

    last.focus();
    await user.keyboard('{Tab}');

    expect(first).toHaveFocus();
  });

  it('cycles focus from the first element to the last on Shift+Tab', async () => {
    const user = userEvent.setup();

    render(
      <FocusTrapHarness active>
        <button type="button">First inside</button>
        <button type="button">Last inside</button>
      </FocusTrapHarness>
    );

    const first = screen.getByRole('button', { name: 'First inside' });
    const last = screen.getByRole('button', { name: 'Last inside' });

    makeElementVisible(first);
    makeElementVisible(last);

    first.focus();
    await user.keyboard('{Shift>}{Tab}{/Shift}');

    expect(last).toHaveFocus();
  });

  it('moves focus back inside when focus escapes the container', () => {
    render(
      <FocusTrapHarness active>
        <button type="button">First inside</button>
        <button type="button">Second inside</button>
      </FocusTrapHarness>
    );

    const first = screen.getByRole('button', { name: 'First inside' });
    const second = screen.getByRole('button', { name: 'Second inside' });
    const outsideAfter = screen.getByRole('button', { name: 'Outside after' });

    makeElementVisible(first);
    makeElementVisible(second);
    makeElementVisible(outsideAfter);

    outsideAfter.focus();
    outsideAfter.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

    expect(first).toHaveFocus();
  });

  it('restores focus to the previously focused element when deactivated', () => {
    const opener = document.createElement('button');
    opener.textContent = 'Opener';
    document.body.appendChild(opener);
    opener.focus();

    const { rerender } = render(
      <FocusTrapHarness active>
        <button type="button">First inside</button>
      </FocusTrapHarness>
    );

    const first = screen.getByRole('button', { name: 'First inside' });
    makeElementVisible(first);
    first.focus();

    rerender(
      <FocusTrapHarness active={false}>
        <button type="button">First inside</button>
      </FocusTrapHarness>
    );

    expect(opener).toHaveFocus();
  });

  it('does nothing when inactive', () => {
    const opener = document.createElement('button');
    opener.textContent = 'Opener';
    document.body.appendChild(opener);
    opener.focus();

    render(
      <FocusTrapHarness active={false}>
        <button type="button">First inside</button>
      </FocusTrapHarness>
    );

    expect(opener).toHaveFocus();
  });
});
