import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { groupBtnId, groupPanelId } from '@/components/Navigation/helpers';
import { CategoryGroup } from '@/components/Navigation/MainNavigation/CategoryGroup';
import type {
  CategoryGroupProps,
  NavBranchItem,
  NavGroupItem,
} from '@/components/Navigation/types';

type IconProps = {
  id: string;
  size?: string;
};

let capturedIconProps: IconProps[] = [];

vi.mock('@/components/Icon', () => ({
  Icon: (props: IconProps) => {
    capturedIconProps.push(props);

    return (
      <span
        data-testid={`icon-${props.id}`}
        aria-hidden="true"
      />
    );
  },
}));

vi.mock('@/components/Navigation/helpers', () => ({
  groupBtnId: vi.fn((id: string) => `${id}-button`),
  groupPanelId: vi.fn((id: string) => `${id}-panel`),
}));

vi.mock('@/components/Navigation/Navigation.module.css', () => ({
  default: {
    group: 'group',
    groupTopLink: 'groupTopLink',
  },
}));

function createSubitem(
  overrides: {
    id?: string;
    label?: string;
    href?: string;
    items?: NavBranchItem[];
  } = {}
): NavGroupItem {
  return {
    id: overrides.id ?? 'group-1',
    label: overrides.label ?? 'Featured',
    layout: 'list',
    href: overrides.href ?? '/featured',
    items: overrides.items ?? [
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
  };
}

function createProps(overrides: Partial<CategoryGroupProps> = {}): CategoryGroupProps {
  return {
    subitem: createSubitem(),
    open: false,
    onHoverOpen: vi.fn<() => void>(),
    onFocusOpen: vi.fn<() => void>(),
    children: undefined,
    ...overrides,
  };
}

describe('CategoryGroup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedIconProps = [];
  });

  it('renders the wrapper with the group class', () => {
    const props = createProps();

    const { container } = render(<CategoryGroup {...props} />);

    const wrapper = container.firstElementChild;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('group');
  });

  it('calls onHoverOpen on pointer enter of the wrapper', () => {
    const props = createProps();

    const { container } = render(<CategoryGroup {...props} />);

    const wrapper = container.firstElementChild;
    expect(wrapper).not.toBeNull();

    if (!wrapper) {
      throw new Error('Expected wrapper element to exist');
    }

    fireEvent.pointerEnter(wrapper);

    expect(props.onHoverOpen).toHaveBeenCalledTimes(1);
  });

  it('renders an anchor when there are no children', () => {
    const props = createProps({
      children: undefined,
      subitem: createSubitem({
        id: 'group-1',
        label: 'Featured',
        href: '/featured',
      }),
    });

    render(<CategoryGroup {...props} />);

    const link = screen.getByRole('link', { name: 'Featured' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/featured');
    expect(link).toHaveAttribute('data-sub-trigger');
    expect(link).toHaveClass('groupTopLink');
  });

  it('does not render a button when there are no children', () => {
    const props = createProps({
      children: undefined,
    });

    render(<CategoryGroup {...props} />);

    expect(screen.queryByRole('button', { name: 'Featured' })).not.toBeInTheDocument();
  });

  it('does not render an icon when there are no children', () => {
    const props = createProps({
      children: undefined,
    });

    render(<CategoryGroup {...props} />);

    expect(screen.queryByTestId('icon-caret-right')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-caret-down')).not.toBeInTheDocument();
    expect(capturedIconProps).toHaveLength(0);
  });

  it('renders a button when children are provided', () => {
    const props = createProps({
      children: <div data-testid="group-children">Children</div>,
    });

    render(<CategoryGroup {...props} />);

    const button = screen.getByRole('button', { name: 'Featured' });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-sub-trigger');
    expect(button).toHaveClass('groupTopLink');
    expect(screen.getByTestId('group-children')).toBeInTheDocument();
  });

  it('does not render an anchor when children are provided', () => {
    const props = createProps({
      children: <div data-testid="group-children">Children</div>,
    });

    render(<CategoryGroup {...props} />);

    expect(screen.queryByRole('link', { name: 'Featured' })).not.toBeInTheDocument();
  });

  it('calls groupBtnId with the subitem id when children are provided', () => {
    const props = createProps({
      subitem: createSubitem({ id: 'group-1' }),
      children: <div data-testid="group-children">Children</div>,
    });

    render(<CategoryGroup {...props} />);

    expect(groupBtnId).toHaveBeenCalledTimes(1);
    expect(groupBtnId).toHaveBeenCalledWith('group-1');
  });

  it('calls groupPanelId with the subitem id when children are provided', () => {
    const props = createProps({
      subitem: createSubitem({ id: 'group-1' }),
      children: <div data-testid="group-children">Children</div>,
    });

    render(<CategoryGroup {...props} />);

    expect(groupPanelId).toHaveBeenCalledTimes(1);
    expect(groupPanelId).toHaveBeenCalledWith('group-1');
  });

  it('sets the button id from groupBtnId', () => {
    const props = createProps({
      subitem: createSubitem({ id: 'group-1' }),
      children: <div data-testid="group-children">Children</div>,
    });

    render(<CategoryGroup {...props} />);

    const button = screen.getByRole('button', { name: 'Featured' });
    expect(button).toHaveAttribute('id', 'group-1-button');
  });

  it('sets aria-controls from groupPanelId', () => {
    const props = createProps({
      subitem: createSubitem({ id: 'group-1' }),
      children: <div data-testid="group-children">Children</div>,
    });

    render(<CategoryGroup {...props} />);

    const button = screen.getByRole('button', { name: 'Featured' });
    expect(button).toHaveAttribute('aria-controls', 'group-1-panel');
  });

  it('sets aria-expanded to false when closed', () => {
    const props = createProps({
      open: false,
      children: <div data-testid="group-children">Children</div>,
    });

    render(<CategoryGroup {...props} />);

    const button = screen.getByRole('button', { name: 'Featured' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('sets aria-expanded to true when open', () => {
    const props = createProps({
      open: true,
      children: <div data-testid="group-children">Children</div>,
    });

    render(<CategoryGroup {...props} />);

    const button = screen.getByRole('button', { name: 'Featured' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls onFocusOpen when the button receives focus', () => {
    const props = createProps({
      children: <div data-testid="group-children">Children</div>,
    });

    render(<CategoryGroup {...props} />);

    const button = screen.getByRole('button', { name: 'Featured' });
    fireEvent.focus(button);

    expect(props.onFocusOpen).toHaveBeenCalledTimes(1);
  });

  it('renders the caret-right icon when closed', () => {
    const props = createProps({
      open: false,
      children: <div data-testid="group-children">Children</div>,
    });

    render(<CategoryGroup {...props} />);

    expect(screen.getByTestId('icon-caret-right')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-caret-down')).not.toBeInTheDocument();

    expect(capturedIconProps).toHaveLength(1);
    expect(capturedIconProps[0]?.id).toBe('caret-right');
    expect(capturedIconProps[0]?.size).toBe('0.75em');
  });

  it('renders the caret-down icon when open', () => {
    const props = createProps({
      open: true,
      children: <div data-testid="group-children">Children</div>,
    });

    render(<CategoryGroup {...props} />);

    expect(screen.getByTestId('icon-caret-down')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-caret-right')).not.toBeInTheDocument();

    expect(capturedIconProps).toHaveLength(1);
    expect(capturedIconProps[0]?.id).toBe('caret-down');
    expect(capturedIconProps[0]?.size).toBe('0.75em');
  });

  it('renders arbitrary children when provided', () => {
    const props = createProps({
      children: (
        <div data-testid="custom-children">
          <span>Nested content</span>
        </div>
      ),
    });

    render(<CategoryGroup {...props} />);

    expect(screen.getByTestId('custom-children')).toBeInTheDocument();
    expect(screen.getByText('Nested content')).toBeInTheDocument();
  });

  it('treats null children as having no children', () => {
    const props = createProps({
      children: null,
      subitem: createSubitem({
        label: 'Featured',
        href: '/featured',
      }),
    });

    render(<CategoryGroup {...props} />);

    expect(screen.getByRole('link', { name: 'Featured' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Featured' })).not.toBeInTheDocument();
  });

  it('treats false children as having no children', () => {
    const props = createProps({
      children: false as unknown as ReactNode,
      subitem: createSubitem({
        label: 'Featured',
        href: '/featured',
      }),
    });

    render(<CategoryGroup {...props} />);

    expect(screen.getByRole('link', { name: 'Featured' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Featured' })).not.toBeInTheDocument();
  });
});
