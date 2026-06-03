import { fireEvent, render, screen } from '@testing-library/react';
import type { Dispatch, SetStateAction } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { BasketItemProps } from '@/components/Basket';
import type { SearchFormSchemaType } from '@/components/Form';
import { Navigation } from '@/components/Navigation/Navigation';
import type { NavTopLevelItem, NavUserItem } from '@/components/Navigation/types';
import { useMegaNavState } from '@/hooks/useNavState';

type MockDesktopNavigationProps = {
  items: NavTopLevelItem[];
  userItems: NavUserItem[];
  brandLabel: string;
  homeHref: string;
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
  openGroupId: string | null;
  setOpenGroupId: (id: string | null) => void;
  setKeyboarding: () => void;
  handleTopNavigationOpen: (index: number) => void;
  handleAllNavigationClose: () => void;
  clearLeave: () => void;
  onOpenSearch: () => void;
  onOpenBasket: () => void;
  resetNavigation: () => void;
};

type MockSearchModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<SearchFormSchemaType>;
  variant: string;
};

type MockBasketModalProps = {
  open: boolean;
  onClose: () => void;
  variant: string;
  data: BasketItemProps[];
};

const mobileNavigationMock =
  vi.fn<(props: { items: Array<NavTopLevelItem | NavUserItem> }) => void>();
const desktopNavigationMock = vi.fn<(props: MockDesktopNavigationProps) => void>();
const searchModalMock = vi.fn<(props: MockSearchModalProps) => void>();
const basketModalMock = vi.fn<(props: MockBasketModalProps) => void>();

vi.mock('@/hooks/useNavState', () => ({
  useMegaNavState: vi.fn(),
}));

vi.mock('@/components/Navigation/MobileNavigation/MobileNavigation', () => ({
  MobileNavigation: (props: {
    items: Array<NavTopLevelItem | NavUserItem>;
    brandLabel: string;
    homeHref: string;
  }) => {
    mobileNavigationMock(props);

    return <div data-testid="mobile-navigation" />;
  },
}));

vi.mock('@/components/Navigation/DesktopNavigation/DesktopNavigation', () => ({
  DesktopNavigation: (props: MockDesktopNavigationProps) => {
    const {
      items,
      userItems,
      brandLabel,
      homeHref,
      openIndex,
      setOpenIndex,
      openGroupId,
      setOpenGroupId,
      setKeyboarding,
      handleTopNavigationOpen,
      handleAllNavigationClose,
      clearLeave,
      onOpenSearch,
      onOpenBasket,
      resetNavigation,
    } = props;

    desktopNavigationMock({
      items,
      userItems,
      brandLabel,
      homeHref,
      openIndex,
      setOpenIndex,
      openGroupId,
      setOpenGroupId,
      setKeyboarding,
      handleTopNavigationOpen,
      handleAllNavigationClose,
      clearLeave,
      onOpenSearch,
      onOpenBasket,
      resetNavigation,
    });

    return (
      <div data-testid="desktop-navigation">
        <button
          type="button"
          onClick={onOpenSearch}
        >
          Open search
        </button>

        <button
          type="button"
          onClick={onOpenBasket}
        >
          Open basket
        </button>
      </div>
    );
  },
}));

vi.mock('@/components/Navigation/Modals/SearchModal', () => ({
  SearchModal: (props: MockSearchModalProps) => {
    const { open, onClose, onSubmit, variant } = props;

    searchModalMock({
      open,
      onClose,
      onSubmit,
      variant,
    });

    return (
      <div
        data-testid="search-modal"
        data-open={String(open)}
      >
        <button
          type="button"
          onClick={onClose}
        >
          Close search
        </button>
      </div>
    );
  },
}));

vi.mock('@/components/Navigation/Modals/BasketModal', () => ({
  BasketModal: (props: MockBasketModalProps) => {
    const { open, onClose, variant, data } = props;

    basketModalMock({
      open,
      onClose,
      variant,
      data,
    });

    return (
      <div
        data-testid="basket-modal"
        data-open={String(open)}
      >
        <button
          type="button"
          onClick={onClose}
        >
          Close basket
        </button>
      </div>
    );
  },
}));

