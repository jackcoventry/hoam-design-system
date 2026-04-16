import { act, render, screen } from '@testing-library/react';
import type { ComponentProps, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ModalVariant } from '@/components/Modal/Modal';
import { SearchModal } from '@/components/Navigation/Modals/SearchModal';
import type { UseFetchResult } from '@/hooks/useFetch';
import { getSearchResults } from '@/utils/fetchers/getSearchResults';

type SearchResultItem = {
  id: string;
  title: string;
  href: string;
};

type SearchFormProps = {
  onClose: () => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
};

type SearchResultsProps = {
  items: SearchResultItem[];
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  variant: ModalVariant;
  children: ReactNode;
};

type ModalHeaderProps = {
  children: ReactNode;
  padded?: boolean;
};

type ModalBodyProps = {
  children: ReactNode;
  padded?: boolean;
};

function createFetchResult(overrides: Partial<MockFetchResult> = {}): MockFetchResult {
  return {
    data: null,
    error: null,
    loading: false,
    reload: vi.fn((): Promise<void> => Promise.resolve()),
    ...overrides,
  };
}

let capturedModalProps: ModalProps[] = [];
let capturedModalHeaderProps: ModalHeaderProps[] = [];
let capturedModalBodyProps: ModalBodyProps[] = [];
let capturedSearchFormProps: SearchFormProps[] = [];
let capturedSearchResultsProps: SearchResultsProps[] = [];
let lastFetchOptions: { manual?: boolean } | undefined;
let useFetchSignalCallCount = 0;

type MockFetchResult = {
  data: SearchResultItem[] | null;
  error: Error | null;
  loading: boolean;
  reload: () => Promise<void>;
};

let currentFetchResult: MockFetchResult;

vi.mock('@/hooks/useFetch', () => ({
  useFetchSignal: (
    _fetcher: (signal: AbortSignal) => Promise<SearchResultItem[]>,
    options?: { manual?: boolean }
  ): UseFetchResult<SearchResultItem[]> => {
    useFetchSignalCallCount += 1;
    lastFetchOptions = options;
    return currentFetchResult;
  },
}));

vi.mock('@/utils/fetchers/getSearchResults', () => ({
  getSearchResults: vi.fn((endpoint: string) => {
    const fetcher = () => Promise.resolve([]);
    return Object.assign(fetcher, { endpoint });
  }),
}));

vi.mock('@/components/Form', () => ({
  SearchForm: (props: SearchFormProps) => {
    capturedSearchFormProps.push(props);

    return (
      <div data-testid="search-form">
        <button
          type="button"
          data-testid="search-form-submit"
          onClick={() => {
            void props.onSubmit();
          }}
        >
          Submit
        </button>

        <button
          type="button"
          data-testid="search-form-close"
          onClick={props.onClose}
        >
          Close
        </button>

        <span data-testid="search-form-loading">{String(props.loading)}</span>
      </div>
    );
  },

  SearchLoader: () => <div data-testid="search-loader">Loading</div>,

  SearchResults: (props: SearchResultsProps) => {
    capturedSearchResultsProps.push(props);

    return (
      <div data-testid="search-results">
        <span data-testid="search-results-count">{String(props.items.length)}</span>
      </div>
    );
  },
}));

vi.mock('@/components/Modal', () => {
  const ModalComponent = (props: ModalProps) => {
    capturedModalProps.push(props);

    return (
      <div
        data-testid="modal"
        data-open={props.isOpen ? 'true' : 'false'}
        data-variant={String(props.variant)}
      >
        {props.children}
      </div>
    );
  };

  const ModalHeader = (props: ModalHeaderProps) => {
    capturedModalHeaderProps.push(props);

    return (
      <div
        data-testid="modal-header"
        data-padded={props.padded === undefined ? '' : String(props.padded)}
      >
        {props.children}
      </div>
    );
  };

  const ModalBody = (props: ModalBodyProps) => {
    capturedModalBodyProps.push(props);

    return (
      <div
        data-testid="modal-body"
        data-padded={props.padded === undefined ? '' : String(props.padded)}
      >
        {props.children}
      </div>
    );
  };

  ModalComponent.Header = ModalHeader;
  ModalComponent.Body = ModalBody;

  return {
    Modal: ModalComponent,
  };
});

function createSearchResults(): SearchResultItem[] {
  return [
    {
      id: '1',
      title: 'Result One',
      href: '/result-one',
    },
    {
      id: '2',
      title: 'Result Two',
      href: '/result-two',
    },
  ];
}

function createProps(
  overrides: Partial<ComponentProps<typeof SearchModal>> = {}
): ComponentProps<typeof SearchModal> {
  return {
    endpoint: '/api/search',
    open: true,
    onClose: vi.fn<() => void>(),
    variant: 'right' as ModalVariant,
    ...overrides,
  };
}

function mockUseFetchSignal(result: MockFetchResult): void {
  currentFetchResult = result;
}

