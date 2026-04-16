import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MobileNavigationItem } from '@/components/Navigation/MobileNavigation/MobileNavigationItem';
import type { NavLeafItem, NavTreeItem } from '@/components/Navigation/types';

vi.mock('@/components/Icon', () => ({
  Icon: ({ id, size }: { id: string; size?: string }) => (
    <span
      data-testid={`icon-${id}`}
      data-size={size ?? ''}
      aria-hidden="true"
    />
  ),
}));

vi.mock('@/components/Navigation/MobileNavigation/MobileNavigation.module.css', () => ({
  default: {
    item: 'item',
    link: 'link',
    panel: 'panel',
  },
}));

function createLeafItem(
  overrides: {
    id?: string;
    label?: string;
    href?: string;
  } = {}
): NavLeafItem {
  return {
    id: overrides.id ?? 'shop',
    label: overrides.label ?? 'Shop',
    href: overrides.href ?? '/shop',
  };
}

function createBranchItem(
  overrides: {
    id?: string;
    label?: string;
    href?: string;
    includeHref?: boolean;
    items?: NavLeafItem[];
  } = {}
): NavTreeItem {
  const base = {
    id: overrides.id ?? 'discover',
    label: overrides.label ?? 'Discover',
    items: overrides.items ?? [
      createLeafItem({
        id: 'journal',
        label: 'Journal',
        href: '/journal',
      }),
      createLeafItem({
        id: 'guides',
        label: 'Guides',
        href: '/guides',
      }),
    ],
  };

  if (overrides.includeHref === false) {
    return base;
  }

  return {
    ...base,
    href: overrides.href ?? '/discover',
  };
}