describe('Navigation', () => {
  const setOpenIndex: Dispatch<SetStateAction<number | null>> = vi.fn();
  const setOpenGroupId: Dispatch<SetStateAction<string | null>> = vi.fn();
  const setKeyboarding = vi.fn<() => void>();
  const handleTopNavigationOpen = vi.fn<(index: number) => void>();
  const handleAllNavigationClose = vi.fn<() => void>();
  const clearHover = vi.fn<() => void>();
  const clearLeave = vi.fn<() => void>();
  const resetNavigation = vi.fn<() => void>();

  const searchSubmit: SubmitHandler<SearchFormSchemaType> = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useMegaNavState).mockReturnValue({
      openIndex: 2,
      setOpenIndex,
      openGroupId: 'group-1',
      setOpenGroupId,
      isKeyboarding: false,
      setKeyboarding,
      resetNavigation,
      handleTopNavigationOpen,
      handleAllNavigationClose,
      clearHover,
      clearLeave,
    });
  });

  it('renders all composed navigation pieces', () => {
    render(
      <Navigation
        searchSubmit={searchSubmit}
        basketData={[]}
      />
    );

    expect(screen.getByTestId('mobile-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('search-modal')).toBeInTheDocument();
    expect(screen.getByTestId('basket-modal')).toBeInTheDocument();
  });

  it('passes merged items to MobileNavigation', () => {
    const items: NavTopLevelItem[] = [
      { id: 'shop', label: 'Shop' },
      { id: 'about', label: 'About', href: '/about' },
    ];

    const userItems: NavUserItem[] = [
      { id: 'account', label: 'Account', href: '/account', icon: 'user' },
      { id: 'help', label: 'Help', href: '/help', icon: 'help-circle' },
    ];

    render(
      <Navigation
        items={items}
        userItems={userItems}
        searchSubmit={searchSubmit}
        basketData={[]}
      />
    );

    expect(mobileNavigationMock).toHaveBeenCalledTimes(1);
    expect(mobileNavigationMock).toHaveBeenCalledWith({
      items: [...items, ...userItems],
      brandLabel: 'HOAM',
      homeHref: '/',
    });
  });

  it('passes mega nav state and handlers to DesktopNavigation', () => {
    const items: NavTopLevelItem[] = [{ id: 'shop', label: 'Shop' }];
    const userItems: NavUserItem[] = [
      { id: 'account', label: 'Account', href: '/account', icon: 'user' },
    ];

    render(
      <Navigation
        items={items}
        userItems={userItems}
        searchSubmit={searchSubmit}
        basketData={[]}
      />
    );

    expect(desktopNavigationMock).toHaveBeenCalledTimes(1);

    const desktopProps = desktopNavigationMock.mock.calls[0]?.[0];

    expect(desktopProps).toBeDefined();

    expect(desktopProps?.items).toEqual(items);
    expect(desktopProps?.userItems).toEqual(userItems);
    expect(desktopProps?.brandLabel).toBe('HOAM');
    expect(desktopProps?.homeHref).toBe('/');
    expect(desktopProps?.openIndex).toBe(2);
    expect(desktopProps?.setOpenIndex).toBe(setOpenIndex);
    expect(desktopProps?.openGroupId).toBe('group-1');
    expect(desktopProps?.setOpenGroupId).toBe(setOpenGroupId);
    expect(desktopProps?.setKeyboarding).toBe(setKeyboarding);
    expect(desktopProps?.handleTopNavigationOpen).toBe(handleTopNavigationOpen);
    expect(desktopProps?.handleAllNavigationClose).toBe(handleAllNavigationClose);
    expect(desktopProps?.clearLeave).toBe(clearLeave);
    expect(desktopProps?.resetNavigation).toBe(resetNavigation);

    expect(typeof desktopProps?.onOpenSearch).toBe('function');
    expect(typeof desktopProps?.onOpenBasket).toBe('function');
  });

  it('passes search props through to SearchModal', () => {
    render(
      <Navigation
        searchSubmit={searchSubmit}
        basketData={[]}
      />
    );

    expect(searchModalMock).toHaveBeenCalledTimes(1);

    const searchModalProps = searchModalMock.mock.calls[0]?.[0];

    expect(searchModalProps).toBeDefined();

    expect(searchModalProps?.open).toBe(false);
    expect(searchModalProps?.onSubmit).toBe(searchSubmit);
    expect(searchModalProps?.variant).toBe('modal');
    expect(typeof searchModalProps?.onClose).toBe('function');
  });

  it('passes basket props through to BasketModal', () => {
    const basketData: BasketItemProps[] = [
      {
        id: 'basket-1',
        title: 'Product 1',
        summary: 'A lovely thing',
        price: 12.99,
        thumbnail: {
          src: '/product.jpg',
          alt: 'Product 1',
        },
        url: '/product-1',
        onChange: vi.fn(),
        quantity: 2,
      },
    ];

    render(
      <Navigation
        searchSubmit={searchSubmit}
        basketData={basketData}
      />
    );

    expect(basketModalMock).toHaveBeenCalledTimes(1);

    const basketModalProps = basketModalMock.mock.calls[0]?.[0];

    expect(basketModalProps).toBeDefined();

    expect(basketModalProps?.open).toBe(false);
    expect(basketModalProps?.variant).toBe('drawer');
    expect(basketModalProps?.data).toEqual(basketData);
    expect(typeof basketModalProps?.onClose).toBe('function');
  });

  it('opens the search modal when DesktopNavigation triggers onOpenSearch', () => {
    render(
      <Navigation
        searchSubmit={searchSubmit}
        basketData={[]}
      />
    );

    expect(screen.getByTestId('search-modal')).toHaveAttribute('data-open', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Open search' }));

    expect(screen.getByTestId('search-modal')).toHaveAttribute('data-open', 'true');
    expect(searchModalMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        open: true,
      })
    );
  });

  it('closes the search modal when SearchModal triggers onClose', () => {
    render(
      <Navigation
        searchSubmit={searchSubmit}
        basketData={[]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open search' }));
    expect(screen.getByTestId('search-modal')).toHaveAttribute('data-open', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Close search' }));

    expect(screen.getByTestId('search-modal')).toHaveAttribute('data-open', 'false');
    expect(searchModalMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        open: false,
      })
    );
  });

  it('opens the basket modal when DesktopNavigation triggers onOpenBasket', () => {
    render(
      <Navigation
        searchSubmit={searchSubmit}
        basketData={[]}
      />
    );

    expect(screen.getByTestId('basket-modal')).toHaveAttribute('data-open', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Open basket' }));

    expect(screen.getByTestId('basket-modal')).toHaveAttribute('data-open', 'true');
    expect(basketModalMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        open: true,
      })
    );
  });

  it('closes the basket modal when BasketModal triggers onClose', () => {
    render(
      <Navigation
        searchSubmit={searchSubmit}
        basketData={[]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open basket' }));
    expect(screen.getByTestId('basket-modal')).toHaveAttribute('data-open', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Close basket' }));

    expect(screen.getByTestId('basket-modal')).toHaveAttribute('data-open', 'false');
    expect(basketModalMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        open: false,
      })
    );
  });

  it('uses default empty arrays for items and userItems when omitted', () => {
    render(
      <Navigation
        searchSubmit={searchSubmit}
        basketData={[]}
      />
    );

    expect(mobileNavigationMock).toHaveBeenCalledWith({
      items: [],
      brandLabel: 'HOAM',
      homeHref: '/',
    });

    expect(desktopNavigationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        items: [],
        userItems: [],
        brandLabel: 'HOAM',
        homeHref: '/',
      })
    );
  });

  it('passes custom branding props through to desktop and mobile navigation', () => {
    render(
      <Navigation
        brandLabel="Acme"
        homeHref="/welcome"
        searchSubmit={searchSubmit}
        basketData={[]}
      />
    );

    expect(mobileNavigationMock).toHaveBeenCalledWith({
      items: [],
      brandLabel: 'Acme',
      homeHref: '/welcome',
    });

    expect(desktopNavigationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        brandLabel: 'Acme',
        homeHref: '/welcome',
      })
    );
  });

});
