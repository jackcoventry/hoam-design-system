import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { PropsWithChildren, ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalRoot,
  ModalTitle,
} from './Modal';

type ModalMessages = {
  label: string;
  close: string;
};

type OtherMessages = Record<string, string>;

type ModalStackValue = {
  isTopMost: boolean;
};

const mockUseModalStack = vi.fn<(instanceId: string, isOpen: boolean) => ModalStackValue>();
const mockUseMessages = vi.fn<(namespace: string) => ModalMessages | OtherMessages>();
const mockUsePrefersReducedMotion = vi.fn<() => boolean>();

const invariantMock = vi.fn((condition: unknown, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
});

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    onClick,
    'aria-label': ariaLabel,
    type = 'button',
    className,
  }: PropsWithChildren<{
    onClick?: () => void;
    'aria-label'?: string;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
  }>) => (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/Modal/ModalStackContext', () => ({
  useModalStack: (instanceId: string, isOpen: boolean) => mockUseModalStack(instanceId, isOpen),
}));

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => mockUseMessages(namespace),
}));

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => mockUsePrefersReducedMotion(),
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    invariant: (condition: unknown, message: string) => invariantMock(condition, message),
  },
}));

vi.mock('@/constants/focusable-selectors', () => ({
  FOCUSABLE_SELECTORS: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
}));

function getRequiredElement<T>(value: T | undefined | null, message: string): T {
  if (value == null) {
    throw new Error(message);
  }

  return value;
}

let rafQueue: FrameRequestCallback[] = [];
let rafId = 0;

async function flushRafQueue(): Promise<void> {
  const queue = [...rafQueue];
  rafQueue = [];

  await act(async () => {
    for (const callback of queue) {
      callback(0);
    }
    await Promise.resolve();
  });
}

