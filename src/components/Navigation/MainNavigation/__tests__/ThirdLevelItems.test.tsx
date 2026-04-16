import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { groupBtnId, groupPanelId } from '@/components/Navigation/helpers';
import { ThirdLevelItems } from '@/components/Navigation/MainNavigation/ThirdLevelItems';
import type {
  NavBranchItem,
  NavThumbnailItem,
  ThirdLevelItemsProps,
} from '@/components/Navigation/types';

vi.mock('@/components/Navigation/helpers', () => ({
  groupBtnId: vi.fn((id: string) => `${id}-button`),
  groupPanelId: vi.fn((id: string) => `${id}-panel`),
}));

vi.mock('@/components/Navigation/Navigation.module.css', () => ({
  default: {
    panelSubLevel: 'panelSubLevel',
    panelGroup: 'panelGroup',
    panelGroupSection: 'panelGroupSection',
    panelGroupSectionGrid: 'panelGroupSectionGrid',
    panelGroupHeaderFirst: 'panelGroupHeaderFirst',
  },
}));

function createBranchItems(
  overrides: {
    id?: string;
    label?: string;
    href?: string;
    includeHref?: boolean;
    items?: NavBranchItem['items'];
  } = {}
): NavBranchItem {
  const base = {
    id: overrides.id ?? 'branch-1',
    label: overrides.label ?? 'Branch 1',
    items: overrides.items ?? [
      {
        id: 'child-1',
        label: 'Child 1',
        href: '/child-1',
      },
      {
        id: 'child-2',
        label: 'Child 2',
        href: '/child-2',
      },
    ],
  };

  if (overrides.includeHref === false) {
    return base as NavBranchItem;
  }

  return {
    ...base,
    href: overrides.href ?? '/branch-1',
  } as NavBranchItem;
}

function createThumbnailItem(overrides: Partial<NavThumbnailItem> = {}): NavThumbnailItem {
  return {
    id: 'thumb-1',
    label: 'Thumbnail 1',
    href: '/thumbnail-1',
    thumbnail: '/thumbnail-1.jpg',
    ...overrides,
  };
}

function createListGroup(
  overrides: {
    id?: string;
    label?: string;
    href?: string;
    includeHref?: boolean;
    items?: NavBranchItem[];
  } = {}
): ThirdLevelItemsProps['group'] {
  const base = {
    id: overrides.id ?? 'group-1',
    label: overrides.label ?? 'Featured',
    layout: 'list' as const,
    items: overrides.items ?? [
      createBranchItems(),
      createBranchItems({
        id: 'branch-2',
        label: 'Branch 2',
        href: '/branch-2',
        items: [
          {
            id: 'child-3',
            label: 'Child 3',
            href: '/child-3',
          },
        ],
      }),
    ],
  };

  if (overrides.includeHref === false) {
    return base;
  }

  return {
    ...base,
    href: overrides.href ?? '/featured',
  };
}

function createThumbnailGroup(
  overrides: {
    id?: string;
    label?: string;
    href?: string;
    includeHref?: boolean;
    items?: NavThumbnailItem[];
  } = {}
): ThirdLevelItemsProps['group'] {
  const base = {
    id: overrides.id ?? 'group-1',
    label: overrides.label ?? 'Featured',
    layout: 'thumbnail' as const,
    items: overrides.items ?? [
      createThumbnailItem(),
      createThumbnailItem({
        id: 'thumb-2',
        label: 'Thumbnail 2',
        href: '/thumbnail-2',
        thumbnail: '/thumbnail-2.jpg',
      }),
    ],
  };

  if (overrides.includeHref === false) {
    return base;
  }

  return {
    ...base,
    href: overrides.href ?? '/featured',
  };
}

function createProps(overrides: Partial<ThirdLevelItemsProps> = {}): ThirdLevelItemsProps {
  return {
    group: createListGroup(),
    open: false,
    ...overrides,
  };
}

