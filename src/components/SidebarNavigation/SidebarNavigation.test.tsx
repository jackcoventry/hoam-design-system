import { fireEvent, render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  type ItemProps,
  SidebarNavigation,
} from '@/components/SidebarNavigation/SidebarNavigation';

const mockUseMediaQuery = vi.fn<(query: string) => boolean>();
const mockUseMessages = vi.fn<
  (namespace: string) => {
    title: string;
    hide: string;
    show: string;
  }
>();

vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: (query: string) => mockUseMediaQuery(query),
}));

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => mockUseMessages(namespace),
}));

vi.mock('@/styles/breakpoints', () => ({
  BREAKPOINTS: {
    UP: {
      SM: '40rem',
    },
  },
}));

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    onClick,
    icon,
    size,
  }: {
    children: ReactNode;
    onClick?: () => void;
    icon?: string;
    size?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      data-icon={icon}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/Accordion', () => ({
  Accordion: ({ children }: { children: ReactNode }) => (
    <div data-testid="accordion">{children}</div>
  ),
  AccordionItem: ({ children, id }: { children: ReactNode; id: string }) => (
    <section
      data-testid="accordion-item"
      data-id={id}
    >
      {children}
    </section>
  ),
  AccordionHeader: ({ children, className }: { children: ReactNode; className?: string }) => (
    <h2 className={className}>{children}</h2>
  ),
  AccordionPanel: ({ children }: { children: ReactNode }) => (
    <div data-testid="accordion-panel">{children}</div>
  ),
}));

vi.mock('@/components/Layout', () => ({
  Stack: ({ children }: { children: ReactNode; gap?: string }) => (
    <div data-testid="stack">{children}</div>
  ),
}));