describe('Modal', () => {
  beforeEach(() => {
    rafQueue = [];
    rafId = 0;

    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((callback) => {
      rafQueue.push(callback);
      rafId += 1;
      return rafId;
    });

    vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {});

    mockUseModalStack.mockReturnValue({ isTopMost: true });
    mockUsePrefersReducedMotion.mockReturnValue(false);

    mockUseMessages.mockImplementation((namespace: string) => {
      if (namespace === 'modal') {
        return {
          label: 'Dialog',
          close: 'Close modal',
        };
      }

      return {};
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  function renderMountedOpenModal(
    props: Partial<React.ComponentProps<typeof ModalRoot>> = {},
    children?: ReactNode
  ) {
    return render(
      <ModalRoot
        isOpen
        {...(props.onClose ? { onClose: props.onClose } : {})}
        {...(props['aria-label'] ? { 'aria-label': props['aria-label'] } : {})}
        {...(props.variant ? { variant: props.variant } : {})}
      >
        {children ?? (
          <>
            <ModalHeader>
              <ModalTitle>Example modal</ModalTitle>
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody>
              <button type="button">First action</button>
              <button type="button">Second action</button>
            </ModalBody>
            <ModalFooter>
              <button type="button">Footer action</button>
            </ModalFooter>
          </>
        )}
      </ModalRoot>
    );
  }

  it('renders nothing when closed', () => {
    render(
      <ModalRoot isOpen={false}>
        <ModalBody>Hidden content</ModalBody>
      </ModalRoot>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a dialog in the document body immediately when mounted open', () => {
    renderMountedOpenModal();

    const dialog = screen.getByRole('dialog', { name: 'Example modal' });
    expect(dialog).toBeInTheDocument();

    const root = dialog.closest('[data-variant]');
    expect(root).not.toBeNull();
    expect(root).toHaveAttribute('data-state', 'open');
  });

  it('uses aria-labelledby by default when no aria-label is provided', () => {
    renderMountedOpenModal();

    const dialog = screen.getByRole('dialog', { name: 'Example modal' });
    const title = screen.getByRole('heading', { level: 2, name: 'Example modal' });

    expect(dialog).toHaveAttribute('aria-labelledby', title.getAttribute('id'));
    expect(dialog).not.toHaveAttribute('aria-label');
  });

  it('falls back to a translated aria-label when no title or aria-label is provided', () => {
    render(
      <ModalRoot isOpen>
        <ModalBody>Untitled modal content</ModalBody>
      </ModalRoot>
    );

    const dialog = screen.getByRole('dialog', { name: 'Dialog' });

    expect(dialog).toHaveAttribute('aria-label', 'Dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('uses aria-label instead of aria-labelledby when provided', () => {
    renderMountedOpenModal({ 'aria-label': 'Custom modal label' });

    const dialog = screen.getByRole('dialog', { name: 'Custom modal label' });
    expect(dialog).toHaveAttribute('aria-label', 'Custom modal label');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('passes variant to the root element', () => {
    renderMountedOpenModal({ variant: 'drawer' });

    const dialog = screen.getByRole('dialog', { name: 'Example modal' });
    const root = dialog.closest('[data-variant]');

    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute('data-variant', 'drawer');
  });

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn();

    renderMountedOpenModal({ onClose });

    const dialog = screen.getByRole('dialog', { name: 'Example modal' });
    const root = dialog.closest('[data-variant]');
    const backdropButton = getRequiredElement(
      root?.querySelector('button[aria-hidden="true"]'),
      'Expected backdrop button to exist'
    );

    expect(backdropButton).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Close modal' })).toHaveLength(1);

    fireEvent.click(backdropButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls the close button callback and onClose when Modal.CloseButton is clicked', () => {
    const onClose = vi.fn();
    const callback = vi.fn();

    render(
      <ModalRoot
        isOpen
        onClose={onClose}
      >
        <ModalHeader>
          <ModalTitle>Example modal</ModalTitle>
          <ModalCloseButton callback={callback} />
        </ModalHeader>
      </ModalRoot>
    );

    const closeButton = screen.getByRole('button', { name: 'Close modal' });

    fireEvent.click(closeButton);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed and the modal is topmost', () => {
    const onClose = vi.fn();

    renderMountedOpenModal({ onClose });

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on Escape when the modal is not topmost', () => {
    const onClose = vi.fn();
    mockUseModalStack.mockReturnValue({ isTopMost: false });

    renderMountedOpenModal({ onClose });

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('focuses the first focusable element after mount when open and topmost', async () => {
    renderMountedOpenModal();

    await flushRafQueue();

    const closeButton = screen.getByRole('button', { name: 'Close modal' });

    expect(closeButton).toHaveFocus();
  });

  it('traps focus when pressing Tab', async () => {
    renderMountedOpenModal();

    await flushRafQueue();

    const dialog = screen.getByRole('dialog', { name: 'Example modal' });
    const closeButton = screen.getByRole('button', { name: 'Close modal' });
    const firstAction = screen.getByRole('button', { name: 'First action' });
    const secondAction = screen.getByRole('button', { name: 'Second action' });
    const footerAction = screen.getByRole('button', { name: 'Footer action' });

    closeButton.focus();
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(firstAction).toHaveFocus();

    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(secondAction).toHaveFocus();

    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(footerAction).toHaveFocus();

    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(closeButton).toHaveFocus();
  });

  it('traps focus backwards with Shift+Tab', async () => {
    renderMountedOpenModal();

    await flushRafQueue();

    const dialog = screen.getByRole('dialog', { name: 'Example modal' });
    const closeButton = screen.getByRole('button', { name: 'Close modal' });
    const footerAction = screen.getByRole('button', { name: 'Footer action' });

    closeButton.focus();
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });

    expect(footerAction).toHaveFocus();
  });

  it('focuses the dialog itself when no focusable elements exist', async () => {
    render(
      <ModalRoot isOpen>
        <ModalBody>
          <p>No controls here</p>
        </ModalBody>
      </ModalRoot>
    );

    await flushRafQueue();

    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Tab' });

    expect(dialog).toHaveFocus();
  });

  it('restores focus to the previously focused element when closing with reduced motion', async () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);

    const trigger = document.createElement('button');
    trigger.textContent = 'Open modal';
    document.body.appendChild(trigger);

    try {
      trigger.focus();

      const { rerender } = render(
        <ModalRoot isOpen={false}>
          <ModalHeader>
            <ModalTitle>Example modal</ModalTitle>
          </ModalHeader>
        </ModalRoot>
      );

      rerender(
        <ModalRoot isOpen>
          <ModalHeader>
            <ModalTitle>Example modal</ModalTitle>
          </ModalHeader>
        </ModalRoot>
      );

      await flushRafQueue();

      rerender(
        <ModalRoot isOpen={false}>
          <ModalHeader>
            <ModalTitle>Example modal</ModalTitle>
          </ModalHeader>
        </ModalRoot>
      );

      await flushRafQueue();

      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    } finally {
      trigger.remove();
    }
  });

  it('applies opening and closing phases when transitioning without reduced motion', async () => {
    const { rerender } = render(
      <ModalRoot isOpen={false}>
        <ModalHeader>
          <ModalTitle>Example modal</ModalTitle>
        </ModalHeader>
      </ModalRoot>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(
      <ModalRoot isOpen>
        <ModalHeader>
          <ModalTitle>Example modal</ModalTitle>
        </ModalHeader>
      </ModalRoot>
    );

    await flushRafQueue();

    const openingDialog = screen.getByRole('dialog', { name: 'Example modal' });
    const openingRoot = openingDialog.closest('[data-variant]');

    expect(openingRoot).not.toBeNull();
    expect(openingRoot).toHaveAttribute('data-state', 'opening');

    rerender(
      <ModalRoot isOpen={false}>
        <ModalHeader>
          <ModalTitle>Example modal</ModalTitle>
        </ModalHeader>
      </ModalRoot>
    );

    await flushRafQueue();

    const closingDialog = screen.getByRole('dialog', { name: 'Example modal' });
    const closingRoot = closingDialog.closest('[data-variant]');

    expect(closingRoot).not.toBeNull();
    expect(closingRoot).toHaveAttribute('data-state', 'closing');
  });

  it('opens after a false to true transition with reduced motion', async () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);

    const { rerender } = render(
      <ModalRoot isOpen={false}>
        <ModalHeader>
          <ModalTitle>Reduced motion modal</ModalTitle>
        </ModalHeader>
      </ModalRoot>
    );

    rerender(
      <ModalRoot isOpen>
        <ModalHeader>
          <ModalTitle>Reduced motion modal</ModalTitle>
        </ModalHeader>
      </ModalRoot>
    );

    await flushRafQueue();

    const dialog = screen.getByRole('dialog', { name: 'Reduced motion modal' });
    const root = dialog.closest('[data-variant]');

    expect(root).not.toBeNull();
    expect(root).toHaveAttribute('data-state', 'open');
  });

  it('restores previous sibling inert and aria-hidden values after closing', async () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);

    const siblingWithAria = document.createElement('div');
    siblingWithAria.setAttribute('aria-hidden', 'false');
    siblingWithAria.inert = false;

    const siblingWithoutAria = document.createElement('div');
    siblingWithoutAria.inert = true;

    document.body.appendChild(siblingWithAria);
    document.body.appendChild(siblingWithoutAria);

    try {
      const { rerender } = render(
        <ModalRoot isOpen={false}>
          <ModalHeader>
            <ModalTitle>State restore modal</ModalTitle>
          </ModalHeader>
        </ModalRoot>
      );

      rerender(
        <ModalRoot isOpen>
          <ModalHeader>
            <ModalTitle>State restore modal</ModalTitle>
          </ModalHeader>
        </ModalRoot>
      );

      await flushRafQueue();

      expect(siblingWithAria.getAttribute('aria-hidden')).toBe('true');
      expect(siblingWithAria.inert).toBe(true);
      expect(siblingWithoutAria.getAttribute('aria-hidden')).toBe('true');
      expect(siblingWithoutAria.inert).toBe(true);

      rerender(
        <ModalRoot isOpen={false}>
          <ModalHeader>
            <ModalTitle>State restore modal</ModalTitle>
          </ModalHeader>
        </ModalRoot>
      );

      await flushRafQueue();

      expect(siblingWithAria.getAttribute('aria-hidden')).toBe('false');
      expect(siblingWithAria.inert).toBe(false);
      expect(siblingWithoutAria.hasAttribute('aria-hidden')).toBe(false);
      expect(siblingWithoutAria.inert).toBe(true);
    } finally {
      siblingWithAria.remove();
      siblingWithoutAria.remove();
    }
  });

  it('keeps the state open when mounted open with reduced motion', () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);

    render(
      <ModalRoot isOpen>
        <ModalHeader>
          <ModalTitle>Reduced motion modal</ModalTitle>
        </ModalHeader>
      </ModalRoot>
    );

    const dialog = screen.getByRole('dialog', { name: 'Reduced motion modal' });
    const root = dialog.closest('[data-variant]');

    expect(root).not.toBeNull();
    expect(root).toHaveAttribute('data-state', 'open');
  });

  it('sets header, body and footer padded attributes', () => {
    const { container } = render(
      <>
        <ModalHeader padded={false}>Header</ModalHeader>
        <ModalBody padded={false}>Body</ModalBody>
        <ModalFooter padded={false}>Footer</ModalFooter>
      </>
    );

    const header = container.querySelector('header');
    const body = container.querySelector('div[data-padded="false"]');
    const footer = container.querySelector('footer');

    expect(header).toHaveAttribute('data-padded', 'false');
    expect(body).toHaveAttribute('data-padded', 'false');
    expect(footer).toHaveAttribute('data-padded', 'false');
  });

  it('throws when Modal.Title is used outside Modal', () => {
    expect(() => render(<ModalTitle>Outside title</ModalTitle>)).toThrow(
      'Modal.Title must be used within <Modal>'
    );
  });

  it('throws when Modal.CloseButton is used outside Modal', () => {
    expect(() => render(<ModalCloseButton />)).toThrow(
      'Modal.CloseButton must be used within <Modal>'
    );
  });

  it('exports compound subcomponents on Modal', () => {
    expect(Modal.Header).toBe(ModalHeader);
    expect(Modal.Title).toBe(ModalTitle);
    expect(Modal.CloseButton).toBe(ModalCloseButton);
    expect(Modal.Body).toBe(ModalBody);
    expect(Modal.Footer).toBe(ModalFooter);
  });
});
