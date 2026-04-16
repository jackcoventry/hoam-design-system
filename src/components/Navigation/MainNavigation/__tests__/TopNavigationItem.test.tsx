// TopNavigationItem.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { panelId, topTriggerId } from '@/components/Navigation/helpers';
import { TopNavigationItem } from '@/components/Navigation/MainNavigation/TopNavigationItem';
import type { NavTopLevelItem, TopNavigationItemProps } from '@/components/Navigation/types';

vi.mock('@/components/Navigation/helpers', () => ({
  panelId: vi.fn((id: string) => `${id}-panel`),
  topTriggerId: vi.fn((id: string) => `${id}-trigger`),
}));

vi.mock('@/components/Navigation/Navigation.module.css', () => ({
  default: {
    item: 'item',
    link: 'link',
  },
}));

function createItem(
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
    items: overrides.items ?? [],
  };

  return overrides.thumbnail
    ? {
        ...base,
        thumbnail: overrides.thumbnail,
      }
    : base;
}

function createProps(overrides: Partial<TopNavigationItemProps> = {}): TopNavigationItemProps {
  return {
    item: createItem(),
    isOpen: false,
    hasPanel: false,
    onFocusOpen: vi.fn<() => void>(),
    onHoverOpen: vi.fn<() => void>(),
    onHoverClose: vi.fn<() => void>(),
    children: <div data-testid="top-navigation-item-children">Child content</div>,
    ...overrides,
  };
}

