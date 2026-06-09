import { createEvent, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DesktopNavigationActions } from '@/components/Navigation/DesktopNavigation/DesktopNavigationActions';
import type { DesktopNavigationActionsProps, NavUserItem } from '@/components/Navigation/types';
import { useMessages } from '@/hooks/useMessages';
import { LibraryMessages } from '@/lib/i18n/types';

type IconProps = {
  id: string;
};

let lastIconProps: IconProps[] = [];

vi.mock('@/components/Icon', () => ({
  Icon: (props: IconProps) => {
    lastIconProps.push(props);

    return (
      <span
        data-testid={`icon-${props.id}`}
        aria-hidden="true"
      />
    );
  },
}));

vi.mock('@/hooks/useMessages', () => ({
  useMessages: vi.fn(),
}));

const mockedUseMessages = vi.mocked(useMessages);

vi.mock('@/components/Navigation/Navigation.module.css', () => ({
  default: {
    count: 'count',
    countWrapper: 'countWrapper',
    list: 'list',
    item: 'item',
    link: 'link',
  },
}));

vi.mock('@/styles/Util.module.css', () => ({
  default: {
    srOnly: 'srOnly',
  },
}));

function createUserItem(overrides: Partial<NavUserItem> = {}): NavUserItem {
  return {
    id: 'account',
    label: 'Account',
    href: '/account',
    icon: 'account',
    ...overrides,
  };
}

function createProps(
  overrides: Partial<DesktopNavigationActionsProps> = {}
): DesktopNavigationActionsProps {
  return {
    userItems: [createUserItem()],
    onResetNavigation: vi.fn<() => void>(),
    onOpenSearch: vi.fn<() => void>(),
    onOpenBasket: vi.fn<() => void>(),
    ...overrides,
  };
}