describe('ThirdLevelItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the root panel element with helper-generated id and aria-labelledby', () => {
    const props = createProps({
      group: createListGroup({ id: 'group-1' }),
    });

    const { container } = render(<ThirdLevelItems {...props} />);

    expect(groupPanelId).toHaveBeenCalledWith('group-1');
    expect(groupBtnId).toHaveBeenCalledWith('group-1');

    const panel = container.querySelector('#group-1-panel');
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute('aria-labelledby', 'group-1-button');
  });

  it('applies the panelSubLevel class and layout data attribute', () => {
    const props = createProps({
      group: createListGroup({ id: 'group-1' }),
    });

    const { container } = render(<ThirdLevelItems {...props} />);

    const panel = container.querySelector('#group-1-panel');
    expect(panel).toHaveClass('panelSubLevel');
    expect(panel).toHaveAttribute('data-layout', 'list');
  });

  it('is hidden when open is false', () => {
    const props = createProps({
      open: false,
    });

    const { container } = render(<ThirdLevelItems {...props} />);

    const panel = container.querySelector('#group-1-panel');
    expect(panel).toHaveAttribute('hidden');
  });

  it('is visible when open is true', () => {
    const props = createProps({
      open: true,
    });

    const { container } = render(<ThirdLevelItems {...props} />);

    const panel = container.querySelector('#group-1-panel');
    expect(panel).not.toHaveAttribute('hidden');
  });

  it('renders the shared group wrapper', () => {
    const props = createProps();

    const { container } = render(<ThirdLevelItems {...props} />);

    expect(container.querySelector('.panelGroup')).toBeInTheDocument();
  });

  describe('thumbnail layout', () => {
    it('renders the group heading link when group.href is present', () => {
      const props = createProps({
        open: true,
        group: createThumbnailGroup({
          label: 'Featured',
          href: '/featured',
        }),
      });

      render(<ThirdLevelItems {...props} />);

      const headingLink = screen.getByRole('link', { name: 'Featured' });
      expect(headingLink).toHaveAttribute('href', '/featured');
      expect(headingLink).toHaveAttribute('data-sub-link');
    });

    it('does not render the group heading link when group.href is absent', () => {
      const props = createProps({
        group: createThumbnailGroup({
          includeHref: false,
        }),
      });

      render(<ThirdLevelItems {...props} />);

      expect(screen.queryByRole('link', { name: 'Featured' })).not.toBeInTheDocument();
    });

    it('renders one link per thumbnail item', () => {
      const props = createProps({
        open: true,
        group: createThumbnailGroup({
          items: [
            createThumbnailItem({
              id: 'thumb-1',
              label: 'Thumbnail 1',
              href: '/thumbnail-1',
              thumbnail: '/thumbnail-1.jpg',
            }),
            createThumbnailItem({
              id: 'thumb-2',
              label: 'Thumbnail 2',
              href: '/thumbnail-2',
              thumbnail: '/thumbnail-2.jpg',
            }),
          ],
        }),
      });

      const { container } = render(<ThirdLevelItems {...props} />);

      const linkOne = container.querySelector('a[href="/thumbnail-1"]');
      const linkTwo = container.querySelector('a[href="/thumbnail-2"]');

      expect(linkOne).toBeInTheDocument();
      expect(linkTwo).toBeInTheDocument();
      expect(linkOne).toHaveAttribute('data-sub-link');
      expect(linkTwo).toHaveAttribute('data-sub-link');
    });

    it('sets thumbnail item links to tabIndex 0 when open', () => {
      const props = createProps({
        open: true,
        group: createThumbnailGroup(),
      });

      render(<ThirdLevelItems {...props} />);

      const itemLinks = screen
        .getAllByRole('link')
        .filter((link) => link.textContent?.includes('Thumbnail'));

      expect(itemLinks[0]).toHaveAttribute('tabindex', '0');
      expect(itemLinks[1]).toHaveAttribute('tabindex', '0');
    });

    it('sets thumbnail item links to tabIndex -1 when closed', () => {
      const props = createProps({
        open: false,
        group: createThumbnailGroup(),
      });

      const { container } = render(<ThirdLevelItems {...props} />);

      const itemLinks = container.querySelectorAll('a[href^="/thumbnail-"]');
      expect(itemLinks).toHaveLength(2);
      expect(itemLinks[0]).toHaveAttribute('tabindex', '-1');
      expect(itemLinks[1]).toHaveAttribute('tabindex', '-1');
    });

    it('renders images for thumbnail items with alt text equal to the item label', () => {
      const props = createProps({
        open: true,
        group: createThumbnailGroup({
          items: [
            createThumbnailItem({
              id: 'thumb-1',
              label: 'Thumbnail 1',
              href: '/thumbnail-1',
              thumbnail: '/thumbnail-1.jpg',
            }),
          ],
        }),
      });

      render(<ThirdLevelItems {...props} />);

      const image = screen.getByAltText('Thumbnail 1');
      expect(image).toHaveAttribute('src', '/thumbnail-1.jpg');
    });

    it('applies the thumbnail layout data attribute', () => {
      const props = createProps({
        group: createThumbnailGroup(),
      });

      const { container } = render(<ThirdLevelItems {...props} />);

      const panel = container.querySelector('#group-1-panel');
      expect(panel).toHaveAttribute('data-layout', 'thumbnail');
    });
  });

  describe('list layout', () => {
    it('renders the group heading link when group.href is present', () => {
      const props = createProps({
        open: true,
        group: createListGroup({
          label: 'Featured',
          href: '/featured',
        }),
      });

      render(<ThirdLevelItems {...props} />);

      const headingLink = screen.getByRole('link', { name: 'Featured' });
      expect(headingLink).toHaveAttribute('href', '/featured');
      expect(headingLink).toHaveAttribute('data-sub-link');
    });

    it('does not render the group heading link when group.href is absent', () => {
      const props = createProps({
        group: createListGroup({
          includeHref: false,
        }),
      });

      render(<ThirdLevelItems {...props} />);

      expect(screen.queryByRole('link', { name: 'Featured' })).not.toBeInTheDocument();
    });

    it('renders a linked branch heading when a branch item has href', () => {
      const props = createProps({
        open: true,
        group: createListGroup({
          items: [
            createBranchItems({
              id: 'branch-1',
              label: 'Branch 1',
              href: '/branch-1',
            }),
          ],
        }),
      });

      render(<ThirdLevelItems {...props} />);

      const branchLink = screen.getByRole('link', { name: 'Branch 1' });
      expect(branchLink).toHaveAttribute('href', '/branch-1');
      expect(branchLink).toHaveAttribute('data-sub-link');
      expect(branchLink).toHaveClass('panelGroupHeaderFirst');
    });

    it('renders a span branch heading when a branch item has no href', () => {
      const props = createProps({
        open: true,
        group: createListGroup({
          items: [
            createBranchItems({
              id: 'branch-1',
              label: 'Branch 1',
              includeHref: false,
            }),
          ],
        }),
      });

      render(<ThirdLevelItems {...props} />);

      const heading = screen.getByText('Branch 1');
      expect(heading.tagName).toBe('SPAN');
      expect(heading).toHaveClass('panelGroupHeaderFirst');
      expect(screen.queryByRole('link', { name: 'Branch 1' })).not.toBeInTheDocument();
    });

    it('renders child links for each branch item child', () => {
      const props = createProps({
        open: true,
        group: createListGroup({
          items: [
            createBranchItems({
              id: 'branch-1',
              label: 'Branch 1',
              items: [
                {
                  id: 'child-1',
                  label: 'Child 1',
                  href: '/child-1',
                },
                {
                  id: 'child-2',
                  label: 'Child 2',
                  href: '/child-2',
                },
              ],
            }),
          ],
        }),
      });

      render(<ThirdLevelItems {...props} />);

      const childOne = screen.getByRole('link', { name: 'Child 1' });
      const childTwo = screen.getByRole('link', { name: 'Child 2' });

      expect(childOne).toHaveAttribute('href', '/child-1');
      expect(childTwo).toHaveAttribute('href', '/child-2');
      expect(childOne).toHaveAttribute('data-sub-link');
      expect(childTwo).toHaveAttribute('data-sub-link');
    });

    it('sets linked branch headings to tabIndex 0 when open', () => {
      const props = createProps({
        open: true,
        group: createListGroup({
          items: [
            createBranchItems({
              id: 'branch-1',
              label: 'Branch 1',
              href: '/branch-1',
            }),
          ],
        }),
      });

      render(<ThirdLevelItems {...props} />);

      const branchLink = screen.getByRole('link', { name: 'Branch 1' });
      expect(branchLink).toHaveAttribute('tabindex', '0');
    });

    it('sets linked branch headings to tabIndex -1 when closed', () => {
      const props = createProps({
        open: false,
        group: createListGroup({
          items: [
            createBranchItems({
              id: 'branch-1',
              label: 'Branch 1',
              href: '/branch-1',
            }),
          ],
        }),
      });

      const { container } = render(<ThirdLevelItems {...props} />);

      const branchLink = container.querySelector('a[href="/branch-1"]');
      expect(branchLink).toBeInTheDocument();
      expect(branchLink).toHaveAttribute('tabindex', '-1');
    });

    it('sets child links to tabIndex 0 when open', () => {
      const props = createProps({
        open: true,
        group: createListGroup({
          items: [
            createBranchItems({
              items: [
                {
                  id: 'child-1',
                  label: 'Child 1',
                  href: '/child-1',
                },
              ],
            }),
          ],
        }),
      });

      render(<ThirdLevelItems {...props} />);

      const childLink = screen.getByRole('link', { name: 'Child 1' });
      expect(childLink).toHaveAttribute('tabindex', '0');
    });

    it('sets child links to tabIndex -1 when closed', () => {
      const props = createProps({
        open: false,
        group: createListGroup({
          items: [
            createBranchItems({
              items: [
                {
                  id: 'child-1',
                  label: 'Child 1',
                  href: '/child-1',
                },
              ],
            }),
          ],
        }),
      });

      const { container } = render(<ThirdLevelItems {...props} />);

      const childLink = container.querySelector('a[href="/child-1"]');
      expect(childLink).toBeInTheDocument();
      expect(childLink).toHaveAttribute('tabindex', '-1');
    });

    it('renders multiple branch sections', () => {
      const props = createProps({
        open: true,
        group: createListGroup({
          items: [
            createBranchItems({
              id: 'branch-1',
              label: 'Branch 1',
            }),
            createBranchItems({
              id: 'branch-2',
              label: 'Branch 2',
            }),
          ],
        }),
      });

      render(<ThirdLevelItems {...props} />);

      expect(screen.getByText('Branch 1')).toBeInTheDocument();
      expect(screen.getByText('Branch 2')).toBeInTheDocument();
    });
  });

  it('renders safely with empty thumbnail items', () => {
    const props = createProps({
      open: true,
      group: createThumbnailGroup({
        items: [],
      }),
    });

    render(<ThirdLevelItems {...props} />);

    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('renders safely with empty list branch items', () => {
    const props = createProps({
      open: true,
      group: createListGroup({
        items: [],
      }),
    });

    render(<ThirdLevelItems {...props} />);

    expect(screen.getByText('Featured')).toBeInTheDocument();
  });
});