describe('TopNavigationItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a list item wrapper', () => {
    const props = createProps();

    render(<TopNavigationItem {...props} />);

    const listItem = screen.getByRole('listitem');
    expect(listItem).toBeInTheDocument();
    expect(listItem).toHaveClass('item');
  });

  it('renders a link when hasPanel is false', () => {
    const props = createProps({
      hasPanel: false,
      item: createItem({
        id: 'shop',
        label: 'Shop',
        href: '/shop',
      }),
    });

    render(<TopNavigationItem {...props} />);

    const link = screen.getByRole('link', { name: 'Shop' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/shop');
    expect(link).toHaveAttribute('id', 'shop-trigger');
    expect(link).toHaveAttribute('data-top-trigger');
    expect(link).toHaveAttribute('data-top-cyclable');
    expect(link).toHaveClass('link');
  });

  it('renders a button when hasPanel is true', () => {
    const props = createProps({
      hasPanel: true,
      item: createItem({
        id: 'shop',
        label: 'Shop',
      }),
    });

    render(<TopNavigationItem {...props} />);

    const button = screen.getByRole('button', { name: 'Shop' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('id', 'shop-trigger');
    expect(button).toHaveAttribute('data-top-trigger');
    expect(button).toHaveAttribute('data-top-cyclable');
    expect(button).toHaveClass('link');
  });

  it('calls topTriggerId for a non-panel item', () => {
    const props = createProps({
      hasPanel: false,
      item: createItem({ id: 'shop' }),
    });

    render(<TopNavigationItem {...props} />);

    expect(topTriggerId).toHaveBeenCalledWith('shop');
  });

  it('calls topTriggerId and panelId for a panel item', () => {
    const props = createProps({
      hasPanel: true,
      item: createItem({ id: 'shop' }),
    });

    render(<TopNavigationItem {...props} />);

    expect(topTriggerId).toHaveBeenCalledWith('shop');
    expect(panelId).toHaveBeenCalledWith('shop');
  });

  it('sets aria-expanded to false on the button when closed', () => {
    const props = createProps({
      hasPanel: true,
      isOpen: false,
    });

    render(<TopNavigationItem {...props} />);

    const button = screen.getByRole('button', { name: 'Shop' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('sets aria-expanded to true on the button when open', () => {
    const props = createProps({
      hasPanel: true,
      isOpen: true,
    });

    render(<TopNavigationItem {...props} />);

    const button = screen.getByRole('button', { name: 'Shop' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('sets aria-controls from panelId on the button', () => {
    const props = createProps({
      hasPanel: true,
      item: createItem({ id: 'shop' }),
    });

    render(<TopNavigationItem {...props} />);

    const button = screen.getByRole('button', { name: 'Shop' });
    expect(button).toHaveAttribute('aria-controls', 'shop-panel');
  });

  it('does not render a button when hasPanel is false', () => {
    const props = createProps({
      hasPanel: false,
    });

    render(<TopNavigationItem {...props} />);

    expect(screen.queryByRole('button', { name: 'Shop' })).not.toBeInTheDocument();
  });

  it('does not render a link when hasPanel is true', () => {
    const props = createProps({
      hasPanel: true,
    });

    render(<TopNavigationItem {...props} />);

    expect(screen.queryByRole('link', { name: 'Shop' })).not.toBeInTheDocument();
  });

  it('calls onHoverOpen on pointer enter when hasPanel is true', () => {
    const props = createProps({
      hasPanel: true,
    });

    render(<TopNavigationItem {...props} />);

    fireEvent.pointerEnter(screen.getByRole('listitem'));

    expect(props.onHoverOpen).toHaveBeenCalledTimes(1);
    expect(props.onHoverClose).not.toHaveBeenCalled();
  });

  it('calls onHoverClose on pointer enter when hasPanel is false', () => {
    const props = createProps({
      hasPanel: false,
    });

    render(<TopNavigationItem {...props} />);

    fireEvent.pointerEnter(screen.getByRole('listitem'));

    expect(props.onHoverClose).toHaveBeenCalledTimes(1);
    expect(props.onHoverOpen).not.toHaveBeenCalled();
  });

  it('calls onHoverClose on focus capture when hasPanel is false', () => {
    const props = createProps({
      hasPanel: false,
    });

    render(<TopNavigationItem {...props} />);

    const link = screen.getByRole('link', { name: 'Shop' });
    fireEvent.focus(link);

    expect(props.onHoverClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onHoverClose on focus capture when hasPanel is true', () => {
    const props = createProps({
      hasPanel: true,
    });

    render(<TopNavigationItem {...props} />);

    const button = screen.getByRole('button', { name: 'Shop' });
    fireEvent.focus(button);

    expect(props.onHoverClose).not.toHaveBeenCalled();
  });

  it('calls onFocusOpen when the panel trigger button receives focus', () => {
    const props = createProps({
      hasPanel: true,
    });

    render(<TopNavigationItem {...props} />);

    const button = screen.getByRole('button', { name: 'Shop' });
    fireEvent.focus(button);

    expect(props.onFocusOpen).toHaveBeenCalledTimes(1);
  });

  it('does not call onFocusOpen for a non-panel link item', () => {
    const props = createProps({
      hasPanel: false,
    });

    render(<TopNavigationItem {...props} />);

    const link = screen.getByRole('link', { name: 'Shop' });
    fireEvent.focus(link);

    expect(props.onFocusOpen).not.toHaveBeenCalled();
  });

  it('renders children below the trigger element', () => {
    const props = createProps({
      children: <div data-testid="custom-children">Panel content</div>,
    });

    render(<TopNavigationItem {...props} />);

    expect(screen.getByTestId('custom-children')).toBeInTheDocument();
  });

  it('renders safely with null children', () => {
    const props = createProps({
      children: null,
    });

    render(<TopNavigationItem {...props} />);

    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('renders the item label in link mode', () => {
    const props = createProps({
      hasPanel: false,
      item: createItem({
        label: 'Discover',
        href: '/discover',
      }),
    });

    render(<TopNavigationItem {...props} />);

    expect(screen.getByRole('link', { name: 'Discover' })).toBeInTheDocument();
  });

  it('renders the item label in button mode', () => {
    const props = createProps({
      hasPanel: true,
      item: createItem({
        label: 'Discover',
      }),
    });

    render(<TopNavigationItem {...props} />);

    expect(screen.getByRole('button', { name: 'Discover' })).toBeInTheDocument();
  });

  it('preserves the provided href in link mode', () => {
    const props = createProps({
      hasPanel: false,
      item: createItem({
        label: 'Discover',
        href: '/discover',
      }),
    });

    render(<TopNavigationItem {...props} />);

    expect(screen.getByRole('link', { name: 'Discover' })).toHaveAttribute('href', '/discover');
  });
});
