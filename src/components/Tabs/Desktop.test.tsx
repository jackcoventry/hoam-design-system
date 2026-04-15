import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { DesktopTabs } from '@/components/Tabs';

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    onClick,
    onKeyDown,
    id,
    role,
    tabIndex,
    className,
    variant,
    ref,
    ...rest
  }: {
    children: ReactNode;
    onClick?: () => void;
    onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
    id?: string;
    role?: string;
    tabIndex?: number;
    className?: string;
    variant?: string;
    ref?: ((element: HTMLButtonElement | null) => void) | React.RefObject<HTMLButtonElement | null>;
    'aria-selected'?: boolean;
    'aria-controls'?: string;
    'data-active'?: string;
  }) => {
    function setRef(element: HTMLButtonElement | null) {
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref && 'current' in ref) {
        ref.current = element;
      }
    }

    return (
      <button
        {...rest}
        id={id}
        ref={setRef}
        type="button"
        role={role}
        tabIndex={tabIndex}
        className={className}
        data-variant={variant}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {children}
      </button>
    );
  },
}));

vi.mock('@/components/Common/BodyText', () => ({
  BodyText: ({ children }: { children: ReactNode }) => (
    <div data-testid="body-text">{children}</div>
  ),
}));

vi.mock('@/components/Tabs/Tabs.module.css', () => ({
  default: {
    root: 'root',
    list: 'list',
    control: 'control',
    panel: 'panel',
  },
}));

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');

  return {
    ...actual,
    Activity: ({ children, mode }: { children: ReactNode; mode: 'visible' | 'hidden' }) => (
      <div
        data-testid="activity"
        data-mode={mode}
      >
        {children}
      </div>
    ),
  };
});

