import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import Modal from './Modal';
import { ModalStackProvider } from './ModalStackContext';

function renderWithProvider(ui: React.ReactElement) {
  return render(<ModalStackProvider>{ui}</ModalStackProvider>);
}

describe('Modal', () => {
  it('does not render anything before first open when isOpen is false', () => {
    const { queryByRole } = renderWithProvider(
      <Modal
        isOpen={false}
        title="My modal"
      >
        <button>Inside</button>
      </Modal>
    );

    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a dialog with the correct accessible name when open', () => {
    renderWithProvider(
      <Modal
        isOpen
        title="My modal"
      >
        <button>Inside</button>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { name: 'My modal' });
    expect(dialog).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();

    renderWithProvider(
      <Modal
        isOpen
        title="My modal"
        onClose={onClose}
      >
        <button>Inside</button>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { name: 'My modal' });

    fireEvent.keyDown(dialog, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking on the overlay (but not on the dialog itself)', async () => {
    const onClose = vi.fn();

    renderWithProvider(
      <Modal
        isOpen
        title="My modal"
        onClose={onClose}
      >
        <button>Inside</button>
      </Modal>
    );

    const overlay = screen.getByRole('none'); // the outer overlay div
    const dialog = screen.getByRole('dialog', { name: 'My modal' });

    // Click inside the dialog: should NOT close
    await userEvent.click(dialog);
    expect(onClose).not.toHaveBeenCalled();

    // Click on the overlay background: SHOULD close
    await userEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('moves focus into the dialog when opened and restores focus to trigger when closed', async () => {
    const user = userEvent.setup();

    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
          >
            Open modal
          </button>
          <Modal
            isOpen={open}
            onClose={() => setOpen(false)}
            title="My modal"
          >
            <button>First focusable</button>
            <button>Second focusable</button>
          </Modal>
        </>
      );
    }

    renderWithProvider(<Harness />);

    const openButton = screen.getByRole('button', { name: /open modal/i });

    // Focus the trigger and open the modal
    openButton.focus();
    expect(openButton).toHaveFocus();

    await user.click(openButton);

    const firstFocusable = await screen.findByRole('button', {
      name: 'First focusable',
    });
    expect(firstFocusable).toHaveFocus();

    // Press Escape to close; focus should return to trigger
    await user.keyboard('{Escape}');
    expect(openButton).toHaveFocus();
  });

  it('accepts variant="drawer" without breaking basic behaviour', () => {
    // This test just ensures the prop is accepted and the dialog renders.
    renderWithProvider(
      <Modal
        isOpen
        title="Drawer title"
        variant="drawer"
      >
        <button>Inside</button>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { name: 'Drawer title' });
    expect(dialog).toBeInTheDocument();
  });
});
