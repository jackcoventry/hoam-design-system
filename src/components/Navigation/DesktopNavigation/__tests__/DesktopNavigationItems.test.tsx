import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DesktopNavigationItems } from '@/components/Navigation/DesktopNavigation/DesktopNavigationItems';
import { panelId, topTriggerId } from '@/components/Navigation/helpers';
import type {
  CategoryGroupProps,
  DesktopNavigationItemsProps,
  NavBranchItem,
  NavGroupItem,
  NavPanelItem,
  NavTopLevelItem,
  PanelProps,
  PromoBlockProps,
  ThirdLevelItemsProps,
  TopNavigationItemProps,
} from '@/components/Navigation/types';
import { useMessages } from '@/hooks/useMessages';
import { LibraryMessages } from '@/lib/i18n/types';

let capturedTopNavigationItemProps: TopNavigationItemProps[] = [];
let capturedPanelProps: PanelProps[] = [];
let capturedCategoryGroupProps: CategoryGroupProps[] = [];
let capturedThirdLevelItemsProps: ThirdLevelItemsProps[] = [];
let capturedPromoBlockProps: PromoBlockProps[] = [];

vi.mock('@/hooks/useMessages', () => ({
  useMessages: vi.fn(),
}));

const mockedUseMessages = vi.mocked(useMessages);

vi.mock('@/components/Navigation/helpers', () => ({
  panelId: vi.fn((id: string) => `${id}-panel`),
  topTriggerId: vi.fn((id: string) => `${id}-trigger`),
}));

vi.mock('@/components/Navigation/Navigation.module.css', () => ({
  default: {
    panelTopLevel: 'panelTopLevel',
    group: 'group',
    groupTopLink: 'groupTopLink',
    promoWrapper: 'promoWrapper',
  },
}));

vi.mock('@/components/Navigation/MainNavigation/TopNavigation', () => ({
  TopNavigation: ({ children }: { children: ReactNode }) => (
    <nav data-testid="top-navigation">{children}</nav>
  ),
}));

vi.mock('@/components/Navigation/MainNavigation/TopNavigationItem', () => ({
  TopNavigationItem: (props: TopNavigationItemProps) => {
    capturedTopNavigationItemProps.push(props);

    return (
      <section
        data-testid={`top-navigation-item-${props.item.id}`}
        data-open={props.isOpen ? 'true' : 'false'}
        data-has-panel={props.hasPanel ? 'true' : 'false'}
      >
        <button
          type="button"
          data-testid={`hover-open-${props.item.id}`}
          onClick={props.onHoverOpen}
        >
          Hover open
        </button>

        <button
          type="button"
          data-testid={`hover-close-${props.item.id}`}
          onClick={props.onHoverClose}
        >
          Hover close
        </button>

        <button
          type="button"
          data-testid={`focus-open-${props.item.id}`}
          onClick={props.onFocusOpen}
        >
          Focus open
        </button>

        {props.children}
      </section>
    );
  },
}));

vi.mock('@/components/Navigation/MainNavigation/Panel', () => ({
  Panel: (props: PanelProps) => {
    capturedPanelProps.push(props);

    return (
      <div
        data-testid={`panel-${props.id}`}
        data-hidden={props.hidden ? 'true' : 'false'}
        data-labelledby={props.labelledBy}
      >
        <button
          type="button"
          data-testid={`panel-enter-${props.id}`}
          onClick={props.onEnter}
        >
          Enter panel
        </button>

        <div data-testid={`panel-left-${props.id}`}>{props.left}</div>
        <div data-testid={`panel-right-${props.id}`}>{props.right}</div>
      </div>
    );
  },
}));

