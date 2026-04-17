import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SearchFormResult, SearchFormSchemaType } from '@/components/Form';
import { SearchModal } from '@/components/Navigation/Modals/SearchModal';
import type { AsyncState } from '@/types/async';

type MockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  variant: string;
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
};

type MockSearchResultsProps = {
  items: SearchFormResult[];
};

const modalMock = vi.fn<(props: MockModalProps) => void>();
const modalHeaderMock = vi.fn<(props: MockHeaderProps) => void>();
const modalBodyMock = vi.fn<(props: MockBodyProps) => void>();
const searchFormMock = vi.fn<(props: MockSearchFormProps) => void>();
const searchLoaderMock = vi.fn<() => void>();
const searchResultsMock = vi.fn<(props: MockSearchResultsProps) => void>();

vi.mock('@/components/Modal', () => ({
  Modal: Object.assign(
    (props: MockModalProps) => {
      const { isOpen, onClose, variant, children } = props;

      modalMock({
        isOpen,
        onClose,
        variant,
        children,
      });

      return (
        <div
          data-testid="modal"
          data-open={String(isOpen)}
          data-variant={variant}
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
    }
  ),
}));

vi.mock('@/components/Form', () => ({
  SearchForm: (props: MockSearchFormProps) => {
    searchFormMock(props);

    return <div data-testid="search-form" />;
  },

  SearchLoader: () => {
    searchLoaderMock();

    return <div data-testid="search-loader" />;
  },

  SearchResults: (props: MockSearchResultsProps) => {
    searchResultsMock(props);

    return <div data-testid="search-results" />;
  },
}));

describe('SearchModal', () => {
  const onClose = vi.fn<() => void>();
  const onSubmit: SubmitHandler<SearchFormSchemaType> = vi.fn();

  const results: SearchFormResult[] = [
    {
      id: 1,
      title: 'Result 1',
      url: '/result-1',
      preview: 'Preview 1',
    },
    {
      id: 2,
      title: 'Result 2',
      url: '/result-2',
      preview: 'Preview 2',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal with the correct props', () => {
    const state: AsyncState<unknown> = { status: 'idle' };

    render(
      <SearchModal
        open
        onClose={onClose}
        onSubmit={onSubmit}
        variant="modal"
        state={state}
        data={results}
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
  });

  it('passes padded={false} to Modal.Header and Modal.Body', () => {
    const state: AsyncState<unknown> = { status: 'idle' };

    render(
      <SearchModal
        open={false}
        onClose={onClose}
        onSubmit={onSubmit}
        variant="drawer"
        state={state}
        data={results}
      />
    );

    expect(modalHeaderMock).toHaveBeenCalledTimes(1);
    expect(modalBodyMock).toHaveBeenCalledTimes(1);

    const headerProps = modalHeaderMock.mock.calls[0]?.[0];
    const bodyProps = modalBodyMock.mock.calls[0]?.[0];

    expect(headerProps?.padded).toBe(false);
    expect(bodyProps?.padded).toBe(false);
  });

  it('passes onClose, onSubmit and loading=false to SearchForm when not loading', () => {
    const state: AsyncState<unknown> = { status: 'idle' };

    render(
      <SearchModal
        open
        onClose={onClose}
        onSubmit={onSubmit}
        variant="modal"
        state={state}
        data={results}
      />
    );

    expect(searchFormMock).toHaveBeenCalledTimes(1);

    const searchFormProps = searchFormMock.mock.calls[0]?.[0];
    expect(searchFormProps).toBeDefined();
    expect(searchFormProps?.onClose).toBe(onClose);
    expect(searchFormProps?.onSubmit).toBe(onSubmit);
    expect(searchFormProps?.loading).toBe(false);
  });

  it('passes loading=true to SearchForm and renders SearchLoader when loading', () => {
    const state: AsyncState<unknown> = { status: 'loading' };

    render(
      <SearchModal
        open
        onClose={onClose}
        onSubmit={onSubmit}
        variant="modal"
        state={state}
        data={results}
      />
    );

    const searchFormProps = searchFormMock.mock.calls[0]?.[0];
    expect(searchFormProps?.loading).toBe(true);

    expect(screen.getByTestId('search-loader')).toBeInTheDocument();
    expect(searchLoaderMock).toHaveBeenCalledTimes(1);
  });

  it('does not render SearchLoader when not loading', () => {
    const state: AsyncState<unknown> = { status: 'idle' };

    render(
      <SearchModal
        open
        onClose={onClose}
        onSubmit={onSubmit}
        variant="modal"
        state={state}
        data={results}
      />
    );

    expect(screen.queryByTestId('search-loader')).not.toBeInTheDocument();
    expect(searchLoaderMock).not.toHaveBeenCalled();
  });

  it('renders SearchResults when data exists and is not loading', () => {
    const state: AsyncState<unknown> = { status: 'success', data: { ok: true } };

    render(
      <SearchModal
        open
        onClose={onClose}
        onSubmit={onSubmit}
        variant="modal"
        state={state}
        data={results}
      />
    );

    expect(screen.getByTestId('search-results')).toBeInTheDocument();
    expect(searchResultsMock).toHaveBeenCalledTimes(1);

    const searchResultsProps = searchResultsMock.mock.calls[0]?.[0];
    expect(searchResultsProps).toBeDefined();
    expect(searchResultsProps?.items).toEqual(results);
  });

  it('does not render SearchResults while loading even if data exists', () => {
    const state: AsyncState<unknown> = { status: 'loading' };

    render(
      <SearchModal
        open
        onClose={onClose}
        onSubmit={onSubmit}
        variant="modal"
        state={state}
        data={results}
      />
    );

    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument();
    expect(searchResultsMock).not.toHaveBeenCalled();
  });

  it('does not render SearchResults when data is null', () => {
    const state: AsyncState<unknown> = { status: 'idle' };

    render(
      <SearchModal
        open
        onClose={onClose}
        onSubmit={onSubmit}
        variant="modal"
        state={state}
        data={null}
      />
    );

    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument();
    expect(searchResultsMock).not.toHaveBeenCalled();
  });

  it('does not render SearchResults when data is empty', () => {
    const state: AsyncState<unknown> = { status: 'idle' };

    render(
      <SearchModal
        open
        onClose={onClose}
        onSubmit={onSubmit}
        variant="modal"
        state={state}
        data={[]}
      />
    );

    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument();
    expect(searchResultsMock).not.toHaveBeenCalled();
  });

  it('renders SearchResults when state is undefined-like safe branch is not loading and data is present', () => {
    const state = { status: 'idle' } as AsyncState<unknown>;

    render(
      <SearchModal
        open
        onClose={onClose}
        onSubmit={onSubmit}
        variant="modal"
        state={state}
        data={results}
      />
    );

    expect(screen.getByTestId('search-results')).toBeInTheDocument();
  });
});
