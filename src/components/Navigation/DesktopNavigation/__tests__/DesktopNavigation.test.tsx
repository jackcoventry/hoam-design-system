import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DesktopNavigation,
  type DesktopNavigationProps,
} from '@/components/Navigation/DesktopNavigation/DesktopNavigation';
import { querySubItemVisibility } from '@/components/Navigation/helpers';
import type {
  DesktopNavigationActionsProps,
  DesktopNavigationItemsProps,
  DesktopNavigationLogoProps,
  NavTopLevelItem,
  NavUserItem,
} from '@/components/Navigation/types';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';

vi.mock('@/components/Layout', () => ({
  Container: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div
      data-testid="container"
      className={className}
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

const desktopNavigationItemsMock = vi.fn();
const desktopNavigationLogoMock = vi.fn();
const desktopNavigationActionsMock = vi.fn();

type KeyboardNavHandler = (event: KeyboardEvent) => void;

type KeyboardNavConfig = {
  rootRef: React.RefObject<HTMLElement | null>;
  items: NavTopLevelItem[];
  setOpenIndex: (index: number | null) => void;
  setOpenGroupId: (id: string | null) => void;
  mapArrow: (key: string) => string;
  subSelectors: {
    subTriggersOnly: (panelRoot: Element) => HTMLElement[];
    subInteractive: (panelRoot: Element) => HTMLElement[];
    thirdList: (container: Element, domId: string) => HTMLElement[];
  };
};

let lastDesktopNavigationItemsProps: DesktopNavigationItemsProps | null = null;
let lastKeyboardNavConfig: KeyboardNavConfig | null = null;

vi.mock('@/components/Navigation/DesktopNavigation/DesktopNavigationItems', () => ({
  DesktopNavigationItems: (props: DesktopNavigationItemsProps) => {
    lastDesktopNavigationItemsProps = props;
    desktopNavigationItemsMock(props);

    return (
      <div data-testid="desktop-navigation-items">
        <button
          type="button"
          data-testid="trigger-open-first-category"
          onClick={() => {
            props.onOpenFirstCategory(0);
          }}
        >
          Open first category
        </button>

        <button
          type="button"
          data-testid="trigger-reset-navigation-from-items"
          onClick={props.onResetNavigation}
        >
          Reset from items
        </button>
      </div>
    );
  },
}));

vi.mock('@/components/Navigation/DesktopNavigation/DesktopNavigationLogo', () => ({
  DesktopNavigationLogo: (props: DesktopNavigationLogoProps) => {
    desktopNavigationLogoMock(props);

    return (
      <button
        type="button"
        data-testid="desktop-navigation-logo"
        onClick={props.onResetNavigation}
      >
        Logo
      </button>
    );
  },
}));

vi.mock('@/components/Navigation/DesktopNavigation/DesktopNavigationActions', () => ({
  DesktopNavigationActions: (props: DesktopNavigationActionsProps) => {
    desktopNavigationActionsMock(props);

    return (
      <div data-testid="desktop-navigation-actions">
        <button
          type="button"
          data-testid="open-search"
          onClick={props.onOpenSearch}
        >
          Open search
        </button>

        <button
          type="button"
          data-testid="open-basket"
          onClick={props.onOpenBasket}
        >
          Open basket
        </button>

        <button
          type="button"
          data-testid="reset-from-actions"
          onClick={props.onResetNavigation}
        >
          Reset from actions
        </button>
      </div>
    );
  },
}));

vi.mock('@/components/Navigation/helpers', () => ({
  querySubItemVisibility: vi.fn(),
}));

const keyboardHandlerMock = vi.fn<(event: KeyboardEvent) => void>();
const useKeyboardNavMock = vi.fn<(config: KeyboardNavConfig) => KeyboardNavHandler>();

vi.mock('@/hooks/useKeyboardNav', () => ({
  useKeyboardNav: vi.fn((config: KeyboardNavConfig) => {
    lastKeyboardNavConfig = config;
    return useKeyboardNavMock(config);
  }),
}));

vi.mock('@/components/Navigation/Navigation.module.css', () => ({
  default: {
    root: 'root',
    gridWrapper: 'gridWrapper',
    inner: 'inner',
  },
}));

function createNavItems(): NavTopLevelItem[] {
  return [
    {
      id: 'shop',
      label: 'Shop',
      href: '/shop',
      items: [
        {
          id: 'shop-group-1',
          label: 'Featured',
          layout: 'list',
          items: [
            {
              id: 'shop-branch-1',
              label: 'New in',
              items: [
                {
                  id: 'shop-leaf-1',
                  label: 'Latest arrivals',
                  href: '/shop/new-in',
                },
              ],
            },
          ],
        },
        {
          id: 'shop-group-2',
          label: 'Clothing',
          layout: 'list',
          items: [
            {
              id: 'shop-branch-2',
              label: 'Outerwear',
              items: [
                {
                  id: 'shop-leaf-2',
                  label: 'Jackets',
                  href: '/shop/jackets',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'discover',
      label: 'Discover',
      href: '/discover',
      items: [
        {
          id: 'discover-group-1',
          label: 'Stories',
          layout: 'list',
          items: [
            {
              id: 'discover-branch-1',
              label: 'Editorial',
              items: [
                {
                  id: 'discover-leaf-1',
                  label: 'Journal',
                  href: '/discover/journal',
                },
              ],
            },
          ],
        },
      ],
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
  ];
}

function createProps(overrides: Partial<DesktopNavigationProps> = {}): DesktopNavigationProps {
  return {
    items: createNavItems(),
    userItems: createUserItems(),
    brandLabel: 'HOAM',
    homeHref: '/',
    openIndex: null,
    setOpenIndex: vi.fn<(index: number | null) => void>(),
    openGroupId: null,
    setOpenGroupId: vi.fn<(id: string | null) => void>(),
    setKeyboarding: vi.fn<() => void>(),
    handleTopNavigationOpen: vi.fn<(index: number) => void>(),
    handleAllNavigationClose: vi.fn<() => void>(),
    clearLeave: vi.fn<() => void>(),
    onOpenSearch: vi.fn<() => void>(),
    onOpenBasket: vi.fn<() => void>(),
    resetNavigation: vi.fn<() => void>(),
    ...overrides,
  };
}

function getHeader(): HTMLElement {
  return screen.getByRole('none');
}

describe('DesktopNavigation', () => {
  const originalDir = document.dir;

  beforeEach(() => {
    vi.clearAllMocks();
    document.dir = 'ltr';
    lastDesktopNavigationItemsProps = null;
    lastKeyboardNavConfig = null;

    useKeyboardNavMock.mockReturnValue((event: KeyboardEvent) => {
      keyboardHandlerMock(event);
    });

    vi.mocked(querySubItemVisibility).mockImplementation(<T extends HTMLElement>(): T[] => []);
  });

  afterEach(() => {
    document.dir = originalDir;
  });

  it('renders the layout and child navigation components', () => {
    const props = createProps({
      openIndex: 1,
      openGroupId: 'shop-group-1',
    });

    render(<DesktopNavigation {...props} />);

    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
    expect(screen.getByTestId('grid-item')).toHaveAttribute('data-span', '12');
    expect(screen.getByTestId('desktop-navigation-items')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-navigation-logo')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-navigation-actions')).toBeInTheDocument();

    expect(lastDesktopNavigationItemsProps).not.toBeNull();

    if (!lastDesktopNavigationItemsProps) {
      throw new Error('Expected DesktopNavigationItems to be rendered');
    }

    expect(lastDesktopNavigationItemsProps.items).toBe(props.items);
    expect(lastDesktopNavigationItemsProps.openIndex).toBe(1);
    expect(lastDesktopNavigationItemsProps.openGroupId).toBe('shop-group-1');
    expect(lastDesktopNavigationItemsProps.setOpenGroupId).toBe(props.setOpenGroupId);
    expect(lastDesktopNavigationItemsProps.handleTopNavigationOpen).toBe(
      props.handleTopNavigationOpen
    );
    expect(lastDesktopNavigationItemsProps.clearLeave).toBe(props.clearLeave);
    expect(typeof lastDesktopNavigationItemsProps.onOpenFirstCategory).toBe('function');
    expect(lastDesktopNavigationItemsProps.onResetNavigation).toBe(props.resetNavigation);

    expect(desktopNavigationLogoMock).toHaveBeenCalledTimes(1);
    expect(desktopNavigationLogoMock).toHaveBeenCalledWith(
      expect.objectContaining({
        onResetNavigation: props.resetNavigation,
        brandLabel: 'HOAM',
        homeHref: '/',
      })
    );
    expect(desktopNavigationActionsMock).toHaveBeenCalledTimes(1);
  });

  it('sets data-open to false when openIndex is null', () => {
    const props = createProps({ openIndex: null });

    render(<DesktopNavigation {...props} />);

    const inner = screen.getByTestId('desktop-navigation-items').parentElement;
    expect(inner).toHaveAttribute('data-open', 'false');
  });

  it('sets data-open to true when openIndex is a number', () => {
    const props = createProps({ openIndex: 0 });

    render(<DesktopNavigation {...props} />);

    const inner = screen.getByTestId('desktop-navigation-items').parentElement;
    expect(inner).toHaveAttribute('data-open', 'true');
  });

  it('calls handleAllNavigationClose on pointer leave', () => {
    const props = createProps();

    render(<DesktopNavigation {...props} />);

    fireEvent.pointerLeave(getHeader());

    expect(props.handleAllNavigationClose).toHaveBeenCalledTimes(1);
  });

  it('calls clearLeave on pointer enter', () => {
    const props = createProps();

    render(<DesktopNavigation {...props} />);

    fireEvent.pointerEnter(getHeader());

    expect(props.clearLeave).toHaveBeenCalledTimes(1);
  });

  it('calls setKeyboarding and the hook-provided keyboard handler on keydown', () => {
    const props = createProps();

    render(<DesktopNavigation {...props} />);

    fireEvent.keyDown(getHeader(), { key: 'ArrowRight' });

    expect(props.setKeyboarding).toHaveBeenCalledTimes(1);
    expect(keyboardHandlerMock).toHaveBeenCalledTimes(1);
  });

  it('passes the expected config into useKeyboardNav', () => {
    const props = createProps();

    render(<DesktopNavigation {...props} />);

    expect(useKeyboardNav).toHaveBeenCalledTimes(1);

    if (!lastKeyboardNavConfig) {
      throw new Error('Expected useKeyboardNav to be called');
    }

    expect(lastKeyboardNavConfig.items).toBe(props.items);
    expect(lastKeyboardNavConfig.setOpenIndex).toBe(props.setOpenIndex);
    expect(lastKeyboardNavConfig.setOpenGroupId).toBe(props.setOpenGroupId);
    expect(typeof lastKeyboardNavConfig.mapArrow).toBe('function');
    expect(typeof lastKeyboardNavConfig.subSelectors.subTriggersOnly).toBe('function');
    expect(typeof lastKeyboardNavConfig.subSelectors.subInteractive).toBe('function');
    expect(typeof lastKeyboardNavConfig.subSelectors.thirdList).toBe('function');
    expect(lastKeyboardNavConfig.rootRef.current).toBeInstanceOf(HTMLElement);
  });

  it('creates the subTriggersOnly selector correctly', () => {
    const props = createProps();

    render(<DesktopNavigation {...props} />);

    if (!lastKeyboardNavConfig) {
      throw new Error('Expected useKeyboardNav to be called');
    }

    const panelRoot = document.createElement('div');

    lastKeyboardNavConfig.subSelectors.subTriggersOnly(panelRoot);

    expect(querySubItemVisibility).toHaveBeenCalledWith(panelRoot, '[data-sub-trigger]');
  });

  it('creates the subInteractive selector correctly', () => {
    const props = createProps();

    render(<DesktopNavigation {...props} />);

    if (!lastKeyboardNavConfig) {
      throw new Error('Expected useKeyboardNav to be called');
    }

    const panelRoot = document.createElement('div');

    lastKeyboardNavConfig.subSelectors.subInteractive(panelRoot);

    expect(querySubItemVisibility).toHaveBeenCalledWith(
      panelRoot,
      '[data-sub-trigger], [data-sub-link]'
    );
  });

  it('creates the thirdList selector correctly', () => {
    const props = createProps();

    render(<DesktopNavigation {...props} />);

    if (!lastKeyboardNavConfig) {
      throw new Error('Expected useKeyboardNav to be called');
    }

    const container = document.createElement('div');

    lastKeyboardNavConfig.subSelectors.thirdList(container, 'shop-group-1');

    expect(querySubItemVisibility).toHaveBeenCalledWith(
      container,
      '#shop-group-1-panel [data-sub-link]'
    );
  });

  it('maps arrows unchanged in LTR', () => {
    document.dir = 'ltr';
    const props = createProps();

    render(<DesktopNavigation {...props} />);

    if (!lastKeyboardNavConfig) {
      throw new Error('Expected useKeyboardNav to be called');
    }

    expect(lastKeyboardNavConfig.mapArrow('ArrowLeft')).toBe('ArrowLeft');
    expect(lastKeyboardNavConfig.mapArrow('ArrowRight')).toBe('ArrowRight');
    expect(lastKeyboardNavConfig.mapArrow('Enter')).toBe('Enter');
  });

  it('swaps horizontal arrows in RTL', () => {
    document.dir = 'rtl';
    const props = createProps();

    render(<DesktopNavigation {...props} />);

    if (!lastKeyboardNavConfig) {
      throw new Error('Expected useKeyboardNav to be called');
    }

    expect(lastKeyboardNavConfig.mapArrow('ArrowLeft')).toBe('ArrowRight');
    expect(lastKeyboardNavConfig.mapArrow('ArrowRight')).toBe('ArrowLeft');
    expect(lastKeyboardNavConfig.mapArrow('Escape')).toBe('Escape');
  });

  it('opens the first category by using the first child group id', () => {
    const props = createProps();

    render(<DesktopNavigation {...props} />);

    fireEvent.click(screen.getByTestId('trigger-open-first-category'));

    expect(props.setOpenGroupId).toHaveBeenCalledWith('shop-group-1');
  });

  it('sets openGroupId to null when the selected top-level item has no groups', () => {
    const props = createProps({
      items: [
        {
          id: 'empty',
          label: 'Empty',
          href: '/empty',
          items: [],
        },
      ],
    });

    render(<DesktopNavigation {...props} />);

    fireEvent.click(screen.getByTestId('trigger-open-first-category'));

    expect(props.setOpenGroupId).toHaveBeenCalledWith(null);
  });

  it('sets openGroupId to null when the selected top-level index is out of range', () => {
    const props = createProps();

    render(<DesktopNavigation {...props} />);

    if (!lastDesktopNavigationItemsProps) {
      throw new Error('Expected DesktopNavigationItems to be rendered');
    }

    lastDesktopNavigationItemsProps.onOpenFirstCategory(99);

    expect(props.setOpenGroupId).toHaveBeenCalledWith(null);
  });

  it('wires resetNavigation through DesktopNavigationItems', () => {
    const props = createProps();

    render(<DesktopNavigation {...props} />);

    fireEvent.click(screen.getByTestId('trigger-reset-navigation-from-items'));

    expect(props.resetNavigation).toHaveBeenCalledTimes(1);
  });

  it('wires resetNavigation through DesktopNavigationLogo', () => {
    const props = createProps();

    render(<DesktopNavigation {...props} />);

    fireEvent.click(screen.getByTestId('desktop-navigation-logo'));

    expect(props.resetNavigation).toHaveBeenCalledTimes(1);
  });

  it('wires onOpenSearch through DesktopNavigationActions', () => {
    const props = createProps();

    render(<DesktopNavigation {...props} />);

    fireEvent.click(screen.getByTestId('open-search'));

    expect(props.onOpenSearch).toHaveBeenCalledTimes(1);
  });

  it('wires onOpenBasket through DesktopNavigationActions', () => {
    const props = createProps();

    render(<DesktopNavigation {...props} />);

    fireEvent.click(screen.getByTestId('open-basket'));

    expect(props.onOpenBasket).toHaveBeenCalledTimes(1);
  });

  it('wires resetNavigation through DesktopNavigationActions', () => {
    const props = createProps();

    render(<DesktopNavigation {...props} />);

    fireEvent.click(screen.getByTestId('reset-from-actions'));

    expect(props.resetNavigation).toHaveBeenCalledTimes(1);
  });

  it('renders safely with empty navigation arrays', () => {
    const props = createProps({
      items: [],
      userItems: [],
    });

    render(<DesktopNavigation {...props} />);

    expect(screen.getByTestId('desktop-navigation-items')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-navigation-logo')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-navigation-actions')).toBeInTheDocument();
  });
});