vi.mock('@/components/Loading', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock('@/components/SidebarNavigation/SidebarNavigation.module.css', () => ({
  default: {
    root: 'root',
    list: 'list',
    topLevelItem: 'topLevelItem',
    sectionTitle: 'sectionTitle',
    link: 'link',
  },
}));

describe('SidebarNavigation', () => {
  const items: ItemProps[] = [
    {
      id: 'section-1',
      label: 'Section One',
      items: [
        {
          id: 'child-1',
          label: 'First Link',
          href: '/first',
        },
        {
          id: 'child-2',
          label: 'Second Link',
          href: '/second',
        },
      ],
    },
    {
      id: 'section-2',
      label: 'Section Two',
      items: [
        {
          id: 'child-3',
          label: 'Third Link',
          href: '/third',
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseMessages.mockReturnValue({
      title: 'Sidebar navigation',
      hide: 'Hide navigation',
      show: 'Show navigation',
    });

    mockUseMediaQuery.mockReturnValue(true);
  });

  describe('desktop', () => {
    it('renders a nav with the default translated aria-label', () => {
      render(<SidebarNavigation items={items} />);

      expect(mockUseMessages).toHaveBeenCalledWith('sidebarNavigation');
      expect(mockUseMediaQuery).toHaveBeenCalledWith('(min-width: 40rem)');

      const nav = screen.getByRole('navigation', { name: 'Sidebar navigation' });
      expect(nav).toBeInTheDocument();
    });

    it('renders a nav with a custom aria-label', () => {
      render(
        <SidebarNavigation
          items={items}
          aria-label="Documentation sections"
        />
      );

      expect(
        screen.getByRole('navigation', { name: 'Documentation sections' })
      ).toBeInTheDocument();
    });

    it('renders top-level section headings and child links', () => {
      render(<SidebarNavigation items={items} />);

      const nav = screen.getByRole('navigation', { name: 'Sidebar navigation' });

      expect(within(nav).getByRole('heading', { name: 'Section One' })).toBeInTheDocument();
      expect(within(nav).getByRole('heading', { name: 'Section Two' })).toBeInTheDocument();

      const firstLink = within(nav).getByRole('link', { name: 'First Link' });
      const secondLink = within(nav).getByRole('link', { name: 'Second Link' });
      const thirdLink = within(nav).getByRole('link', { name: 'Third Link' });

      expect(firstLink).toHaveAttribute('href', '/first');
      expect(secondLink).toHaveAttribute('href', '/second');
      expect(thirdLink).toHaveAttribute('href', '/third');
    });

    it('renders no links when items are omitted', () => {
      render(<SidebarNavigation />);

      const nav = screen.getByRole('navigation', { name: 'Sidebar navigation' });
      expect(nav).toBeInTheDocument();
      expect(within(nav).queryAllByRole('link')).toHaveLength(0);
      expect(within(nav).queryAllByRole('heading')).toHaveLength(0);
    });

    it('renders a section with no child links when a top-level item has no items', () => {
      render(
        <SidebarNavigation
          items={[
            {
              id: 'section-empty',
              label: 'Empty Section',
            },
          ]}
        />
      );

      const nav = screen.getByRole('navigation', { name: 'Sidebar navigation' });
      expect(within(nav).getByRole('heading', { name: 'Empty Section' })).toBeInTheDocument();
      expect(within(nav).queryAllByRole('link')).toHaveLength(0);
    });
  });

  describe('mobile', () => {
    beforeEach(() => {
      mockUseMediaQuery.mockReturnValue(false);
    });

    it('renders the show button with default translated label when closed', () => {
      render(<SidebarNavigation items={items} />);

      const button = screen.getByRole('button', { name: 'Show navigation' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-icon', 'caret-right');
      expect(button).toHaveAttribute('data-size', 'small');

      expect(screen.getByTestId('accordion').parentElement).toHaveAttribute('hidden');
    });

    it('toggles to open state and shows the hide label', () => {
      render(<SidebarNavigation items={items} />);

      const button = screen.getByRole('button', { name: 'Show navigation' });
      fireEvent.click(button);

      const openButton = screen.getByRole('button', { name: 'Hide navigation' });
      expect(openButton).toBeInTheDocument();
      expect(openButton).toHaveAttribute('data-icon', 'caret-down');

      expect(screen.getByTestId('accordion').parentElement).not.toHaveAttribute('hidden');
    });

    it('toggles open and closed repeatedly', () => {
      render(<SidebarNavigation items={items} />);

      fireEvent.click(screen.getByRole('button', { name: 'Show navigation' }));
      expect(screen.getByTestId('accordion').parentElement).not.toHaveAttribute('hidden');

      fireEvent.click(screen.getByRole('button', { name: 'Hide navigation' }));
      expect(screen.getByTestId('accordion').parentElement).toHaveAttribute('hidden');

      expect(screen.getByRole('button', { name: 'Show navigation' })).toBeInTheDocument();
    });

    it('renders accordion items and child links', () => {
      render(<SidebarNavigation items={items} />);

      fireEvent.click(screen.getByRole('button', { name: 'Show navigation' }));

      expect(screen.getByTestId('accordion')).toBeInTheDocument();
      expect(screen.getAllByTestId('accordion-item')).toHaveLength(2);

      expect(screen.getByRole('heading', { name: 'Section One' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Section Two' })).toBeInTheDocument();

      expect(screen.getByRole('link', { name: 'First Link' })).toHaveAttribute('href', '/first');
      expect(screen.getByRole('link', { name: 'Second Link' })).toHaveAttribute('href', '/second');
      expect(screen.getByRole('link', { name: 'Third Link' })).toHaveAttribute('href', '/third');
    });

    it('uses custom show and hide labels when provided', () => {
      render(
        <SidebarNavigation
          items={items}
          showLabel="Open sections"
          hideLabel="Close sections"
        />
      );

      const button = screen.getByRole('button', { name: 'Open sections' });
      expect(button).toBeInTheDocument();

      fireEvent.click(button);

      expect(screen.getByRole('button', { name: 'Close sections' })).toBeInTheDocument();
    });

    it('renders no accordion items when items are omitted', () => {
      render(<SidebarNavigation />);

      expect(screen.getByRole('button', { name: 'Show navigation' })).toBeInTheDocument();
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
      expect(screen.queryAllByTestId('accordion-item')).toHaveLength(0);
      expect(screen.queryAllByRole('link')).toHaveLength(0);
    });

    it('renders an accordion section with no child links when a top-level item has no items', () => {
      render(
        <SidebarNavigation
          items={[
            {
              id: 'section-empty',
              label: 'Empty Section',
            },
          ]}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: 'Show navigation' }));

      expect(screen.getByRole('heading', { name: 'Empty Section' })).toBeInTheDocument();
      expect(screen.getAllByTestId('accordion-item')).toHaveLength(1);
      expect(screen.queryAllByRole('link')).toHaveLength(0);
    });
  });
});
