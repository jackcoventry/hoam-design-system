import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DesktopNavigationProps } from '@/components/Navigation/DesktopNavigation/DesktopNavigation';
import { MobileNavigationProps } from '@/components/Navigation/MobileNavigation/MobileNavigation';
import { BasketModalProps } from '@/components/Navigation/Modals/BasketModal';
import { Navigation } from '@/components/Navigation/Navigation';
import type { NavigationProps, NavTopLevelItem, NavUserItem } from '@/components/Navigation/types';
import { useMegaNavState } from '@/hooks/useNavState';

type SearchModalProps = {
  endpoint: string;
  open: boolean;
  onClose: () => void;
  variant: 'modal';
};

type MegaNavState = ReturnType<typeof useMegaNavState>;

let capturedMobileNavigationProps: MobileNavigationProps[] = [];
let capturedDesktopNavigationProps: DesktopNavigationProps[] = [];
let capturedSearchModalProps: SearchModalProps[] = [];
let capturedBasketModalProps: BasketModalProps[] = [];
let megaNavState: MegaNavState;

vi.mock('@/hooks/useNavState', () => ({
  useMegaNavState: vi.fn(),
}));

vi.mock('@/components/Navigation', () => ({
  MobileNavigation: (props: MobileNavigationProps) => {
    capturedMobileNavigationProps.push(props);

    return (
      <div data-testid="mobile-navigation">
        <span data-testid="mobile-navigation-count">{String(props.items.length)}</span>
      </div>
    );
  },

  DesktopNavigation: (props: DesktopNavigationProps) => {
    capturedDesktopNavigationProps.push(props);

    return (
      <div data-testid="desktop-navigation">
        <button
          type="button"
          data-testid="desktop-open-search"
          onClick={props.onOpenSearch}
        >
          Open search
        </button>

        <button
          type="button"
          data-testid="desktop-open-basket"
          onClick={props.onOpenBasket}
        >
          Open basket
        </button>
      </div>
    );
  },

  SearchModal: (props: SearchModalProps) => {
    capturedSearchModalProps.push(props);

    return (
      <div
        data-testid="search-modal"
        data-open={props.open ? 'true' : 'false'}
        data-endpoint={props.endpoint}
        data-variant={props.variant}
      >
        <button
          type="button"
          data-testid="search-modal-close"
          onClick={props.onClose}
        >
          Close search
        </button>
      </div>
    );
  },

  BasketModal: (props: BasketModalProps) => {
    capturedBasketModalProps.push(props);

    return (
      <div
        data-testid="basket-modal"
        data-open={props.open ? 'true' : 'false'}
        data-endpoint={props.endpoint}
        data-variant={props.variant}
      >
        <button
          type="button"
          data-testid="basket-modal-close"
          onClick={props.onClose}
        >
          Close basket
        </button>
      </div>
    );
  },
}));

function createItems(): NavTopLevelItem[] {
  return [
    {
      id: 'shop',
      label: 'Shop',
      href: '/shop',
      items: [],
    },
    {
      id: 'discover',
      label: 'Discover',
      href: '/discover',
      items: [],
    },
  ];
}

function createUserItems(): NavUserItem[] {
  return [
    {
      id: 'account',
      label: 'Account',
      href: '/account',
      icon: 'account',
    },
    {
      id: 'basket',
      label: 'Basket',
      href: '/basket',
      icon: 'basket',
      action: 'USER_BASKET',
    },
  ];
}

function createProps(overrides: Partial<NavigationProps> = {}): NavigationProps {
  return {
    items: createItems(),
    userItems: createUserItems(),
    searchEndpoint: '/api/search',
    basketEndpoint: '/api/basket',
    ...overrides,
  };
}

