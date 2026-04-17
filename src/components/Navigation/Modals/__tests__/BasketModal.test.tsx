import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ModalVariant } from '@/components/Modal/Modal';
import { BasketModal } from '@/components/Navigation/Modals/BasketModal';
import { useFetchSignal } from '@/hooks/useFetch';
import { useMessages } from '@/hooks/useMessages';

type BasketItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  variant: ModalVariant;
  children: ReactNode;
};

type BasketProps = {
  items?: BasketItem[];
  total: number;
};

type BasketFooterProps = {
  total: number;
};

type CloseButtonProps = {
  callback: () => void;
};

let capturedModalProps: ModalProps[] = [];
let capturedBasketProps: BasketProps[] = [];
let capturedBasketFooterProps: BasketFooterProps[] = [];
let capturedCloseButtonProps: CloseButtonProps[] = [];
let lastFetcher: unknown = null;

vi.mock('@/hooks/useMessages', () => ({
  useMessages: vi.fn(),
}));

vi.mock('@/hooks/useFetch', () => ({
  useFetchSignal: vi.fn(),
}));

vi.mock('@/components/Basket', () => ({
  Basket: (props: BasketProps) => {
    capturedBasketProps.push(props);

    return (
      <div data-testid="basket">
        <span data-testid="basket-total">{String(props.total)}</span>
        <span data-testid="basket-items-count">{String(props.items?.length ?? 0)}</span>
      </div>
    );
  },

  BasketFooter: (props: BasketFooterProps) => {
    capturedBasketFooterProps.push(props);

    return <div data-testid="basket-footer-total">{String(props.total)}</div>;
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

  ModalComponent.Header = ({ children }: { children: ReactNode }) => (
    <div data-testid="modal-header">{children}</div>
  );

  ModalComponent.Title = ({ children }: { children: ReactNode }) => (
    <div data-testid="modal-title">{children}</div>
  );

  ModalComponent.CloseButton = (props: CloseButtonProps) => {
    capturedCloseButtonProps.push(props);

    return (
      <button
        type="button"
        data-testid="modal-close-button"
        onClick={props.callback}
      >
        Close
      </button>
    );
  };

  ModalComponent.Body = ({ children }: { children: ReactNode }) => (
    <div data-testid="modal-body">{children}</div>
  );

  ModalComponent.Footer = ({ children }: { children: ReactNode }) => (
    <div data-testid="modal-footer">{children}</div>
  );

  return {
    Modal: ModalComponent,
  };
});

vi.mock('@/styles/Typography.module.css', () => ({
  default: {
    heading: 'heading',
  },
}));

function createBasketItems(): BasketItem[] {
  return [
    {
      id: '1',
      title: 'Item One',
      price: 10,
      quantity: 2,
    },
    {
      id: '2',
      title: 'Item Two',
      price: 7.5,
      quantity: 3,
    },
  ];
}

function createProps(
  overrides: Partial<React.ComponentProps<typeof BasketModal>> = {}
): React.ComponentProps<typeof BasketModal> {
  return {
    endpoint: '/api/basket',
    open: true,
    onClose: vi.fn<() => void>(),
    variant: 'right' as ModalVariant,
    ...overrides,
  };
}

describe('BasketModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedModalProps = [];
    capturedBasketProps = [];
    capturedBasketFooterProps = [];
    capturedCloseButtonProps = [];
    lastFetcher = null;

    vi.mocked(useMessages).mockReturnValue({
      modalBasket: 'Basket',
    });

    vi.mocked(useFetchSignal).mockImplementation((fetcher: unknown) => {
      lastFetcher = fetcher;

      return {
        data: createBasketItems(),
        error: null,
        loading: false,
        reload: vi.fn(),
      };
    });
  });

  it('calls useMessages with the navigation namespace', () => {
    render(<BasketModal {...createProps()} />);

    expect(useMessages).toHaveBeenCalledWith('navigation');
  });

  it('creates the basket fetcher from the endpoint', () => {
    render(<BasketModal {...createProps({ endpoint: '/api/custom-basket' })} />);

    expect(getBasketItems).toHaveBeenCalledTimes(1);
    expect(getBasketItems).toHaveBeenCalledWith('/api/custom-basket');
  });

  it('passes the memoized fetcher into useFetchSignal', () => {
    render(<BasketModal {...createProps()} />);

    expect(useFetchSignal).toHaveBeenCalledTimes(1);
    expect(lastFetcher).toBeTruthy();
  });

  it('passes open, onClose, and variant to Modal', () => {
    const props = createProps({
      open: false,
      variant: 'left' as ModalVariant,
    });

    render(<BasketModal {...props} />);

    expect(capturedModalProps).toHaveLength(1);
    expect(capturedModalProps[0]?.isOpen).toBe(false);
    expect(capturedModalProps[0]?.onClose).toBe(props.onClose);
    expect(capturedModalProps[0]?.variant).toBe('left');
  });

  it('renders the modal structure', () => {
    render(<BasketModal {...createProps()} />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-header')).toBeInTheDocument();
    expect(screen.getByTestId('modal-title')).toBeInTheDocument();
    expect(screen.getByTestId('modal-body')).toBeInTheDocument();
    expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
  });

  it('renders the translated basket title with the heading class', () => {
    render(<BasketModal {...createProps()} />);

    const title = screen.getByText('Basket');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('SPAN');
    expect(title).toHaveClass('heading');
  });

  it('passes onClose to the modal close button and calls it when clicked', () => {
    const props = createProps();

    render(<BasketModal {...props} />);

    expect(capturedCloseButtonProps).toHaveLength(1);
    expect(capturedCloseButtonProps[0]?.callback).toBe(props.onClose);

    screen.getByTestId('modal-close-button').click();

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('passes fetched items into Basket', () => {
    const items = createBasketItems();

    vi.mocked(useFetchSignal).mockImplementation((fetcher: unknown) => {
      lastFetcher = fetcher;

      return {
        data: items,
        error: null,
        loading: false,
        reload: vi.fn(),
      };
    });

    render(<BasketModal {...createProps()} />);

    expect(capturedBasketProps).toHaveLength(1);
    expect(capturedBasketProps[0]?.items).toEqual(items);
  });

  it('calculates the basket total from price × quantity', () => {
    const items: BasketItem[] = [
      {
        id: '1',
        title: 'Item One',
        price: 10,
        quantity: 2,
      },
      {
        id: '2',
        title: 'Item Two',
        price: 5,
        quantity: 3,
      },
    ];

    vi.mocked(useFetchSignal).mockImplementation((fetcher: unknown) => {
      lastFetcher = fetcher;

      return {
        data: items,
        error: null,
        loading: false,
        reload: vi.fn(),
      };
    });

    render(<BasketModal {...createProps()} />);

    expect(capturedBasketProps[0]?.total).toBe(35);
    expect(capturedBasketFooterProps[0]?.total).toBe(35);
    expect(screen.getByTestId('basket-total')).toHaveTextContent('35');
    expect(screen.getByTestId('basket-footer-total')).toHaveTextContent('35');
  });

  it('passes total 0 when data is undefined', () => {
    vi.mocked(useFetchSignal).mockImplementation((fetcher: unknown) => {
      lastFetcher = fetcher;

      return {
        data: undefined,
        error: null,
        loading: false,
        reload: vi.fn(),
      };
    });

    render(<BasketModal {...createProps()} />);

    expect(capturedBasketProps[0]?.items).toBeUndefined();
    expect(capturedBasketProps[0]?.total).toBe(0);
    expect(capturedBasketFooterProps[0]?.total).toBe(0);
  });

  it('passes total 0 when data is an empty array', () => {
    vi.mocked(useFetchSignal).mockImplementation((fetcher: unknown) => {
      lastFetcher = fetcher;

      return {
        data: [],
        error: null,
        loading: false,
        reload: vi.fn(),
      };
    });

    render(<BasketModal {...createProps()} />);

    expect(capturedBasketProps[0]?.items).toEqual([]);
    expect(capturedBasketProps[0]?.total).toBe(0);
    expect(capturedBasketFooterProps[0]?.total).toBe(0);
    expect(screen.getByTestId('basket-items-count')).toHaveTextContent('0');
  });

  it('handles decimal totals correctly', () => {
    const items: BasketItem[] = [
      {
        id: '1',
        title: 'Item One',
        price: 12.5,
        quantity: 2,
      },
      {
        id: '2',
        title: 'Item Two',
        price: 3.25,
        quantity: 4,
      },
    ];

    vi.mocked(useFetchSignal).mockImplementation((fetcher: unknown) => {
      lastFetcher = fetcher;

      return {
        data: items,
        error: null,
        loading: false,
        reload: vi.fn(),
      };
    });

    render(<BasketModal {...createProps()} />);

    expect(capturedBasketProps[0]?.total).toBe(38);
    expect(capturedBasketFooterProps[0]?.total).toBe(38);
  });

  it('renders Basket inside the modal body', () => {
    render(<BasketModal {...createProps()} />);

    const body = screen.getByTestId('modal-body');
    const basket = screen.getByTestId('basket');

    expect(body).toContainElement(basket);
  });

  it('renders BasketFooter inside the modal footer', () => {
    render(<BasketModal {...createProps()} />);

    const footer = screen.getByTestId('modal-footer');
    const basketFooter = screen.getByTestId('basket-footer-total');

    expect(footer).toContainElement(basketFooter);
  });

  it('recreates the fetcher when the endpoint changes', () => {
    const { rerender } = render(<BasketModal {...createProps({ endpoint: '/api/basket-one' })} />);

    rerender(<BasketModal {...createProps({ endpoint: '/api/basket-two' })} />);

    expect(getBasketItems).toHaveBeenCalledWith('/api/basket-one');
    expect(getBasketItems).toHaveBeenCalledWith('/api/basket-two');
  });
});