describe('DesktopNavigationActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lastIconProps = [];

    mockedUseMessages.mockImplementation((key) => {
      if (key !== 'navigation') {
        throw new Error(`Unexpected key: ${String(key)}`);
      }
      return {
        userNavigation: 'User navigation',
      } as LibraryMessages['navigation'];
    });
  });

  it('renders nothing when userItems is empty', () => {
    const props = createProps({
      userItems: [],
    });

    const { container } = render(<DesktopNavigationActions {...props} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders a nav with the translated aria-label', () => {
    const props = createProps();

    render(<DesktopNavigationActions {...props} />);

    const nav = screen.getByRole('navigation', { name: 'User navigation' });
    expect(nav).toBeInTheDocument();
    expect(useMessages).toHaveBeenCalledWith('navigation');
  });

  it('renders the user action list aligned to the right', () => {
    const props = createProps();

    render(<DesktopNavigationActions {...props} />);

    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('data-alignment', 'right');
    expect(list).toHaveClass('list');
  });

  it('renders one list item and link per user item', () => {
    const props = createProps({
      userItems: [
        createUserItem({
          id: 'account',
          label: 'Account',
          href: '/account',
          icon: 'account',
        }),
        createUserItem({
          id: 'wishlist',
          label: 'Wishlist',
          href: '/wishlist',
          icon: 'heart',
        }),
      ],
    });

    render(<DesktopNavigationActions {...props} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);

    expect(links[0]).toHaveAttribute('href', '/account');
    expect(links[0]).toHaveAttribute('title', 'Account');
    expect(links[0]).toHaveAttribute('data-top-cyclable');
    expect(links[0]).toHaveClass('link');

    expect(links[1]).toHaveAttribute('href', '/wishlist');
    expect(links[1]).toHaveAttribute('title', 'Wishlist');
    expect(links[1]).toHaveAttribute('data-top-cyclable');
    expect(links[1]).toHaveClass('link');
  });

  it('renders icons for each user item', () => {
    const props = createProps({
      userItems: [
        createUserItem({
          id: 'account',
          label: 'Account',
          href: '/account',
          icon: 'account',
        }),
        createUserItem({
          id: 'basket',
          label: 'Basket',
          href: '/basket',
          icon: 'basket',
        }),
      ],
    });

    render(<DesktopNavigationActions {...props} />);

    expect(screen.getByTestId('icon-account')).toBeInTheDocument();
    expect(screen.getByTestId('icon-basket')).toBeInTheDocument();
    expect(lastIconProps).toHaveLength(2);
    expect(lastIconProps[0]?.id).toBe('account');
    expect(lastIconProps[1]?.id).toBe('basket');
  });

  it('renders sr-only text for each user item label', () => {
    const props = createProps({
      userItems: [
        createUserItem({
          id: 'account',
          label: 'Account',
          href: '/account',
          icon: 'account',
        }),
      ],
    });

    render(<DesktopNavigationActions {...props} />);

    const srText = screen.getByText('Account');
    expect(srText.tagName).toBe('SPAN');
    expect(srText).toHaveClass('srOnly');
  });

  it('does not render a count badge when the user item has no count', () => {
    const props = createProps({
      userItems: [
        createUserItem({
          id: 'basket',
          label: 'Basket',
          href: '/basket',
          icon: 'basket',
        }),
      ],
    });

    render(<DesktopNavigationActions {...props} />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Basket' })).not.toHaveAttribute('aria-label');
  });

  it('renders the full visual count when it is two digits or fewer', () => {
    const props = createProps({
      userItems: [
        createUserItem({
          id: 'basket',
          label: 'Basket',
          href: '/basket',
          icon: 'basket',
          count: 12,
        }),
      ],
    });

    render(<DesktopNavigationActions {...props} />);

    const count = screen.getByText('12');
    expect(count).toHaveClass('count');
    expect(count).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('link', { name: 'Basket 12' })).toBeInTheDocument();
  });

  it('caps the visual count at two digits while exposing the full count to screen readers', () => {
    const props = createProps({
      userItems: [
        createUserItem({
          id: 'basket',
          label: 'Basket',
          href: '/basket',
          icon: 'basket',
          count: 123,
        }),
      ],
    });

    render(<DesktopNavigationActions {...props} />);

    const count = screen.getByText('99+');
    expect(count).toHaveClass('count');
    expect(count).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('link', { name: 'Basket 123' })).toBeInTheDocument();
  });

  it('calls onResetNavigation on focus capture', () => {
    const props = createProps();

    render(<DesktopNavigationActions {...props} />);

    const nav = screen.getByRole('navigation', { name: 'User navigation' });

    fireEvent.focus(nav);

    expect(props.onResetNavigation).toHaveBeenCalledTimes(1);
  });

  it('calls onResetNavigation on pointer enter', () => {
    const props = createProps();

    render(<DesktopNavigationActions {...props} />);

    const nav = screen.getByRole('navigation', { name: 'User navigation' });

    fireEvent.pointerEnter(nav);

    expect(props.onResetNavigation).toHaveBeenCalledTimes(1);
  });

  it('opens search and prevents default for USER_SEARCH', () => {
    const props = createProps({
      userItems: [
        createUserItem({
          id: 'search',
          label: 'Search',
          href: '/search',
          icon: 'search',
          action: 'USER_SEARCH',
        }),
      ],
    });

    render(<DesktopNavigationActions {...props} />);

    const link = screen.getByRole('link', { name: 'Search' });

    const event = createEvent.click(link, { bubbles: true, cancelable: true });
    fireEvent(link, event);

    expect(event.defaultPrevented).toBe(true);
    expect(props.onOpenSearch).toHaveBeenCalledTimes(1);
    expect(props.onOpenBasket).not.toHaveBeenCalled();
  });

  it('opens basket and prevents default for USER_BASKET', () => {
    const props = createProps({
      userItems: [
        createUserItem({
          id: 'basket',
          label: 'Basket',
          href: '/basket',
          icon: 'basket',
          action: 'USER_BASKET',
        }),
      ],
    });

    render(<DesktopNavigationActions {...props} />);

    const link = screen.getByRole('link', { name: 'Basket' });

    const event = createEvent.click(link, { bubbles: true, cancelable: true });
    fireEvent(link, event);

    expect(event.defaultPrevented).toBe(true);
    expect(props.onOpenBasket).toHaveBeenCalledTimes(1);
    expect(props.onOpenSearch).not.toHaveBeenCalled();
  });

  it('does not intercept clicks when no action is provided', () => {
    const props = createProps({
      userItems: [
        createUserItem({
          id: 'account',
          label: 'Account',
          href: '#account',
          icon: 'account',
        }),
      ],
    });

    render(<DesktopNavigationActions {...props} />);

    const link = screen.getByRole('link', { name: 'Account' });

    const event = createEvent.click(link, { bubbles: true, cancelable: true });
    fireEvent(link, event);

    expect(event.defaultPrevented).toBe(false);
    expect(props.onOpenSearch).not.toHaveBeenCalled();
    expect(props.onOpenBasket).not.toHaveBeenCalled();
  });

  it('renders multiple mixed actions correctly', () => {
    const props = createProps({
      userItems: [
        createUserItem({
          id: 'search',
          label: 'Search',
          href: '/search',
          icon: 'search',
          action: 'USER_SEARCH',
        }),
        createUserItem({
          id: 'basket',
          label: 'Basket',
          href: '/basket',
          icon: 'basket',
          action: 'USER_BASKET',
        }),
        createUserItem({
          id: 'account',
          label: 'Account',
          href: '#account',
          icon: 'account',
        }),
      ],
    });

    render(<DesktopNavigationActions {...props} />);

    const searchLink = screen.getByRole('link', { name: 'Search' });
    const basketLink = screen.getByRole('link', { name: 'Basket' });
    const accountLink = screen.getByRole('link', { name: 'Account' });

    const searchEvent = createEvent.click(searchLink, { bubbles: true, cancelable: true });
    fireEvent(searchLink, searchEvent);

    const basketEvent = createEvent.click(basketLink, { bubbles: true, cancelable: true });
    fireEvent(basketLink, basketEvent);

    const accountEvent = createEvent.click(accountLink, { bubbles: true, cancelable: true });
    fireEvent(accountLink, accountEvent);

    expect(searchEvent.defaultPrevented).toBe(true);
    expect(basketEvent.defaultPrevented).toBe(true);
    expect(accountEvent.defaultPrevented).toBe(false);

    expect(props.onOpenSearch).toHaveBeenCalledTimes(1);
    expect(props.onOpenBasket).toHaveBeenCalledTimes(1);
  });

  it('applies item class to each list item', () => {
    const props = createProps({
      userItems: [
        createUserItem({
          id: 'account',
          label: 'Account',
          href: '/account',
          icon: 'account',
        }),
        createUserItem({
          id: 'basket',
          label: 'Basket',
          href: '/basket',
          icon: 'basket',
        }),
      ],
    });

    render(<DesktopNavigationActions {...props} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveClass('item');
    expect(listItems[1]).toHaveClass('item');
  });
});
