import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ModalStackProvider, useModalStack } from '@/components/Modal/ModalStackContext';

type TestModalProps = {
  id: string;
  active: boolean;
};

function TestModal({ id, active }: Readonly<TestModalProps>) {
  const { isTopMost } = useModalStack(id, active);

  return (
    <div data-testid={`modal-${id}`}>
      <span>{isTopMost ? 'top' : 'not-top'}</span>
    </div>
  );
}

describe('ModalStackContext', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('renders children inside the provider', () => {
    render(
      <ModalStackProvider>
        <div>Child content</div>
      </ModalStackProvider>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('falls back to top-most when no provider is present', () => {
    render(
      <TestModal
        id="one"
        active
      />
    );

    expect(screen.getByText('top')).toBeInTheDocument();
  });

  it('marks a single active modal as top-most', () => {
    render(
      <ModalStackProvider>
        <TestModal
          id="one"
          active
        />
      </ModalStackProvider>
    );

    expect(screen.getByTestId('modal-one')).toHaveTextContent('top');
  });

  it('marks only the last registered modal as top-most', () => {
    render(
      <ModalStackProvider>
        <TestModal
          id="one"
          active
        />
        <TestModal
          id="two"
          active
        />
      </ModalStackProvider>
    );

    expect(screen.getByTestId('modal-one')).toHaveTextContent('not-top');
    expect(screen.getByTestId('modal-two')).toHaveTextContent('top');
  });

  it('updates top-most modal when the current top modal becomes inactive', () => {
    const { rerender } = render(
      <ModalStackProvider>
        <TestModal
          id="one"
          active
        />
        <TestModal
          id="two"
          active
        />
      </ModalStackProvider>
    );

    expect(screen.getByTestId('modal-one')).toHaveTextContent('not-top');
    expect(screen.getByTestId('modal-two')).toHaveTextContent('top');

    rerender(
      <ModalStackProvider>
        <TestModal
          id="one"
          active
        />
        <TestModal
          id="two"
          active={false}
        />
      </ModalStackProvider>
    );

    expect(screen.getByTestId('modal-one')).toHaveTextContent('top');
    expect(screen.getByTestId('modal-two')).toHaveTextContent('not-top');
  });

  it('does not register inactive modals', () => {
    render(
      <ModalStackProvider>
        <TestModal
          id="one"
          active={false}
        />
        <TestModal
          id="two"
          active
        />
      </ModalStackProvider>
    );

    expect(screen.getByTestId('modal-one')).toHaveTextContent('not-top');
    expect(screen.getByTestId('modal-two')).toHaveTextContent('top');
  });

  it('locks body scroll when at least one modal is active', () => {
    document.body.style.overflow = 'auto';

    render(
      <ModalStackProvider>
        <TestModal
          id="one"
          active
        />
      </ModalStackProvider>
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores previous body overflow when all modals are closed', () => {
    document.body.style.overflow = 'scroll';

    const { rerender } = render(
      <ModalStackProvider>
        <TestModal
          id="one"
          active
        />
      </ModalStackProvider>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <ModalStackProvider>
        <TestModal
          id="one"
          active={false}
        />
      </ModalStackProvider>
    );

    expect(document.body.style.overflow).toBe('scroll');
  });

  it('preserves scroll lock while multiple modals are open', () => {
    document.body.style.overflow = 'auto';

    const { rerender } = render(
      <ModalStackProvider>
        <TestModal
          id="one"
          active
        />
        <TestModal
          id="two"
          active
        />
      </ModalStackProvider>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <ModalStackProvider>
        <TestModal
          id="one"
          active
        />
        <TestModal
          id="two"
          active={false}
        />
      </ModalStackProvider>
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores overflow on provider unmount', () => {
    document.body.style.overflow = 'auto';

    const { unmount } = render(
      <ModalStackProvider>
        <TestModal
          id="one"
          active
        />
      </ModalStackProvider>
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('auto');
  });
});