function createMegaNavState(): MegaNavState {
  return {
    openIndex: 1,
    setOpenIndex: vi.fn(),
    openGroupId: 'group-1',
    setOpenGroupId: vi.fn(),
    isKeyboarding: false,
    setKeyboarding: vi.fn(),
    handleTopNavigationOpen: vi.fn(),
    handleAllNavigationClose: vi.fn(),
    resetNavigation: vi.fn(),
    clearHover: vi.fn(),
    clearLeave: vi.fn(),
  };
}

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    capturedMobileNavigationProps = [];
    capturedDesktopNavigationProps = [];
    capturedSearchModalProps = [];
    capturedBasketModalProps = [];

    megaNavState = createMegaNavState();

    vi.mocked(useMegaNavState).mockImplementation(() => megaNavState);
  });

  it('calls useMegaNavState once', () => {
    render(<Navigation {...createProps()} />);

    expect(useMegaNavState).toHaveBeenCalledTimes(1);
  });

  it('renders the four child navigation components', () => {
    render(<Navigation {...createProps()} />);

    expect(screen.getByTestId('mobile-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('search-modal')).toBeInTheDocument();
    expect(screen.getByTestId('basket-modal')).toBeInTheDocument();
  });

  it('passes merged items and userItems to MobileNavigation', () => {
    const items = createItems();
    const userItems = createUserItems();

    render(
      <Navigation
        {...createProps({
          items,
          userItems,
        })}
      />
    );

    expect(capturedMobileNavigationProps).toHaveLength(1);
    expect(capturedMobileNavigationProps[0]?.items).toEqual([...items, ...userItems]);
    expect(screen.getByTestId('mobile-navigation-count')).toHaveTextContent('4');
  });

  it('passes items and userItems separately to DesktopNavigation', () => {
    const items = createItems();
    const userItems = createUserItems();

    render(
      <Navigation
        {...createProps({
          items,
          userItems,
        })}
      />
    );

    expect(capturedDesktopNavigationProps).toHaveLength(1);
    expect(capturedDesktopNavigationProps[0]?.items).toBe(items);
    expect(capturedDesktopNavigationProps[0]?.userItems).toBe(userItems);
  });

  it('passes the hook state values through to DesktopNavigation', () => {
    render(<Navigation {...createProps()} />);

    expect(capturedDesktopNavigationProps).toHaveLength(1);

    const props = capturedDesktopNavigationProps[0];
    expect(props?.openIndex).toBe(megaNavState.openIndex);
    expect(props?.resetNavigation).toBe(megaNavState.resetNavigation);
    expect(props?.setOpenIndex).toBe(megaNavState.setOpenIndex);
    expect(props?.openGroupId).toBe(megaNavState.openGroupId);
    expect(props?.setOpenGroupId).toBe(megaNavState.setOpenGroupId);
    expect(props?.setKeyboarding).toBe(megaNavState.setKeyboarding);
    expect(props?.handleTopNavigationOpen).toBe(megaNavState.handleTopNavigationOpen);
    expect(props?.handleAllNavigationClose).toBe(megaNavState.handleAllNavigationClose);
    expect(props?.clearLeave).toBe(megaNavState.clearLeave);
  });

  it('passes the search endpoint and closed state to SearchModal by default', () => {
    render(<Navigation {...createProps({ searchEndpoint: '/api/custom-search' })} />);

    expect(capturedSearchModalProps).toHaveLength(1);
    expect(capturedSearchModalProps[0]?.endpoint).toBe('/api/custom-search');
    expect(capturedSearchModalProps[0]?.open).toBe(false);
    expect(capturedSearchModalProps[0]?.variant).toBe('modal');

    expect(screen.getByTestId('search-modal')).toHaveAttribute('data-open', 'false');
    expect(screen.getByTestId('search-modal')).toHaveAttribute(
      'data-endpoint',
      '/api/custom-search'
    );
    expect(screen.getByTestId('search-modal')).toHaveAttribute('data-variant', 'modal');
  });

  it('passes the basket endpoint and closed state to BasketModal by default', () => {
    render(<Navigation {...createProps({ basketEndpoint: '/api/custom-basket' })} />);

    expect(capturedBasketModalProps).toHaveLength(1);
    expect(capturedBasketModalProps[0]?.endpoint).toBe('/api/custom-basket');
    expect(capturedBasketModalProps[0]?.open).toBe(false);
    expect(capturedBasketModalProps[0]?.variant).toBe('drawer');

    expect(screen.getByTestId('basket-modal')).toHaveAttribute('data-open', 'false');
    expect(screen.getByTestId('basket-modal')).toHaveAttribute(
      'data-endpoint',
      '/api/custom-basket'
    );
    expect(screen.getByTestId('basket-modal')).toHaveAttribute('data-variant', 'drawer');
  });

  it('opens SearchModal when DesktopNavigation triggers onOpenSearch', () => {
    render(<Navigation {...createProps()} />);

    fireEvent.click(screen.getByTestId('desktop-open-search'));

    expect(screen.getByTestId('search-modal')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('basket-modal')).toHaveAttribute('data-open', 'false');
  });

  it('opens BasketModal when DesktopNavigation triggers onOpenBasket', () => {
    render(<Navigation {...createProps()} />);

    fireEvent.click(screen.getByTestId('desktop-open-basket'));

    expect(screen.getByTestId('basket-modal')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('search-modal')).toHaveAttribute('data-open', 'false');
  });

  it('closes SearchModal when its onClose handler runs', () => {
    render(<Navigation {...createProps()} />);

    fireEvent.click(screen.getByTestId('desktop-open-search'));
    expect(screen.getByTestId('search-modal')).toHaveAttribute('data-open', 'true');

    fireEvent.click(screen.getByTestId('search-modal-close'));
    expect(screen.getByTestId('search-modal')).toHaveAttribute('data-open', 'false');
  });

  it('closes BasketModal when its onClose handler runs', () => {
    render(<Navigation {...createProps()} />);

    fireEvent.click(screen.getByTestId('desktop-open-basket'));
    expect(screen.getByTestId('basket-modal')).toHaveAttribute('data-open', 'true');

    fireEvent.click(screen.getByTestId('basket-modal-close'));
    expect(screen.getByTestId('basket-modal')).toHaveAttribute('data-open', 'false');
  });

  it('can have both modals open at the same time', () => {
    render(<Navigation {...createProps()} />);

    fireEvent.click(screen.getByTestId('desktop-open-search'));
    fireEvent.click(screen.getByTestId('desktop-open-basket'));

    expect(screen.getByTestId('search-modal')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('basket-modal')).toHaveAttribute('data-open', 'true');
  });

  it('recomputes mobile navigation when items change', () => {
    const { rerender } = render(
      <Navigation
        {...createProps({
          items: createItems(),
          userItems: createUserItems(),
        })}
      />
    );

    rerender(
      <Navigation
        {...createProps({
          items: [
            ...createItems(),
            {
              id: 'journal',
              label: 'Journal',
              href: '/journal',
              items: [],
            },
          ],
          userItems: createUserItems(),
        })}
      />
    );

    const latestMobileProps = capturedMobileNavigationProps.at(-1);

    expect(latestMobileProps?.items).toHaveLength(5);
  });

  it('renders safely with empty items and userItems', () => {
    render(
      <Navigation
        {...createProps({
          items: [],
          userItems: [],
        })}
      />
    );

    expect(screen.getByTestId('mobile-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-navigation-count')).toHaveTextContent('0');
    expect(screen.getByTestId('desktop-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('search-modal')).toHaveAttribute('data-open', 'false');
    expect(screen.getByTestId('basket-modal')).toHaveAttribute('data-open', 'false');
  });
});
