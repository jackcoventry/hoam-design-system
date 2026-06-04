import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { BasketItemProps } from '@/components/Basket';
import { BasketModal } from '@/components/Navigation/Modals/BasketModal';

const modalMock =
  vi.fn<
    (props: {
      isOpen: boolean;
      onClose: () => void;
      variant: string;
      children: React.ReactNode;
    }) => void
  >();

const basketMock = vi.fn<(props: { items: BasketItemProps[]; total: number }) => void>();

const basketFooterMock = vi.fn<(props: { total: number }) => void>();

const closeButtonMock = vi.fn<() => void>();

const useMessagesMock = vi.fn<(namespace: string) => { modalBasket: string }>();

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => useMessagesMock(namespace),
}));

vi.mock('@/components/Basket', () => ({
  Basket: (props: { items: BasketItemProps[]; total: number }) => {
    basketMock(props);

    return <div data-testid="basket" />;
  },
  BasketFooter: (props: { total: number }) => {
    basketFooterMock(props);

    return <div data-testid="basket-footer" />;
  },
}));

vi.mock('@/components/Modal', () => {
  const ModalComponent = ({
    isOpen,
    onClose,
    variant,
    children,
  }: {
    isOpen: boolean;
    onClose: () => void;
    variant: string;
    children: React.ReactNode;
  }) => {
    modalMock({ isOpen, onClose, variant, children });

    return (
      <div
        data-testid="modal"
        data-open={String(isOpen)}
        data-variant={variant}
      >
        {children}
      </div>
    );
  };

  ModalComponent.Header = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-header">{children}</div>
  );

  ModalComponent.Title = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-title">{children}</div>
  );

  ModalComponent.CloseButton = () => {
    closeButtonMock();

    return (
      <button
        type="button"
        onClick={() => modalMock.mock.calls.at(-1)?.[0].onClose()}
      >
        Close modal
      </button>
    );
  };

  ModalComponent.Body = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-body">{children}</div>
  );

  ModalComponent.Footer = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-footer">{children}</div>
  );

  return {
    Modal: ModalComponent,
  };
});

describe('BasketModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useMessagesMock.mockReturnValue({
      modalBasket: 'Your basket',
    });
  });

  const onClose = vi.fn();

  const basketItems: BasketItemProps[] = [
    {
      id: 'item-1',
      title: 'Item One',
      summary: 'First item',
      price: 10,
      quantity: 2,
      url: '/item-1',
      thumbnail: {
        src: '/item-1.jpg',
        alt: 'Item One',
      },
      onChange: vi.fn(),
    },
    {
      id: 'item-2',
      title: 'Item Two',
      summary: 'Second item',
      price: 5,
      quantity: 3,
      url: '/item-2',
      thumbnail: {
        src: '/item-2.jpg',
        alt: 'Item Two',
      },
      onChange: vi.fn(),
    },
  ];

  it('renders the modal with the correct props', () => {
    render(
      <BasketModal
        open
        onClose={onClose}
        variant="drawer"
        data={basketItems}
      />
    );

    expect(screen.getByTestId('modal')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('modal')).toHaveAttribute('data-variant', 'drawer');

    expect(modalMock).toHaveBeenCalledTimes(1);

    const modalProps = modalMock.mock.calls[0]?.[0];
    expect(modalProps).toBeDefined();
    expect(modalProps?.isOpen).toBe(true);
    expect(modalProps?.onClose).toBe(onClose);
    expect(modalProps?.variant).toBe('drawer');
  });

  it('renders the translated basket title', () => {
    render(
      <BasketModal
        open={false}
        onClose={onClose}
        variant="modal"
        data={basketItems}
      />
    );

    expect(useMessagesMock).toHaveBeenCalledWith('navigation');
    expect(screen.getByText('Your basket')).toBeInTheDocument();
    expect(screen.getByTestId('modal-header')).toBeInTheDocument();
    expect(screen.getByTestId('modal-title')).toBeInTheDocument();
  });

  it('passes the calculated total to Basket and BasketFooter', () => {
    render(
      <BasketModal
        open
        onClose={onClose}
        variant="drawer"
        data={basketItems}
      />
    );

    const expectedTotal = 35;

    expect(basketMock).toHaveBeenCalledTimes(1);
    expect(basketFooterMock).toHaveBeenCalledTimes(1);

    const basketProps = basketMock.mock.calls[0]?.[0];
    const basketFooterProps = basketFooterMock.mock.calls[0]?.[0];

    expect(basketProps).toBeDefined();
    expect(basketProps?.items).toEqual(basketItems);
    expect(basketProps?.total).toBe(expectedTotal);

    expect(basketFooterProps).toBeDefined();
    expect(basketFooterProps?.total).toBe(expectedTotal);
  });

  it('passes zero total when basket data is empty', () => {
    render(
      <BasketModal
        open
        onClose={onClose}
        variant="drawer"
        data={[]}
      />
    );

    const basketProps = basketMock.mock.calls[0]?.[0];
    const basketFooterProps = basketFooterMock.mock.calls[0]?.[0];

    expect(basketProps).toBeDefined();
    expect(basketProps?.items).toEqual([]);
    expect(basketProps?.total).toBe(0);

    expect(basketFooterProps).toBeDefined();
    expect(basketFooterProps?.total).toBe(0);
  });

  it('renders a close button wired to the modal close handler', () => {
    render(
      <BasketModal
        open
        onClose={onClose}
        variant="drawer"
        data={basketItems}
      />
    );

    expect(closeButtonMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders body and footer sections', () => {
    render(
      <BasketModal
        open
        onClose={onClose}
        variant="drawer"
        data={basketItems}
      />
    );

    expect(screen.getByTestId('modal-body')).toBeInTheDocument();
    expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
    expect(screen.getByTestId('basket')).toBeInTheDocument();
    expect(screen.getByTestId('basket-footer')).toBeInTheDocument();
  });
});
