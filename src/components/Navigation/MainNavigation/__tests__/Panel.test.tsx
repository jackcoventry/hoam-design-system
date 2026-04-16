import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Panel } from '@/components/Navigation/MainNavigation/Panel';
import type { PanelProps } from '@/components/Navigation/types';

vi.mock('@/components/Layout', () => ({
  Container: ({ children }: { children: ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  Grid: ({ children }: { children: ReactNode }) => <div data-testid="grid">{children}</div>,
  GridItem: ({
    children,
    span,
    spanLg,
  }: {
    children: ReactNode;
    span: number;
    spanLg?: number;
  }) => (
    <div
      data-testid={`grid-item-${span}-${spanLg ?? 'none'}`}
      data-span={String(span)}
      data-span-lg={spanLg === undefined ? '' : String(spanLg)}
    >
      {children}
    </div>
  ),
}));

vi.mock('@/components/Navigation/Navigation.module.css', () => ({
  default: {
    panel: 'panel',
  },
}));

function createProps(overrides: Partial<PanelProps> = {}): PanelProps {
  return {
    id: 'shop-panel',
    labelledBy: 'shop-trigger',
    hidden: false,
    onEnter: vi.fn<() => void>(),
    left: <div data-testid="left-content">Left content</div>,
    right: <div data-testid="right-content">Right content</div>,
    ...overrides,
  };
}

describe('Panel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the panel root element', () => {
    const props = createProps();

    const { container } = render(<Panel {...props} />);

    const panel = container.querySelector('#shop-panel');
    expect(panel).toBeInTheDocument();
    expect(panel?.tagName).toBe('DIV');
  });

  it('sets the id on the panel root', () => {
    const props = createProps({
      id: 'discover-panel',
    });

    const { container } = render(<Panel {...props} />);

    const panel = container.querySelector('#discover-panel');
    expect(panel).toBeInTheDocument();
  });

  it('applies the panel class', () => {
    const props = createProps();

    const { container } = render(<Panel {...props} />);

    const panel = container.querySelector('#shop-panel');
    expect(panel).toHaveClass('panel');
  });

  it('sets aria-labelledby from labelledBy', () => {
    const props = createProps({
      labelledBy: 'discover-trigger',
    });

    const { container } = render(<Panel {...props} />);

    const panel = container.querySelector('#shop-panel');
    expect(panel).toHaveAttribute('aria-labelledby', 'discover-trigger');
  });

  it('is visible when hidden is false', () => {
    const props = createProps({
      hidden: false,
    });

    const { container } = render(<Panel {...props} />);

    const panel = container.querySelector('#shop-panel');
    expect(panel).not.toHaveAttribute('hidden');
  });

  it('is hidden when hidden is true', () => {
    const props = createProps({
      hidden: true,
    });

    const { container } = render(<Panel {...props} />);

    const panel = container.querySelector('#shop-panel');
    expect(panel).toHaveAttribute('hidden');
  });

  it('calls onEnter on pointer enter', () => {
    const props = createProps();

    const { container } = render(<Panel {...props} />);

    const panel = container.querySelector('#shop-panel');
    expect(panel).not.toBeNull();

    if (!panel) {
      throw new Error('Expected panel element to exist');
    }

    fireEvent.pointerEnter(panel);

    expect(props.onEnter).toHaveBeenCalledTimes(1);
  });

  it('renders the layout wrapper components', () => {
    const props = createProps();

    render(<Panel {...props} />);

    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });

  it('renders the left content in the first grid item', () => {
    const props = createProps({
      left: <div data-testid="custom-left">Custom left</div>,
    });

    render(<Panel {...props} />);

    const leftGridItem = screen.getByTestId('grid-item-12-8');
    expect(leftGridItem).toBeInTheDocument();
    expect(screen.getByTestId('custom-left')).toBeInTheDocument();
    expect(leftGridItem).toContainElement(screen.getByTestId('custom-left'));
  });

  it('renders the right content in the second grid item', () => {
    const props = createProps({
      right: <div data-testid="custom-right">Custom right</div>,
    });

    render(<Panel {...props} />);

    const rightGridItem = screen.getByTestId('grid-item-12-4');
    expect(rightGridItem).toBeInTheDocument();
    expect(screen.getByTestId('custom-right')).toBeInTheDocument();
    expect(rightGridItem).toContainElement(screen.getByTestId('custom-right'));
  });

  it('passes the expected span props to the first GridItem', () => {
    const props = createProps();

    render(<Panel {...props} />);

    const leftGridItem = screen.getByTestId('grid-item-12-8');
    expect(leftGridItem).toHaveAttribute('data-span', '12');
    expect(leftGridItem).toHaveAttribute('data-span-lg', '8');
  });

  it('passes the expected span props to the second GridItem', () => {
    const props = createProps();

    render(<Panel {...props} />);

    const rightGridItem = screen.getByTestId('grid-item-12-4');
    expect(rightGridItem).toHaveAttribute('data-span', '12');
    expect(rightGridItem).toHaveAttribute('data-span-lg', '4');
  });

  it('renders arbitrary React content on both sides', () => {
    const props = createProps({
      left: (
        <div>
          <span>Left one</span>
          <span>Left two</span>
        </div>
      ),
      right: (
        <div>
          <span>Right one</span>
          <span>Right two</span>
        </div>
      ),
    });

    render(<Panel {...props} />);

    expect(screen.getByText('Left one')).toBeInTheDocument();
    expect(screen.getByText('Left two')).toBeInTheDocument();
    expect(screen.getByText('Right one')).toBeInTheDocument();
    expect(screen.getByText('Right two')).toBeInTheDocument();
  });

  it('renders safely when right content is null', () => {
    const props = createProps({
      right: null,
    });

    render(<Panel {...props} />);

    expect(screen.getByTestId('grid-item-12-8')).toBeInTheDocument();
    expect(screen.getByTestId('grid-item-12-4')).toBeInTheDocument();
    expect(screen.getByTestId('left-content')).toBeInTheDocument();
  });

  it('renders safely when left content is null', () => {
    const props = createProps({
      left: null,
    });

    render(<Panel {...props} />);

    expect(screen.getByTestId('grid-item-12-8')).toBeInTheDocument();
    expect(screen.getByTestId('grid-item-12-4')).toBeInTheDocument();
    expect(screen.getByTestId('right-content')).toBeInTheDocument();
  });
});