describe('MobileNavigationItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a list item with level 1 by default', () => {
    render(<MobileNavigationItem item={createLeafItem()} />);

    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveAttribute('data-level', '1');
    expect(listItem).toHaveClass('item');
  });

  it('renders a link when the item has an href and no renderable children', () => {
    render(<MobileNavigationItem item={createLeafItem()} />);

    const link = screen.getByRole('link', { name: 'Shop' });
    expect(link).toHaveAttribute('href', '/shop');
    expect(link).toHaveClass('link');
  });

  it('renders a span when the item has no href and no renderable children', () => {
    render(
      <MobileNavigationItem
        item={{
          id: 'label-only',
          label: 'Label Only',
        }}
      />
    );

    const label = screen.getByText('Label Only');
    expect(label.tagName).toBe('SPAN');
    expect(label).toHaveClass('link');
  });

  it('renders a button when the item has children and level is below maxLevel', () => {
    render(<MobileNavigationItem item={createBranchItem()} />);

    const button = screen.getByRole('button', { name: 'Discover' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders the closed caret icon by default for expandable items', () => {
    render(<MobileNavigationItem item={createBranchItem()} />);

    const icon = screen.getByTestId('icon-caret-right');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-size', '0.5em');
  });

  it('opens the child panel when the button is clicked', () => {
    render(<MobileNavigationItem item={createBranchItem()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Discover' }));

    const button = screen.getByRole('button', { name: 'Discover' });
    const panel = document.getElementById('hoam-mobile-navigation-panel-discover');

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(panel).toBeInTheDocument();
    expect(screen.getByTestId('icon-caret-down')).toBeInTheDocument();
  });

  it('closes the child panel when the button is clicked twice', () => {
    render(<MobileNavigationItem item={createBranchItem()} />);

    const button = screen.getByRole('button', { name: 'Discover' });
    fireEvent.click(button);
    fireEvent.click(screen.getByRole('button', { name: 'Discover' }));

    expect(screen.getByRole('button', { name: 'Discover' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(
      document.getElementById('hoam-mobile-navigation-panel-discover')
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('icon-caret-right')).toBeInTheDocument();
  });

  it('renders the child panel with generated id and aria-labelledby when opened', () => {
    render(<MobileNavigationItem item={createBranchItem()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Discover' }));

    const panel = document.getElementById('hoam-mobile-navigation-panel-discover');
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute('aria-labelledby', 'hoam-mobile-navigation-button-discover');
  });

  it('links the button to the child panel via aria-controls', () => {
    render(<MobileNavigationItem item={createBranchItem()} />);

    const button = screen.getByRole('button', { name: 'Discover' });
    expect(button).toHaveAttribute('aria-controls', 'hoam-mobile-navigation-panel-discover');
    expect(button).toHaveAttribute('id', 'hoam-mobile-navigation-button-discover');
  });

  it('renders a duplicate direct link to the parent item inside the open panel when href exists', () => {
    render(<MobileNavigationItem item={createBranchItem()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Discover' }));

    const discoverLinks = screen.getAllByRole('link', { name: 'Discover' });
    expect(discoverLinks).toHaveLength(1);
    expect(discoverLinks[0]).toHaveAttribute('href', '/discover');
  });

  it('does not render a duplicate parent link inside the open panel when href does not exist', () => {
    render(
      <MobileNavigationItem
        item={createBranchItem({
          id: 'discover',
          label: 'Discover',
          includeHref: false,
          items: [
            createLeafItem({
              id: 'journal',
              label: 'Journal',
              href: '/journal',
            }),
          ],
        })}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Discover' }));

    expect(screen.queryByRole('link', { name: 'Discover' })).not.toBeInTheDocument();
  });

  it('renders child leaf items when opened', () => {
    render(
      <MobileNavigationItem
        item={createBranchItem({
          items: [
            createLeafItem({
              id: 'journal',
              label: 'Journal',
              href: '/journal',
            }),
            createLeafItem({
              id: 'guides',
              label: 'Guides',
              href: '/guides',
            }),
          ],
        })}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Discover' }));

    expect(screen.getByRole('link', { name: 'Journal' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Guides' })).toBeInTheDocument();
  });

  it('renders nested items at incremented levels', () => {
    render(<MobileNavigationItem item={createBranchItem()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Discover' }));

    const nestedListItems = screen.getAllByRole('listitem');
    expect(nestedListItems.some((item) => item.dataset.level === '2')).toBe(true);
  });

  it('stops rendering children once level reaches maxLevel', () => {
    render(
      <MobileNavigationItem
        item={createBranchItem()}
        maxLevel={1}
      />
    );

    expect(screen.queryByRole('button', { name: 'Discover' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Discover' })).toBeInTheDocument();
  });

  it('renders level 2 items with data-level 2', () => {
    render(<MobileNavigationItem item={createBranchItem()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Discover' }));

    const journalLink = screen.getByRole('link', { name: 'Journal' });
    const journalItem = journalLink.closest('li');
    expect(journalItem).toHaveAttribute('data-level', '2');
  });

  it('renders arbitrary items with stable generated ids based on item.id', () => {
    render(
      <MobileNavigationItem
        item={createBranchItem({
          id: 'custom-item',
          label: 'Custom Item',
          includeHref: false,
          items: [
            createLeafItem({
              id: 'child',
              label: 'Child',
              href: '/child',
            }),
          ],
        })}
      />
    );

    const button = screen.getByRole('button', { name: 'Custom Item' });
    expect(button).toHaveAttribute('id', 'hoam-mobile-navigation-button-custom-item');
    expect(button).toHaveAttribute('aria-controls', 'hoam-mobile-navigation-panel-custom-item');
  });

  it('renders safely with an empty children array by falling back to link mode when href exists', () => {
    render(
      <MobileNavigationItem
        item={{
          id: 'empty-parent',
          label: 'Empty Parent',
          href: '/empty-parent',
          items: [],
        }}
      />
    );

    expect(screen.getByRole('link', { name: 'Empty Parent' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Empty Parent' })).not.toBeInTheDocument();
  });
});
