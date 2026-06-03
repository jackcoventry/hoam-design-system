import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SearchFormSchemaType } from '@/components/Form';
import { SearchModal } from '@/components/Navigation/Modals/SearchModal';

type MockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  variant: string;
  surface?: string | undefined;
  children: ReactNode;
};

type MockHeaderProps = {
  padded?: boolean | undefined;
  children: ReactNode;
};

type MockBodyProps = {
  padded?: boolean | undefined;
  children: ReactNode;
};

type MockSearchFormProps = {
  onClose: () => void;
  onSubmit: SubmitHandler<SearchFormSchemaType>;
  loading: boolean;
  showCloseButton?: boolean;
};

const modalMock = vi.fn<(props: MockModalProps) => void>();
const modalHeaderMock = vi.fn<(props: MockHeaderProps) => void>();
const modalBodyMock = vi.fn<(props: MockBodyProps) => void>();
const modalCloseButtonMock = vi.fn<() => void>();
const searchFormMock = vi.fn<(props: MockSearchFormProps) => void>();

vi.mock('@/components/Modal', () => ({
  Modal: Object.assign(
    (props: MockModalProps) => {
      const { isOpen, onClose, variant, surface, children } = props;

      modalMock({
        isOpen,
        onClose,
        variant,
        surface,
        children,
      });

      return (
        <div
          data-testid="modal"
          data-open={String(isOpen)}
          data-variant={variant}
          data-surface={surface}
        >
          {children}
        </div>
      );
    },
    {
      Header: (props: MockHeaderProps) => {
        const { padded, children } = props;

        modalHeaderMock({
          padded,
          children,
        });

        return (
          <div
            data-testid="modal-header"
            data-padded={String(Boolean(padded))}
          >
            {children}
          </div>
        );
      },

      Body: (props: MockBodyProps) => {
        const { padded, children } = props;

        modalBodyMock({
          padded,
          children,
        });

        return (
          <div
            data-testid="modal-body"
            data-padded={String(Boolean(padded))}
          >
            {children}
          </div>
        );
      },

      CloseButton: () => {
        modalCloseButtonMock();

        return (
          <button
            type="button"
            onClick={() => modalMock.mock.calls.at(-1)?.[0].onClose()}
          >
            Close modal
          </button>
        );
      },
    }
  ),
}));

vi.mock('@/components/Form', () => ({
  SearchForm: (props: MockSearchFormProps) => {
    searchFormMock(props);

    return <div data-testid="search-form" />;
  },

}));

describe('SearchModal', () => {
  const onClose = vi.fn<() => void>();
  const onSubmit: SubmitHandler<SearchFormSchemaType> = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal with the correct props', () => {
    render(
      <SearchModal
        open
        onClose={onClose}
        onSubmit={onSubmit}
        variant="modal"
      />
    );

    expect(screen.getByTestId('modal')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('modal')).toHaveAttribute('data-variant', 'modal');

    expect(modalMock).toHaveBeenCalledTimes(1);

    const modalProps = modalMock.mock.calls[0]?.[0];
    expect(modalProps).toBeDefined();
    expect(modalProps?.isOpen).toBe(true);
    expect(modalProps?.onClose).toBe(onClose);
    expect(modalProps?.variant).toBe('modal');
    expect(modalProps?.surface).toBe('transparent');
  });

  it('passes padded={false} to Modal.Header', () => {
    render(
      <SearchModal
        open={false}
        onClose={onClose}
        onSubmit={onSubmit}
        variant="drawer"
      />
    );

    expect(modalHeaderMock).toHaveBeenCalledTimes(1);
    expect(modalBodyMock).not.toHaveBeenCalled();

    const headerProps = modalHeaderMock.mock.calls[0]?.[0];

    expect(headerProps?.padded).toBe(false);
  });

  it('renders a visible close button wired to the modal close handler', () => {
    render(
      <SearchModal
        open
        onClose={onClose}
        onSubmit={onSubmit}
        variant="modal"
      />
    );

    expect(modalCloseButtonMock).toHaveBeenCalledTimes(1);

    screen.getByRole('button', { name: 'Close modal' }).click();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('passes onClose, onSubmit, loading=false and close opt-out to SearchForm when not loading', () => {
    render(
      <SearchModal
        open
        onClose={onClose}
        onSubmit={onSubmit}
        variant="modal"
      />
    );

    expect(searchFormMock).toHaveBeenCalledTimes(1);

    const searchFormProps = searchFormMock.mock.calls[0]?.[0];
    expect(searchFormProps).toBeDefined();
    expect(searchFormProps?.onClose).toBe(onClose);
    expect(searchFormProps?.onSubmit).toBe(onSubmit);
    expect(searchFormProps?.loading).toBe(false);
    expect(searchFormProps?.showCloseButton).toBe(false);
  });
});