vi.mock('@/components/Navigation/MainNavigation/CategoryGroup', () => ({
  CategoryGroup: (props: CategoryGroupProps) => {
    capturedCategoryGroupProps.push(props);

    return (
      <div
        data-testid={`category-group-${props.subitem.id}`}
        data-open={props.open ? 'true' : 'false'}
      >
        <button
          type="button"
          data-testid={`category-hover-open-${props.subitem.id}`}
          onClick={props.onHoverOpen}
        >
          Open category on hover
        </button>

        <button
          type="button"
          data-testid={`category-focus-open-${props.subitem.id}`}
          onClick={props.onFocusOpen}
        >
          Open category on focus
        </button>

        {props.children}
      </div>
    );
  },
}));

vi.mock('@/components/Navigation/MainNavigation/ThirdLevelItems', () => ({
  ThirdLevelItems: (props: ThirdLevelItemsProps) => {
    capturedThirdLevelItemsProps.push(props);

    return (
      <div
        data-testid={`third-level-items-${props.group.id}`}
        data-open={props.open ? 'true' : 'false'}
      >
        Third level items
      </div>
    );
  },
}));

vi.mock('@/components/Navigation/MainNavigation/PromoBlock/PromoBlock', () => ({
  PromoBlock: (props: PromoBlockProps) => {
    capturedPromoBlockProps.push(props);

    return (
      <div data-testid={`promo-block-${props.title}`}>
        <span>{props.title}</span>
        <span>{props.subtitle}</span>
        <span>{props.href}</span>
        <span>{props.image}</span>
      </div>
    );
  },
}));

function createLeafPanelItem(
  overrides: {
    id?: string;
    label?: string;
    href?: string;
  } = {}
): NavPanelItem {
  return {
    id: overrides.id ?? 'leaf-link',
    label: overrides.label ?? 'Leaf link',
    href: overrides.href ?? '/leaf-link',
  } as NavPanelItem;
}

function createListGroupItem(
  overrides: {
    id?: string;
    label?: string;
    items?: NavBranchItem[];
  } = {}
): NavGroupItem {
  return {
    id: overrides.id ?? 'group-1',
    label: overrides.label ?? 'Group 1',
    layout: 'list',
    items: overrides.items ?? [
      {
        id: 'branch-1',
        label: 'Branch 1',
        items: [
          {
            id: 'branch-leaf-1',
            label: 'Branch leaf 1',
            href: '/branch-leaf-1',
          },
        ],
      },
    ],
  };
}

function createTopLevelItem(
  overrides: {
    id?: string;
    label?: string;
    href?: string;
    items?: NavTopLevelItem['items'];
    thumbnail?: NavTopLevelItem['thumbnail'];
  } = {}
): NavTopLevelItem {
  const base: NavTopLevelItem = {
    id: overrides.id ?? 'shop',
    label: overrides.label ?? 'Shop',
    href: overrides.href ?? '/shop',
    items: overrides.items ?? [
      createLeafPanelItem({
        id: 'direct-link',
        label: 'Direct link',
        href: '/direct-link',
      }),
      createListGroupItem({
        id: 'group-1',
        label: 'Featured',
      }),
    ],
  };

  return overrides.thumbnail
    ? {
        ...base,
        thumbnail: overrides.thumbnail,
      }
    : base;
}

function createProps(
  overrides: Partial<DesktopNavigationItemsProps> = {}
): DesktopNavigationItemsProps {
  return {
    items: [createTopLevelItem()],
    openIndex: null,
    openGroupId: null,
    setOpenGroupId: vi.fn<(id: string | null) => void>(),
    handleTopNavigationOpen: vi.fn<(index: number) => void>(),
    clearLeave: vi.fn<() => void>(),
    onOpenFirstCategory: vi.fn<(index: number) => void>(),
    onResetNavigation: vi.fn<() => void>(),
    ...overrides,
  };
}

