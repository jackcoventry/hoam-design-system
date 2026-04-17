import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MobileNavigation } from '@/components/Navigation/MobileNavigation/MobileNavigation';
import type { NavTreeItem } from '@/components/Navigation/types';
import { useMessages } from '@/hooks/useMessages';
import { SITE } from '@/constants/site';
import { LibraryMessages } from '@/lib/i18n/types';

type MockMobileNavigationItemProps = {
  item: NavTreeItem;
};

type FocusTrapArgs = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  active: boolean;
  onEscape: () => void;
};

let capturedMobileNavigationItemProps: MockMobileNavigationItemProps[] = [];
let lastFocusTrapArgs: FocusTrapArgs | null = null;

vi.mock('@/components/Icon', () => ({
  Icon: ({ id }: { id: string }) => (
    <span
      data-testid={`icon-${id}`}
      aria-hidden="true"
    />
  ),
}));

vi.mock('@/components/Layout', () => ({
  Container: ({ children, width }: { children: ReactNode; width?: string }) => (
    <div
      data-testid="container"
      data-width={width ?? ''}
    >
      {children}
    </div>
  ),
  Grid: ({ children }: { children: ReactNode }) => <div data-testid="grid">{children}</div>,
  GridItem: ({ children, span }: { children: ReactNode; span: number }) => (
    <div
      data-testid="grid-item"
      data-span={String(span)}
    >
      {children}
    </div>
  ),
}));

vi.mock('@/components/Navigation/MobileNavigation/MobileNavigationItem', () => ({
  MobileNavigationItem: (props: MockMobileNavigationItemProps) => {
    capturedMobileNavigationItemProps.push(props);

    return <li data-testid={`mobile-nav-item-${props.item.id}`}>{props.item.label}</li>;
  },
}));

const useFocusTrapMock = vi.fn<(args: FocusTrapArgs) => void>();

vi.mock('@/hooks/useFocusTrap', () => ({
  useFocusTrap: (args: FocusTrapArgs) => {
    lastFocusTrapArgs = args;
    useFocusTrapMock(args);
  },
}));

vi.mock('@/hooks/useMessages', () => ({
  useMessages: vi.fn(),
}));

vi.mock('@/components/Navigation/MobileNavigation/MobileNavigation.module.css', () => ({
  default: {
    root: 'root',
    wrapper: 'wrapper',
    inner: 'inner',
    logo: 'logo',
    toggle: 'toggle',
    mobileMenu: 'mobileMenu',
    list: 'list',
  },
}));

function createItems(): NavTreeItem[] {
  return [
    {
      id: 'shop',
      label: 'Shop',
      href: '/shop',
    },
    {
      id: 'discover',
      label: 'Discover',
      items: [
        {
          id: 'journal',
          label: 'Journal',
          href: '/journal',
        },
      ],
    },
  ];
}
const mockedUseMessages = vi.mocked(useMessages);

