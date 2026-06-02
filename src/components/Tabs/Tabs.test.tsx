import { forwardRef, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type TabProps, Tabs } from '@/components/Tabs';

const mockUseMediaQuery = vi.fn<(query: string) => boolean>();

type MockButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  id?: string;
  role?: string;
  'aria-selected'?: boolean;
  'aria-controls'?: string;
  tabIndex?: number;
  className?: string;
  variant?: string;
};

vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: (query: string) => mockUseMediaQuery(query),
}));

vi.mock('@/styles/breakpoints', () => ({
  BREAKPOINTS: {
    UP: {
      MD: '48rem',
    },
  },
}));

vi.mock('@/components/Accordion', () => ({
  Accordion: ({ children, showToggleAll }: { children: ReactNode; showToggleAll?: boolean }) => (
    <div
      data-testid="accordion"
      data-show-toggle-all={String(showToggleAll)}
    >
      {children}
    </div>
  ),
  AccordionItem: ({ children, id }: { children: ReactNode; id: string }) => (
    <section
      data-testid="accordion-item"
      data-id={id}
    >
      {children}
    </section>
  ),
  AccordionHeader: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
  AccordionPanel: ({ children }: { children: ReactNode }) => (
    <div data-testid="accordion-panel">{children}</div>
  ),
}));

vi.mock('@/components/Button', () => ({
  Button: forwardRef<HTMLButtonElement, MockButtonProps>(function MockButton(
    {
      children,
      onClick,
      onKeyDown,
      id,
      role,
      'aria-selected': ariaSelected,
      'aria-controls': ariaControls,
      tabIndex,
      className,
      variant,
      ...rest
    },
    ref
  ) {
    function setRef(element: HTMLButtonElement | null) {
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = element;
      }
    }

    return (
      <button
        {...rest}
        id={id}
        ref={setRef}
        type="button"
        role={role}
        aria-selected={ariaSelected}
        aria-controls={ariaControls}
        tabIndex={tabIndex}
        className={className}
        data-variant={variant}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {children}
      </button>
    );
  }),
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

describe('Tabs', () => {
  const items: TabProps[] = [
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
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMediaQuery.mockReturnValue(true);
  });

  describe('desktop', () => {
    it('renders desktop tabs when the media query matches', () => {
      render(
        <Tabs
          title="Product information"
          items={items}
        />
      );

      expect(mockUseMediaQuery).toHaveBeenCalledWith('(min-width: 48rem)');
      expect(screen.getByRole('tablist', { name: 'Product information' })).toBeInTheDocument();
      expect(screen.queryByTestId('accordion')).not.toBeInTheDocument();
    });

    it('renders one tab per item', () => {
      render(
        <Tabs
          title="Product information"
          items={items}
        />
      );

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(2);

      expect(screen.getByRole('tab', { name: 'Details' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Shipping' })).toBeInTheDocument();
    });

    it('renders one tabpanel per item and shows the first panel initially', () => {
      const { container } = render(
        <Tabs
          title="Product information"
          items={items}
        />
      );

      const panels = screen.getAllByRole('tabpanel', { hidden: true });
      expect(panels).toHaveLength(2);

      const detailsPanel = container.querySelector<HTMLElement>('#hoam-panel-details');
      const shippingPanel = container.querySelector<HTMLElement>('#hoam-panel-shipping');

      expect(detailsPanel).not.toBeNull();
      expect(shippingPanel).not.toBeNull();

      if (!detailsPanel || !shippingPanel) {
        throw new Error('Expected tab panels to be rendered');
      }

      expect(detailsPanel).not.toHaveAttribute('hidden');
      expect(shippingPanel).toHaveAttribute('hidden');
    });

    it('passes layout through to DesktopTabs when provided', () => {
      const { container } = render(
        <Tabs
          title="Product information"
          items={items}
          layout="horizontal"
        />
      );

      const root = container.querySelector('[data-layout="horizontal"]');
      expect(root).toBeInTheDocument();

      expect(screen.getByRole('tablist', { name: 'Product information' })).toHaveAttribute(
        'aria-orientation',
        'horizontal'
      );
    });

    it('passes mode through to DesktopTabs when provided', () => {
      const { container } = render(
        <Tabs
          title="Product information"
          items={items}
          mode="automatic"
        />
      );

      const root = container.querySelector('[data-mode="automatic"]');
      expect(root).toBeInTheDocument();
    });

    it('lets DesktopTabs use its defaults when layout and mode are omitted', () => {
      const { container } = render(
        <Tabs
          title="Product information"
          items={items}
        />
      );

      expect(container.querySelector('[data-layout="vertical"]')).toBeInTheDocument();
      expect(container.querySelector('[data-mode="manual"]')).toBeInTheDocument();

      expect(screen.getByRole('tablist', { name: 'Product information' })).toHaveAttribute(
        'aria-orientation',
        'vertical'
      );
    });

    it('renders nothing on desktop when items is empty', () => {
      const { container } = render(
        <Tabs
          title="Empty tabs"
          items={[]}
        />
      );

      expect(mockUseMediaQuery).toHaveBeenCalledWith('(min-width: 48rem)');
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
      expect(screen.queryByTestId('accordion')).not.toBeInTheDocument();
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('mobile', () => {
    beforeEach(() => {
      mockUseMediaQuery.mockReturnValue(false);
    });

    it('renders a labelled section and accordion when the media query does not match', () => {
      render(
        <Tabs
          title="Product information"
          items={items}
        />
      );

      expect(mockUseMediaQuery).toHaveBeenCalledWith('(min-width: 48rem)');
      expect(screen.getByRole('region', { name: 'Product information' })).toBeInTheDocument();
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    });

    it('renders the accordion with showToggleAll set to false', () => {
      render(
        <Tabs
          title="Product information"
          items={items}
        />
      );

      expect(screen.getByTestId('accordion')).toHaveAttribute('data-show-toggle-all', 'false');
    });

    it('renders one accordion item per tab', () => {
      render(
        <Tabs
          title="Product information"
          items={items}
        />
      );

      const accordionItems = screen.getAllByTestId('accordion-item');
      expect(accordionItems).toHaveLength(2);
      expect(accordionItems[0]).toHaveAttribute('data-id', 'details');
      expect(accordionItems[1]).toHaveAttribute('data-id', 'shipping');
    });

    it('renders each tab label and content in the accordion', () => {
      render(
        <Tabs
          title="Product information"
          items={items}
        />
      );

      expect(screen.getByRole('heading', { name: 'Details' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Shipping' })).toBeInTheDocument();

      expect(screen.getByText('Details content')).toBeInTheDocument();
      expect(screen.getByText('Shipping content')).toBeInTheDocument();
    });

    it('ignores layout and mode on mobile and still renders the accordion branch', () => {
      render(
        <Tabs
          title="Product information"
          items={items}
          layout="horizontal"
          mode="automatic"
        />
      );

      expect(screen.getByTestId('accordion')).toBeInTheDocument();
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    });

    it('renders an empty labelled section on mobile when items is empty', () => {
      render(
        <Tabs
          title="Empty tabs"
          items={[]}
        />
      );

      expect(screen.getByRole('region', { name: 'Empty tabs' })).toBeInTheDocument();
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
      expect(screen.queryAllByTestId('accordion-item')).toHaveLength(0);
    });
  });
});