describe('DesktopTabs', () => {
  const items = [
    {
      id: 'details',
      label: 'Details',
      content: <p>Details content</p>,
    },
    {
      id: 'shipping',
      label: 'Shipping',
      content: <div>Shipping content</div>,
    },
    {
      id: 'returns',
      label: 'Returns',
      content: <span>Returns content</span>,
    },
  ];

  it('renders nothing when items is empty', () => {
    const { container } = render(
      <DesktopTabs
        title="Product information"
        items={[]}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the tablist with the provided title', () => {
    render(
      <DesktopTabs
        title="Product information"
        items={items}
      />
    );

    expect(screen.getByRole('tablist', { name: 'Product information' })).toBeInTheDocument();
  });

  it('defaults to vertical layout and manual mode', () => {
    const { container } = render(
      <DesktopTabs
        title="Product information"
        items={items}
      />
    );

    expect(container.querySelector('[data-layout="vertical"]')).toBeInTheDocument();
    expect(container.querySelector('[data-mode="manual"]')).toBeInTheDocument();
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('renders the supplied horizontal layout and automatic mode', () => {
    const { container } = render(
      <DesktopTabs
        title="Product information"
        items={items}
        layout="horizontal"
        mode="automatic"
      />
    );

    expect(container.querySelector('[data-layout="horizontal"]')).toBeInTheDocument();
    expect(container.querySelector('[data-mode="automatic"]')).toBeInTheDocument();
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renders one tab and one tabpanel per item', () => {
    render(
      <DesktopTabs
        title="Product information"
        items={items}
      />
    );

    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getAllByRole('tabpanel', { hidden: true })).toHaveLength(3);
  });

  it('selects the first tab by default', () => {
    render(
      <DesktopTabs
        title="Product information"
        items={items}
      />
    );

    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    const shippingTab = screen.getByRole('tab', { name: 'Shipping' });
    const returnsTab = screen.getByRole('tab', { name: 'Returns' });

    expect(detailsTab).toHaveAttribute('aria-selected', 'true');
    expect(detailsTab).toHaveAttribute('tabindex', '0');

    expect(shippingTab).toHaveAttribute('aria-selected', 'false');
    expect(shippingTab).toHaveAttribute('tabindex', '-1');

    expect(returnsTab).toHaveAttribute('aria-selected', 'false');
    expect(returnsTab).toHaveAttribute('tabindex', '-1');
  });

  it('shows only the active panel initially', () => {
    const { container } = render(
      <DesktopTabs
        title="Product information"
        items={items}
      />
    );

    const panels = screen.getAllByRole('tabpanel', { hidden: true });
    expect(panels).toHaveLength(3);

    const detailsPanel = container.querySelector<HTMLElement>('#hoam-panel-details');
    const shippingPanel = container.querySelector<HTMLElement>('#hoam-panel-shipping');
    const returnsPanel = container.querySelector<HTMLElement>('#hoam-panel-returns');

    expect(detailsPanel).not.toBeNull();
    expect(shippingPanel).not.toBeNull();
    expect(returnsPanel).not.toBeNull();

    if (!detailsPanel || !shippingPanel || !returnsPanel) {
      throw new Error('Expected all tab panels to be rendered');
    }

    expect(detailsPanel).not.toHaveAttribute('hidden');
    expect(shippingPanel).toHaveAttribute('hidden');
    expect(returnsPanel).toHaveAttribute('hidden');
  });

  it('links tabs and panels with matching accessibility attributes', () => {
    const { container } = render(
      <DesktopTabs
        title="Product information"
        items={items}
      />
    );

    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    const detailsPanel = container.querySelector<HTMLElement>('#hoam-panel-details');

    expect(detailsTab).toHaveAttribute('id', 'hoam-tab-details');
    expect(detailsTab).toHaveAttribute('aria-controls', 'hoam-panel-details');

    expect(detailsPanel).not.toBeNull();

    if (!detailsPanel) {
      throw new Error('Expected details panel to be rendered');
    }

    expect(detailsPanel).toHaveAttribute('id', 'hoam-panel-details');
    expect(detailsPanel).toHaveAttribute('aria-labelledby', 'hoam-tab-details');
  });

  it('activates a tab when clicked', () => {
    const { container } = render(
      <DesktopTabs
        title="Product information"
        items={items}
      />
    );

    const shippingTab = screen.getByRole('tab', { name: 'Shipping' });
    fireEvent.click(shippingTab);

    expect(shippingTab).toHaveAttribute('aria-selected', 'true');
    expect(shippingTab).toHaveAttribute('tabindex', '0');

    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    expect(detailsTab).toHaveAttribute('aria-selected', 'false');
    expect(detailsTab).toHaveAttribute('tabindex', '-1');

    const shippingPanel = container.querySelector<HTMLElement>('#hoam-panel-shipping');
    expect(shippingPanel).not.toBeNull();

    if (!shippingPanel) {
      throw new Error('Expected shipping panel to be rendered');
    }

    expect(shippingPanel).not.toHaveAttribute('hidden');
  });

  it('uses the active variant for the selected tab and secondary for others', () => {
    render(
      <DesktopTabs
        title="Product information"
        items={items}
      />
    );

    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    const shippingTab = screen.getByRole('tab', { name: 'Shipping' });

    expect(detailsTab).toHaveAttribute('data-variant', 'tertiary');
    expect(shippingTab).toHaveAttribute('data-variant', 'secondary');
  });

  it('moves focus with ArrowDown in vertical layout without activating in manual mode', () => {
    render(
      <DesktopTabs
        title="Product information"
        items={items}
        layout="vertical"
        mode="manual"
      />
    );

    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    const shippingTab = screen.getByRole('tab', { name: 'Shipping' });

    detailsTab.focus();
    fireEvent.keyDown(detailsTab, { key: 'ArrowDown' });

    expect(shippingTab).toHaveFocus();
    expect(detailsTab).toHaveAttribute('aria-selected', 'true');
    expect(shippingTab).toHaveAttribute('aria-selected', 'false');
  });

  it('moves focus with ArrowUp in vertical layout and wraps to the last tab', () => {
    render(
      <DesktopTabs
        title="Product information"
        items={items}
        layout="vertical"
        mode="manual"
      />
    );

    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    const returnsTab = screen.getByRole('tab', { name: 'Returns' });

    detailsTab.focus();
    fireEvent.keyDown(detailsTab, { key: 'ArrowUp' });

    expect(returnsTab).toHaveFocus();
    expect(detailsTab).toHaveAttribute('aria-selected', 'true');
    expect(returnsTab).toHaveAttribute('aria-selected', 'false');
  });

  it('moves focus with ArrowRight in horizontal layout without activating in manual mode', () => {
    render(
      <DesktopTabs
        title="Product information"
        items={items}
        layout="horizontal"
        mode="manual"
      />
    );

    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    const shippingTab = screen.getByRole('tab', { name: 'Shipping' });

    detailsTab.focus();
    fireEvent.keyDown(detailsTab, { key: 'ArrowRight' });

    expect(shippingTab).toHaveFocus();
    expect(detailsTab).toHaveAttribute('aria-selected', 'true');
    expect(shippingTab).toHaveAttribute('aria-selected', 'false');
  });

  it('moves focus with ArrowLeft in horizontal layout and wraps to the last tab', () => {
    render(
      <DesktopTabs
        title="Product information"
        items={items}
        layout="horizontal"
        mode="manual"
      />
    );

    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    const returnsTab = screen.getByRole('tab', { name: 'Returns' });

    detailsTab.focus();
    fireEvent.keyDown(detailsTab, { key: 'ArrowLeft' });

    expect(returnsTab).toHaveFocus();
    expect(detailsTab).toHaveAttribute('aria-selected', 'true');
    expect(returnsTab).toHaveAttribute('aria-selected', 'false');
  });

  it('activates the focused tab during arrow navigation in automatic mode', () => {
    render(
      <DesktopTabs
        title="Product information"
        items={items}
        layout="vertical"
        mode="automatic"
      />
    );

    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    const shippingTab = screen.getByRole('tab', { name: 'Shipping' });

    detailsTab.focus();
    fireEvent.keyDown(detailsTab, { key: 'ArrowDown' });

    expect(shippingTab).toHaveFocus();
    expect(shippingTab).toHaveAttribute('aria-selected', 'true');
    expect(detailsTab).toHaveAttribute('aria-selected', 'false');
  });

  it('moves focus to the first tab with Home and activates in automatic mode', () => {
    render(
      <DesktopTabs
        title="Product information"
        items={items}
        mode="automatic"
      />
    );

    const returnsTab = screen.getByRole('tab', { name: 'Returns' });
    const detailsTab = screen.getByRole('tab', { name: 'Details' });

    fireEvent.click(returnsTab);
    returnsTab.focus();
    fireEvent.keyDown(returnsTab, { key: 'Home' });

    expect(detailsTab).toHaveFocus();
    expect(detailsTab).toHaveAttribute('aria-selected', 'true');
  });

  it('moves focus to the last tab with End and activates in automatic mode', () => {
    render(
      <DesktopTabs
        title="Product information"
        items={items}
        mode="automatic"
      />
    );

    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    const returnsTab = screen.getByRole('tab', { name: 'Returns' });

    detailsTab.focus();
    fireEvent.keyDown(detailsTab, { key: 'End' });

    expect(returnsTab).toHaveFocus();
    expect(returnsTab).toHaveAttribute('aria-selected', 'true');
  });

  it('activates the focused tab with Enter in manual mode', () => {
    render(
      <DesktopTabs
        title="Product information"
        items={items}
        mode="manual"
      />
    );

    const shippingTab = screen.getByRole('tab', { name: 'Shipping' });

    shippingTab.focus();
    fireEvent.keyDown(shippingTab, { key: 'Enter' });

    expect(shippingTab).toHaveAttribute('aria-selected', 'true');
  });

  it('activates the focused tab with Space in manual mode', () => {
    render(
      <DesktopTabs
        title="Product information"
        items={items}
        mode="manual"
      />
    );

    const shippingTab = screen.getByRole('tab', { name: 'Shipping' });

    shippingTab.focus();
    fireEvent.keyDown(shippingTab, { key: ' ' });

    expect(shippingTab).toHaveAttribute('aria-selected', 'true');
  });

  it('ignores ArrowLeft and ArrowRight in vertical layout', () => {
    render(
      <DesktopTabs
        title="Product information"
        items={items}
        layout="vertical"
        mode="manual"
      />
    );

    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    const shippingTab = screen.getByRole('tab', { name: 'Shipping' });

    detailsTab.focus();
    fireEvent.keyDown(detailsTab, { key: 'ArrowRight' });

    expect(detailsTab).toHaveFocus();
    expect(shippingTab).not.toHaveFocus();
    expect(detailsTab).toHaveAttribute('aria-selected', 'true');
  });

  it('ignores ArrowUp and ArrowDown in horizontal layout', () => {
    render(
      <DesktopTabs
        title="Product information"
        items={items}
        layout="horizontal"
        mode="manual"
      />
    );

    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    const shippingTab = screen.getByRole('tab', { name: 'Shipping' });

    detailsTab.focus();
    fireEvent.keyDown(detailsTab, { key: 'ArrowDown' });

    expect(detailsTab).toHaveFocus();
    expect(shippingTab).not.toHaveFocus();
    expect(detailsTab).toHaveAttribute('aria-selected', 'true');
  });

  it('ignores unrelated keys', () => {
    render(
      <DesktopTabs
        title="Product information"
        items={items}
      />
    );

    const detailsTab = screen.getByRole('tab', { name: 'Details' });
    fireEvent.keyDown(detailsTab, { key: 'Escape' });

    expect(detailsTab).toHaveAttribute('aria-selected', 'true');
  });
});
