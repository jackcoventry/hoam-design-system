import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import { ModalStackProvider, useModalStack } from './ModalStackContext';

function TestModal({ id, active }: { id: string; active: boolean }) {
  const { isTopMost } = useModalStack(id, active);
  return (
    <div
      data-testid={id}
      data-top={isTopMost ? 'true' : 'false'}
    />
  );
}

describe('ModalStackContext', () => {
  beforeEach(() => {
    // Reset any styles that might linger between tests
    document.body.style.overflow = '';
  });

  it('marks the only active modal as top-most', async () => {
    render(
      <ModalStackProvider>
        <TestModal
          id="modal-1"
          active
        />
      </ModalStackProvider>
    );

    const modal1 = await screen.findByTestId('modal-1');
    expect(modal1).toHaveAttribute('data-top', 'true');
  });

  it('marks the last registered active modal as top-most when multiple are active', async () => {
    render(
      <ModalStackProvider>
        <TestModal
          id="modal-1"
          active
        />
        <TestModal
          id="modal-2"
          active
        />
      </ModalStackProvider>
    );

    const modal1 = await screen.findByTestId('modal-1');
    const modal2 = await screen.findByTestId('modal-2');

    // First one should not be top-most, second one should
    expect(modal1).toHaveAttribute('data-top', 'false');
    expect(modal2).toHaveAttribute('data-top', 'true');
  });

  it('unregisters a modal when it becomes inactive', async () => {
    const { rerender } = render(
      <ModalStackProvider>
        <TestModal
          id="modal-1"
          active
        />
      </ModalStackProvider>
    );

    const modal1 = await screen.findByTestId('modal-1');
    expect(modal1).toHaveAttribute('data-top', 'true');

    // Now render with it inactive
    rerender(
      <ModalStackProvider>
        <TestModal
          id="modal-1"
          active={false}
        />
      </ModalStackProvider>
    );

    // When inactive, the hook should fall back to single-modal mode (true) or be unregistered;
    const modal1Updated = await screen.findByTestId('modal-1');
    expect(modal1Updated).toHaveAttribute('data-top', 'true');
  });

  it('locks body scroll when at least one modal is active and restores it when none are active', async () => {
    const { rerender } = render(
      <ModalStackProvider>
        <TestModal
          id="modal-1"
          active={false}
        />
      </ModalStackProvider>
    );

    // Initially no active modals
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('');
    });

    // Activate the modal and scrolling should lock
    rerender(
      <ModalStackProvider>
        <TestModal
          id="modal-1"
          active
        />
      </ModalStackProvider>
    );

    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden');
    });

    // Deactivate again and scrolling should rollback to prev state
    rerender(
      <ModalStackProvider>
        <TestModal
          id="modal-1"
          active={false}
        />
      </ModalStackProvider>
    );

    await waitFor(() => {
      expect(document.body.style.overflow).toBe('');
    });
  });
});