describe('MobileNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedMobileNavigationItemProps = [];
    lastFocusTrapArgs = null;

    mockedUseMessages.mockImplementation((key) => {
      if (key !== 'navigation') {
        throw new Error(`Unexpected key: ${String(key)}`);
      }
      return {
        open: 'Open menu',
        close: 'Close menu',
        mainNavigation: 'Main navigation',
      } as LibraryMessages['navigation'];
    });
  });

  it('renders the header shell and site logo link', () => {
    render(<MobileNavigation items={createItems()} />);

    const logo = screen.getByRole('link', { name: SITE.title });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('href', '/');
  });

  it('renders the layout components', () => {
    render(<MobileNavigation items={createItems()} />);

    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('container')).toHaveAttribute('data-width', 'full');
    expect(screen.getByTestId('grid')).toBeInTheDocument();
    expect(screen.getByTestId('grid-item')).toHaveAttribute('data-span', '12');
  });

  it('renders the toggle button closed by default', () => {
    render(<MobileNavigation items={createItems()} />);

    const toggle = screen.getByRole('button', { name: 'Open menu' });

    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTestId('icon-three-dots-vertical')).toBeInTheDocument();
  });

  it('renders the menu closed by default', () => {
    const { container } = render(<MobileNavigation items={createItems()} />);

    const menu = container.querySelector('.mobileMenu');
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveAttribute('data-state', 'closed');
  });

  it('opens the menu when the toggle is clicked', () => {
    const { container } = render(<MobileNavigation items={createItems()} />);

    const toggle = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(toggle);

    const openToggle = screen.getByRole('button', { name: 'Close menu' });
    const menu = container.querySelector('.mobileMenu');

    expect(openToggle).toHaveAttribute('aria-expanded', 'true');
    expect(menu).toHaveAttribute('data-state', 'open');
  });

  it('closes the menu when the toggle is clicked twice', () => {
    const { container } = render(<MobileNavigation items={createItems()} />);

    const toggle = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(toggle);
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));

    const closedToggle = screen.getByRole('button', { name: 'Open menu' });
    const menu = container.querySelector('.mobileMenu');

    expect(closedToggle).toHaveAttribute('aria-expanded', 'false');
    expect(menu).toHaveAttribute('data-state', 'closed');
  });

  it('renders the navigation with the translated aria-label', () => {
    render(<MobileNavigation items={createItems()} />);

    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('renders one MobileNavigationItem per top-level item', () => {
    render(<MobileNavigation items={createItems()} />);

    expect(screen.getByTestId('mobile-nav-item-shop')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-nav-item-discover')).toBeInTheDocument();
    expect(capturedMobileNavigationItemProps).toHaveLength(2);
  });

  it('passes the correct items to MobileNavigationItem', () => {
    const items = createItems();

    render(<MobileNavigation items={items} />);

    expect(capturedMobileNavigationItemProps[0]?.item).toBe(items[0]);
    expect(capturedMobileNavigationItemProps[1]?.item).toBe(items[1]);
  });

  it('calls useMessages with the navigation namespace', () => {
    render(<MobileNavigation items={createItems()} />);

    expect(useMessages).toHaveBeenCalledWith('navigation');
  });

  it('wires useFocusTrap with the container ref and inactive state by default', () => {
    render(<MobileNavigation items={createItems()} />);

    expect(useFocusTrapMock).toHaveBeenCalledTimes(1);
    expect(lastFocusTrapArgs).not.toBeNull();

    if (!lastFocusTrapArgs) {
      throw new Error('Expected useFocusTrap args to be captured');
    }

    expect(lastFocusTrapArgs.active).toBe(false);
    expect(lastFocusTrapArgs.containerRef.current?.tagName).toBe('HEADER');
  });

  it('updates useFocusTrap active=true when opened', () => {
    render(<MobileNavigation items={createItems()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(lastFocusTrapArgs).not.toBeNull();

    if (!lastFocusTrapArgs) {
      throw new Error('Expected useFocusTrap args to be captured');
    }

    expect(lastFocusTrapArgs.active).toBe(true);
  });

  it('closes the menu when the focus trap onEscape callback runs', () => {
    const { container } = render(<MobileNavigation items={createItems()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    if (!lastFocusTrapArgs) {
      throw new Error('Expected useFocusTrap args to be captured');
    }

    act(() => {
      lastFocusTrapArgs?.onEscape();
    });

    const menu = container.querySelector('.mobileMenu');
    expect(menu).toHaveAttribute('data-state', 'closed');
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('links the toggle button to the menu via aria-controls', () => {
    const { container } = render(<MobileNavigation items={createItems()} />);

    const toggle = screen.getByRole('button', { name: 'Open menu' });
    const menu = container.querySelector('.mobileMenu');

    expect(menu).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-controls');

    const controlsId = toggle.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();
    expect(menu).toHaveAttribute('id', controlsId ?? '');
  });

  it('renders safely with an empty items array', () => {
    render(<MobileNavigation items={[]} />);

    expect(screen.getByRole('link', { name: SITE.title })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(capturedMobileNavigationItemProps).toHaveLength(0);
  });
});