describe('SearchModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedModalProps = [];
    capturedModalHeaderProps = [];
    capturedModalBodyProps = [];
    capturedSearchFormProps = [];
    capturedSearchResultsProps = [];
    lastFetchOptions = undefined;
    useFetchSignalCallCount = 0;
    currentFetchResult = createFetchResult();
  });

  it('creates the search fetcher from the endpoint', () => {
    render(<SearchModal {...createProps({ endpoint: '/api/custom-search' })} />);

    expect(getSearchResults).toHaveBeenCalledTimes(1);
    expect(getSearchResults).toHaveBeenCalledWith('/api/custom-search');
  });

  it('passes the fetcher into useFetchSignal with manual mode enabled', () => {
    render(<SearchModal {...createProps()} />);

    expect(useFetchSignalCallCount).toBe(1);
    expect(lastFetchOptions).toEqual({ manual: true });
  });

  it('passes open, onClose, and variant to Modal', () => {
    const props = createProps({
      open: false,
      variant: 'left' as ModalVariant,
    });

    render(<SearchModal {...props} />);

    expect(capturedModalProps).toHaveLength(1);
    expect(capturedModalProps[0]?.isOpen).toBe(false);
    expect(capturedModalProps[0]?.onClose).toBe(props.onClose);
    expect(capturedModalProps[0]?.variant).toBe('left');
  });

  it('renders the modal structure', () => {
    render(<SearchModal {...createProps()} />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-header')).toBeInTheDocument();
    expect(screen.getByTestId('modal-body')).toBeInTheDocument();
  });

  it('passes padded=false to both Modal.Header and Modal.Body', () => {
    render(<SearchModal {...createProps()} />);

    expect(capturedModalHeaderProps).toHaveLength(1);
    expect(capturedModalBodyProps).toHaveLength(1);
    expect(capturedModalHeaderProps[0]?.padded).toBe(false);
    expect(capturedModalBodyProps[0]?.padded).toBe(false);

    expect(screen.getByTestId('modal-header')).toHaveAttribute('data-padded', 'false');
    expect(screen.getByTestId('modal-body')).toHaveAttribute('data-padded', 'false');
  });

  it('renders SearchForm in the modal header', () => {
    render(<SearchModal {...createProps()} />);

    expect(screen.getByTestId('search-form')).toBeInTheDocument();
    expect(screen.getByTestId('modal-header')).toContainElement(screen.getByTestId('search-form'));
  });

  it('passes onClose and loading to SearchForm', () => {
    const props = createProps();

    mockUseFetchSignal(
      createFetchResult({
        loading: true,
      })
    );

    render(<SearchModal {...props} />);

    expect(capturedSearchFormProps).toHaveLength(1);
    expect(capturedSearchFormProps[0]?.onClose).toBe(props.onClose);
    expect(capturedSearchFormProps[0]?.loading).toBe(true);
    expect(screen.getByTestId('search-form-loading')).toHaveTextContent('true');
  });

  it('calls onClose when SearchForm triggers close', () => {
    const props = createProps();

    render(<SearchModal {...props} />);

    screen.getByTestId('search-form-close').click();

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls reload when the search form submits', async () => {
    const reload = vi.fn<() => Promise<void>>(() => Promise.resolve());

    mockUseFetchSignal(
      createFetchResult({
        reload,
      })
    );

    render(<SearchModal {...createProps()} />);

    act(() => {
      screen.getByTestId('search-form-submit').click();
    });

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('renders SearchLoader when loading is true and there is no error', () => {
    mockUseFetchSignal(
      createFetchResult({
        loading: true,
      })
    );

    render(<SearchModal {...createProps()} />);

    expect(screen.getByTestId('search-loader')).toBeInTheDocument();
    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument();
  });

  it('does not render SearchLoader when loading is true but error is an Error', () => {
    mockUseFetchSignal(
      createFetchResult({
        error: new Error('Something went wrong'),
        loading: true,
      })
    );

    render(<SearchModal {...createProps()} />);

    expect(screen.queryByTestId('search-loader')).not.toBeInTheDocument();
  });

  it('does not render SearchLoader when loading is false', () => {
    render(<SearchModal {...createProps()} />);

    expect(screen.queryByTestId('search-loader')).not.toBeInTheDocument();
  });

  it('renders SearchResults when data exists, loading is false, and there is no error', () => {
    const items = createSearchResults();

    mockUseFetchSignal(
      createFetchResult({
        data: items,
      })
    );

    render(<SearchModal {...createProps()} />);

    expect(screen.getByTestId('search-results')).toBeInTheDocument();
    expect(screen.getByTestId('search-results-count')).toHaveTextContent('2');
    expect(capturedSearchResultsProps).toHaveLength(1);
    expect(capturedSearchResultsProps[0]?.items).toEqual(items);
  });

  it('does not render SearchResults when data is null', () => {
    mockUseFetchSignal(
      createFetchResult({
        data: null,
      })
    );

    render(<SearchModal {...createProps()} />);

    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument();
  });

  it('does not render SearchResults when data is an empty array', () => {
    mockUseFetchSignal(
      createFetchResult({
        data: [],
      })
    );

    render(<SearchModal {...createProps()} />);

    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument();
  });

  it('does not render SearchResults when loading is true', () => {
    mockUseFetchSignal(
      createFetchResult({
        data: createSearchResults(),
        loading: true,
      })
    );

    render(<SearchModal {...createProps()} />);

    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument();
  });

  it('does not render SearchResults when error is an Error', () => {
    mockUseFetchSignal(
      createFetchResult({
        data: createSearchResults(),
        error: new Error('Search failed'),
      })
    );

    render(<SearchModal {...createProps()} />);

    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument();
  });

  it('renders SearchResults inside the modal body', () => {
    mockUseFetchSignal(
      createFetchResult({
        data: createSearchResults(),
      })
    );

    render(<SearchModal {...createProps()} />);

    expect(screen.getByTestId('modal-body')).toContainElement(screen.getByTestId('search-results'));
  });

  it('recreates the fetcher when the endpoint changes', () => {
    const { rerender } = render(<SearchModal {...createProps({ endpoint: '/api/search-one' })} />);

    rerender(<SearchModal {...createProps({ endpoint: '/api/search-two' })} />);

    expect(getSearchResults).toHaveBeenCalledWith('/api/search-one');
    expect(getSearchResults).toHaveBeenCalledWith('/api/search-two');
  });
});
