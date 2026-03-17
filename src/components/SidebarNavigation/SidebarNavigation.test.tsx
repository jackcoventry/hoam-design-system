import { type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SidebarNavigation } from '@/components/SidebarNavigation';

const mockUseMediaQuery = vi.fn<(query: string) => boolean>();

vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: (query: string) => mockUseMediaQuery(query),
}));

vi.mock('@/components/Button', () => ({
  Button: ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

vi.mock('@/components/Accordion', () => ({
  Accordion: ({ children }: { children: ReactNode }) => (
    <div data-testid="accordion">{children}</div>
  ),
  AccordionItem: ({ children }: { children: ReactNode }) => (
    <div data-testid="accordion-item">{children}</div>
  ),
  AccordionHeader: ({ children, className }: { children: ReactNode; className?: string }) => (
    <h2 className={className}>{children}</h2>
  ),
  AccordionPanel: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const items = [
  {
    id: 'section-1',
    label: 'Section One',
    items: [
      { id: 'child-1', label: 'Overview', href: '/overview' },
      { id: 'child-2', label: 'Getting Started', href: '/getting-started' },
    ],
  },
  {
    id: 'section-2',
    label: 'Section Two',
    items: [{ id: 'child-3', label: 'Components', href: '/components' }],
  },
];

describe('SidebarNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders desktop navigation when not on mobile', () => {
    mockUseMediaQuery.mockReturnValue(false);

    render(<SidebarNavigation items={items} />);

    expect(screen.getByRole('navigation', { name: 'Sidebar navigation' })).toBeInTheDocument();

    expect(screen.getByText('Section One')).toBeInTheDocument();
    expect(screen.getByText('Section Two')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('href', '/overview');
    expect(screen.getByRole('link', { name: 'Getting Started' })).toHaveAttribute(
      'href',
      '/getting-started'
    );
    expect(screen.getByRole('link', { name: 'Components' })).toHaveAttribute('href', '/components');

    expect(
      screen.queryByRole('button', { name: /show navigation|hide navigation/i })
    ).not.toBeInTheDocument();
  });

  it('renders mobile toggle button when on mobile', () => {
    mockUseMediaQuery.mockReturnValue(true);

    render(<SidebarNavigation items={items} />);

    expect(screen.getByRole('button', { name: 'Show navigation' })).toBeInTheDocument();
  });

  it('toggles the mobile button text when clicked', async () => {
    const user = userEvent.setup();
    mockUseMediaQuery.mockReturnValue(true);

    render(<SidebarNavigation items={items} />);

    const button = screen.getByRole('button', { name: 'Show navigation' });

    await user.click(button);

    expect(screen.getByRole('button', { name: 'Hide navigation' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Hide navigation' }));

    expect(screen.getByRole('button', { name: 'Show navigation' })).toBeInTheDocument();
  });

  it('renders accordion content in mobile mode after opening the navigation', async () => {
    const user = userEvent.setup();
    mockUseMediaQuery.mockReturnValue(true);

    render(<SidebarNavigation items={items} />);

    expect(screen.getByTestId('accordion')).toBeInTheDocument();
    expect(screen.getAllByTestId('accordion-item')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Show navigation' }));

    expect(screen.getByText('Section One')).toBeInTheDocument();
    expect(screen.getByText('Section Two')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('href', '/overview');
    expect(screen.getByRole('link', { name: 'Components' })).toHaveAttribute('href', '/components');
  });

  it('renders no links when items is empty', () => {
    mockUseMediaQuery.mockReturnValue(false);

    render(<SidebarNavigation items={[]} />);

    expect(screen.getByRole('navigation', { name: 'Sidebar navigation' })).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
