import { useState } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Modal } from '@/components/Modal/Modal';
import { ModalStackProvider } from '@/components/Modal/ModalStackContext';

function renderWithProvider(ui: React.ReactElement) {
  return render(<ModalStackProvider>{ui}</ModalStackProvider>);
}

type HarnessProps = {
  variant?: 'modal' | 'drawer';
};

function ModalHarness({ variant = 'modal' }: Readonly<HarnessProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open modal
      </button>

      <a href="/outside">Outside link</a>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        variant={variant}
      >
        <Modal.Header>
          <Modal.Title>Example modal</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body>
          <button type="button">Primary action</button>
          <button type="button">Secondary action</button>
        </Modal.Body>

        <Modal.Footer>
          <button type="button">Footer action</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function getDialog(): HTMLElement {
  return screen.getByRole('dialog', { name: /example modal/i });
}

async function findDialog(): Promise<HTMLElement> {
  return screen.findByRole('dialog', { name: /example modal/i });
}

function getOverlay(dialog: HTMLElement): HTMLElement {
  const overlay = dialog.parentElement;

  if (!overlay) {
    throw new Error('Expected dialog to have an overlay parent');
  }

  return overlay;
}

describe('Modal', () => {
  it('does not render when closed', () => {
    renderWithProvider(<ModalHarness />);

    expect(screen.queryByRole('dialog', { name: /example modal/i })).not.toBeInTheDocument();
  });

  it('renders when opened', async () => {
    const user = userEvent.setup();

    renderWithProvider(<ModalHarness />);

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    expect(await findDialog()).toBeInTheDocument();
  });

  it('renders correctly as a drawer', async () => {
    const user = userEvent.setup();

    renderWithProvider(<ModalHarness variant="drawer" />);

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    const dialog = await findDialog();
    const overlay = getOverlay(dialog);

    expect(dialog).toBeInTheDocument();
    expect(overlay).toHaveAttribute('data-variant', 'drawer');
  });

  it('does not move focus into the modal immediately on open', async () => {
    const user = userEvent.setup();

    renderWithProvider(<ModalHarness />);

    const openButton = screen.getByRole('button', { name: /open modal/i });
    openButton.focus();

    expect(openButton).toHaveFocus();

    await user.click(openButton);

    expect(await findDialog()).toBeInTheDocument();
    expect(openButton).toHaveFocus();
  });

  it('closes when escape is pressed', async () => {
    const user = userEvent.setup();

    renderWithProvider(<ModalHarness />);

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    const dialog = await findDialog();

    expect(dialog).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(getOverlay(dialog)).toHaveAttribute('data-state', 'closing');
    });
  });

  it('closes when the backdrop is clicked', async () => {
    const user = userEvent.setup();

    renderWithProvider(<ModalHarness />);

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    const dialog = await findDialog();
    const overlay = getOverlay(dialog);
    const backdrop = overlay.querySelector('button[aria-label="Close dialog"]');

    expect(backdrop).not.toBeNull();

    fireEvent.mouseDown(backdrop as HTMLElement);

    await waitFor(() => {
      expect(overlay).toHaveAttribute('data-state', 'closing');
    });
  });

  it('does not close when clicking inside the dialog', async () => {
    const user = userEvent.setup();

    renderWithProvider(<ModalHarness />);

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    const dialog = await findDialog();

    fireEvent.mouseDown(dialog);

    expect(getDialog()).toBeInTheDocument();
  });

  it('traps focus when tabbing forwards', async () => {
    const user = userEvent.setup();

    renderWithProvider(<ModalHarness />);

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    const dialog = await findDialog();

    const closeButton = within(dialog).getByRole('button', { name: /close dialog/i });
    const primaryAction = within(dialog).getByRole('button', { name: /primary action/i });
    const secondaryAction = within(dialog).getByRole('button', { name: /secondary action/i });
    const footerAction = within(dialog).getByRole('button', { name: /footer action/i });

    closeButton.focus();
    expect(closeButton).toHaveFocus();

    await user.tab();
    expect(primaryAction).toHaveFocus();

    await user.tab();
    expect(secondaryAction).toHaveFocus();

    await user.tab();
    expect(footerAction).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();
  });

  it('traps focus when tabbing backwards', async () => {
    const user = userEvent.setup();

    renderWithProvider(<ModalHarness />);

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    const dialog = await findDialog();

    const closeButton = within(dialog).getByRole('button', { name: /close dialog/i });
    const secondaryAction = within(dialog).getByRole('button', { name: /secondary action/i });
    const footerAction = within(dialog).getByRole('button', { name: /footer action/i });

    closeButton.focus();
    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(footerAction).toHaveFocus();

    await user.tab({ shift: true });
    expect(secondaryAction).toHaveFocus();
  });

  it('enters the closing state when the close button is clicked', async () => {
    const user = userEvent.setup();

    renderWithProvider(<ModalHarness />);

    const openButton = screen.getByRole('button', { name: /open modal/i });

    await user.click(openButton);

    const dialog = await findDialog();
    const overlay = getOverlay(dialog);

    await user.click(within(dialog).getByRole('button', { name: /close dialog/i }));

    await waitFor(() => {
      expect(overlay).toHaveAttribute('data-state', 'closing');
    });
  });
});
