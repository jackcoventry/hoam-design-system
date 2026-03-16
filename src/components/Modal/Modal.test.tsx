import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/Modal';

vi.mock('@/components/Modal/ModalStackContext', () => ({
  useModalStack: () => ({
    isTopMost: true,
  }),
}));

beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function showModal() {
      this.setAttribute('open', '');
    };
  }

  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function close() {
      this.removeAttribute('open');
    };
  }
});

function renderBasicModal(props?: Partial<React.ComponentProps<typeof Modal>>) {
  const onClose = vi.fn();

  render(
    <Modal
      isOpen
      onClose={onClose}
      {...props}
    >
      <ModalHeader>
        <ModalTitle>Test modal</ModalTitle>
        <ModalCloseButton />
      </ModalHeader>

      <ModalBody>
        <button type="button">First action</button>
        <button type="button">Second action</button>
      </ModalBody>

      <ModalFooter>
        <p>Footer content</p>
      </ModalFooter>
    </Modal>
  );

  return { onClose };
}

describe('Modal', () => {
  it('renders when open', async () => {
    renderBasicModal();

    expect(screen.getByText('Test modal')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();

    const dialog = document.body.querySelector('dialog');
    expect(dialog).toBeInTheDocument();

    await waitFor(() => {
      expect(dialog).toHaveAttribute('open');
    });
  });

  it('does not open when closed', () => {
    render(
      <Modal
        isOpen={false}
        ariaLabel="Closed modal"
      >
        <ModalBody>
          <p>Hidden content</p>
        </ModalBody>
      </Modal>
    );

    const dialog = document.body.querySelector('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).not.toHaveAttribute('open');
  });

  it('uses aria-label when no title is provided', () => {
    render(
      <Modal
        isOpen
        ariaLabel="Accessible modal label"
      >
        <ModalHeader>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <p>Hello</p>
        </ModalBody>
      </Modal>
    );

    const dialog = document.body.querySelector('dialog');
    expect(dialog).toHaveAttribute('aria-label', 'Accessible modal label');
  });

  it('wires title to aria-labelledby when Modal.Title is used', () => {
    renderBasicModal();

    const dialog = document.body.querySelector('dialog');
    const title = screen.getByText('Test modal');

    expect(title).toHaveAttribute('id');
    expect(dialog).toHaveAttribute('aria-labelledby', title.getAttribute('id'));
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const { onClose } = renderBasicModal();

    await user.click(screen.getByRole('button', { name: /close dialog/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls both callback and onClose when Modal.CloseButton callback is provided', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const callback = vi.fn();

    render(
      <Modal
        isOpen
        onClose={onClose}
      >
        <ModalHeader>
          <ModalTitle>Test modal</ModalTitle>
          <ModalCloseButton callback={callback} />
        </ModalHeader>
        <ModalBody>
          <p>Hello</p>
        </ModalBody>
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: /close dialog/i }));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is triggered via cancel event', () => {
    const { onClose } = renderBasicModal();

    const dialog = document.body.querySelector('dialog');
    expect(dialog).toBeInTheDocument();

    dialog?.dispatchEvent(
      new Event('cancel', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const { onClose } = renderBasicModal();

    const dialog = document.body.querySelector('dialog');
    expect(dialog).toBeInTheDocument();

    if (dialog) {
      await user.click(dialog);
    }

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('focuses the first focusable element when opened', async () => {
    renderBasicModal();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /close dialog/i })).toHaveFocus();
    });
  });

  it('traps focus with Tab', async () => {
    const user = userEvent.setup();
    renderBasicModal();

    const closeButton = screen.getByRole('button', { name: /close dialog/i });
    const firstAction = screen.getByRole('button', { name: 'First action' });
    const secondAction = screen.getByRole('button', { name: 'Second action' });

    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });

    await user.tab();
    expect(firstAction).toHaveFocus();

    await user.tab();
    expect(secondAction).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();
  });

  it('traps focus backwards with Shift+Tab', async () => {
    const user = userEvent.setup();
    renderBasicModal();

    const closeButton = screen.getByRole('button', { name: /close dialog/i });
    const secondAction = screen.getByRole('button', { name: 'Second action' });

    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });

    await user.tab({ shift: true });
    expect(secondAction).toHaveFocus();

    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'First action' })).toHaveFocus();
  });

  it('throws if Modal.Title is used outside Modal', () => {
    expect(() => render(<ModalTitle>Orphan title</ModalTitle>)).toThrow(
      'Modal.Title must be used within <Modal>'
    );
  });

  it('throws if Modal.CloseButton is used outside Modal', () => {
    expect(() => render(<ModalCloseButton />)).toThrow(
      'Modal.CloseButton must be used within <Modal>'
    );
  });
});