describe('DesktopNavigationItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    capturedTopNavigationItemProps = [];
    capturedPanelProps = [];
    capturedCategoryGroupProps = [];
    capturedThirdLevelItemsProps = [];
    capturedPromoBlockProps = [];

    mockedUseMessages.mockImplementation((key) => {
      if (key !== 'navigation') {
        throw new Error(`Unexpected key: ${String(key)}`);
      }
      return {
        explore: 'Explore',
      } as LibraryMessages['navigation'];
    });
  });

  it('renders inside TopNavigation', () => {
    const props = createProps();

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByTestId('top-navigation')).toBeInTheDocument();
  });

  it('renders one TopNavigationItem per top-level item', () => {
    const props = createProps({
      items: [
        createTopLevelItem({ id: 'shop', label: 'Shop' }),
        createTopLevelItem({ id: 'discover', label: 'Discover' }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByTestId('top-navigation-item-shop')).toBeInTheDocument();
    expect(screen.getByTestId('top-navigation-item-discover')).toBeInTheDocument();
    expect(capturedTopNavigationItemProps).toHaveLength(2);
  });

  it('passes isOpen correctly based on openIndex', () => {
    const props = createProps({
      items: [
        createTopLevelItem({ id: 'shop', label: 'Shop' }),
        createTopLevelItem({ id: 'discover', label: 'Discover' }),
      ],
      openIndex: 1,
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByTestId('top-navigation-item-shop')).toHaveAttribute('data-open', 'false');
    expect(screen.getByTestId('top-navigation-item-discover')).toHaveAttribute('data-open', 'true');
  });

  it('passes hasPanel true when an item has child items', () => {
    const props = createProps({
      items: [
        createTopLevelItem({
          id: 'shop',
          items: [createLeafPanelItem()],
        }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByTestId('top-navigation-item-shop')).toHaveAttribute(
      'data-has-panel',
      'true'
    );
  });

  it('passes hasPanel false when an item has no child items', () => {
    const props = createProps({
      items: [
        createTopLevelItem({
          id: 'shop',
          items: [],
        }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByTestId('top-navigation-item-shop')).toHaveAttribute(
      'data-has-panel',
      'false'
    );
  });

  it('calls handleTopNavigationOpen on hover open', () => {
    const props = createProps({
      items: [createTopLevelItem({ id: 'shop' }), createTopLevelItem({ id: 'discover' })],
    });

    render(<DesktopNavigationItems {...props} />);

    fireEvent.click(screen.getByTestId('hover-open-discover'));

    expect(props.handleTopNavigationOpen).toHaveBeenCalledTimes(1);
    expect(props.handleTopNavigationOpen).toHaveBeenCalledWith(1);
  });

  it('calls onResetNavigation on hover close', () => {
    const props = createProps();

    render(<DesktopNavigationItems {...props} />);

    fireEvent.click(screen.getByTestId('hover-close-shop'));

    expect(props.onResetNavigation).toHaveBeenCalledTimes(1);
  });

  it('calls handleTopNavigationOpen and onOpenFirstCategory on focus open', () => {
    const props = createProps({
      items: [createTopLevelItem({ id: 'shop' }), createTopLevelItem({ id: 'discover' })],
    });

    render(<DesktopNavigationItems {...props} />);

    fireEvent.click(screen.getByTestId('focus-open-discover'));

    expect(props.handleTopNavigationOpen).toHaveBeenCalledWith(1);
    expect(props.onOpenFirstCategory).toHaveBeenCalledWith(1);
  });

  it('renders a Panel when a top-level item has child items', () => {
    const props = createProps({
      items: [createTopLevelItem({ id: 'shop', items: [createLeafPanelItem()] })],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByTestId('panel-shop-panel')).toBeInTheDocument();
  });

  it('does not render a Panel when a top-level item has no child items', () => {
    const props = createProps({
      items: [createTopLevelItem({ id: 'shop', items: [] })],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.queryByTestId('panel-shop-panel')).not.toBeInTheDocument();
  });

  it('passes panel id and labelledBy from helper functions', () => {
    const props = createProps({
      items: [createTopLevelItem({ id: 'shop' })],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(panelId).toHaveBeenCalledWith('shop');
    expect(topTriggerId).toHaveBeenCalledWith('shop');

    const panel = screen.getByTestId('panel-shop-panel');
    expect(panel).toHaveAttribute('data-labelledby', 'shop-trigger');
  });

  it('passes hidden=true to Panel when the item is not open', () => {
    const props = createProps({
      items: [createTopLevelItem({ id: 'shop' })],
      openIndex: null,
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByTestId('panel-shop-panel')).toHaveAttribute('data-hidden', 'true');
  });

  it('passes hidden=false to Panel when the item is open', () => {
    const props = createProps({
      items: [createTopLevelItem({ id: 'shop' })],
      openIndex: 0,
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByTestId('panel-shop-panel')).toHaveAttribute('data-hidden', 'false');
  });

  it('calls clearLeave when the panel onEnter handler fires', () => {
    const props = createProps({
      items: [createTopLevelItem({ id: 'shop' })],
    });

    render(<DesktopNavigationItems {...props} />);

    fireEvent.click(screen.getByTestId('panel-enter-shop-panel'));

    expect(props.clearLeave).toHaveBeenCalledTimes(1);
  });

  it('renders non-group panel items as direct sub links', () => {
    const props = createProps({
      items: [
        createTopLevelItem({
          id: 'shop',
          items: [
            createLeafPanelItem({
              id: 'direct-link',
              label: 'Direct link',
              href: '/direct-link',
            }),
          ],
        }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    const link = screen.getByRole('link', { name: 'Direct link' });
    expect(link).toHaveAttribute('href', '/direct-link');
    expect(link).toHaveAttribute('data-sub-trigger');
    expect(link).toHaveClass('groupTopLink');
  });

  it('renders CategoryGroup for group items', () => {
    const props = createProps({
      items: [
        createTopLevelItem({
          id: 'shop',
          items: [createListGroupItem({ id: 'group-1', label: 'Featured' })],
        }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByTestId('category-group-group-1')).toBeInTheDocument();
    expect(capturedCategoryGroupProps).toHaveLength(1);
  });

  it('passes open=true to CategoryGroup when openGroupId matches', () => {
    const props = createProps({
      openGroupId: 'group-1',
      items: [
        createTopLevelItem({
          id: 'shop',
          items: [createListGroupItem({ id: 'group-1' })],
        }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByTestId('category-group-group-1')).toHaveAttribute('data-open', 'true');
  });

  it('passes open=false to CategoryGroup when openGroupId does not match', () => {
    const props = createProps({
      openGroupId: 'different-group',
      items: [
        createTopLevelItem({
          id: 'shop',
          items: [createListGroupItem({ id: 'group-1' })],
        }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByTestId('category-group-group-1')).toHaveAttribute('data-open', 'false');
  });

  it('calls setOpenGroupId when a CategoryGroup hover-open handler fires', () => {
    const props = createProps({
      items: [
        createTopLevelItem({
          id: 'shop',
          items: [createListGroupItem({ id: 'group-1' })],
        }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    fireEvent.click(screen.getByTestId('category-hover-open-group-1'));

    expect(props.setOpenGroupId).toHaveBeenCalledTimes(1);
    expect(props.setOpenGroupId).toHaveBeenCalledWith('group-1');
  });

  it('calls setOpenGroupId when a CategoryGroup focus-open handler fires', () => {
    const props = createProps({
      items: [
        createTopLevelItem({
          id: 'shop',
          items: [createListGroupItem({ id: 'group-1' })],
        }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    fireEvent.click(screen.getByTestId('category-focus-open-group-1'));

    expect(props.setOpenGroupId).toHaveBeenCalledTimes(1);
    expect(props.setOpenGroupId).toHaveBeenCalledWith('group-1');
  });

  it('renders ThirdLevelItems when a group has child items', () => {
    const props = createProps({
      items: [
        createTopLevelItem({
          id: 'shop',
          items: [
            createListGroupItem({
              id: 'group-1',
              items: [
                {
                  id: 'branch-1',
                  label: 'Branch 1',
                  items: [
                    {
                      id: 'leaf-1',
                      label: 'Leaf 1',
                      href: '/leaf-1',
                    },
                  ],
                },
              ],
            }),
          ],
        }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByTestId('third-level-items-group-1')).toBeInTheDocument();
  });

  it('does not render ThirdLevelItems when a group has no child items', () => {
    const props = createProps({
      items: [
        createTopLevelItem({
          id: 'shop',
          items: [
            createListGroupItem({
              id: 'group-1',
              items: [],
            }),
          ],
        }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.queryByTestId('third-level-items-group-1')).not.toBeInTheDocument();
  });

  it('passes the group and open state to ThirdLevelItems', () => {
    const props = createProps({
      openGroupId: 'group-1',
      items: [
        createTopLevelItem({
          id: 'shop',
          items: [createListGroupItem({ id: 'group-1' })],
        }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByTestId('third-level-items-group-1')).toHaveAttribute('data-open', 'true');

    expect(capturedThirdLevelItemsProps).toHaveLength(1);
    expect(capturedThirdLevelItemsProps[0]?.group.id).toBe('group-1');
    expect(capturedThirdLevelItemsProps[0]?.open).toBe(true);
  });

  it('does not render a promo aside when thumbnail is absent', () => {
    const props = createProps({
      items: [
        createTopLevelItem({
          id: 'shop',
          label: 'Shop',
        }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.queryByLabelText('Explore Shop')).not.toBeInTheDocument();
    expect(capturedPromoBlockProps).toHaveLength(0);
  });

  it('renders a promo aside and PromoBlock when thumbnail is present', () => {
    const props = createProps({
      items: [
        createTopLevelItem({
          id: 'shop',
          label: 'Shop',
          thumbnail: '/images/shop.jpg',
        }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByLabelText('Explore Shop')).toBeInTheDocument();
    expect(screen.getByTestId('promo-block-Shop')).toBeInTheDocument();
    expect(capturedPromoBlockProps).toHaveLength(1);
  });

  it('passes the correct PromoBlock props when thumbnail is present', () => {
    const props = createProps({
      items: [
        createTopLevelItem({
          id: 'shop',
          label: 'Shop',
          thumbnail: '/images/shop.jpg',
        }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(capturedPromoBlockProps).toHaveLength(1);

    const promo = capturedPromoBlockProps[0];
    expect(promo?.title).toBe('Shop');
    expect(promo?.subtitle).toBe('Explore');
    expect(promo?.href).toBe('/explore/shop');
    expect(promo?.image).toBe('/images/shop.jpg');
  });

  it('uses the translated explore label in the promo aside aria-label', () => {
    mockedUseMessages.mockImplementation((key) => {
      if (key !== 'navigation') {
        throw new Error(`Unexpected key: ${String(key)}`);
      }
      return {
        explore: 'Explore',
      } as LibraryMessages['navigation'];
    });

    const props = createProps({
      items: [
        createTopLevelItem({
          id: 'shop',
          label: 'Shop',
          thumbnail: '/images/shop.jpg',
        }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByLabelText('Explore Shop')).toBeInTheDocument();
  });

  it('renders mixed direct links and grouped items in the left panel content', () => {
    const props = createProps({
      items: [
        createTopLevelItem({
          id: 'shop',
          items: [
            createLeafPanelItem({
              id: 'direct-link',
              label: 'Direct link',
              href: '/direct-link',
            }),
            createListGroupItem({
              id: 'group-1',
              label: 'Featured',
            }),
          ],
        }),
      ],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByRole('link', { name: 'Direct link' })).toBeInTheDocument();
    expect(screen.getByTestId('category-group-group-1')).toBeInTheDocument();
  });

  it('renders safely with an empty items array', () => {
    const props = createProps({
      items: [],
    });

    render(<DesktopNavigationItems {...props} />);

    expect(screen.getByTestId('top-navigation')).toBeInTheDocument();
    expect(capturedTopNavigationItemProps).toHaveLength(0);
    expect(capturedPanelProps).toHaveLength(0);
    expect(capturedCategoryGroupProps).toHaveLength(0);
  });
});
