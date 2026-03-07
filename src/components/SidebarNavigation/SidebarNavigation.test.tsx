import SidebarNavigation from '@/components/SidebarNavigation/SidebarNavigation';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { useMediaQuery } from '@/hooks/useMediaQuery';

// Mock the media query hook so we can force "mobile" vs "desktop"
vi.mock('@/utils/useMediaQuery', () => ({
  __esModule: true,
  default: vi.fn(),
}));

const mockUseMediaQuery = useMediaQuery as unknown as Mock;

// Some simple mock data
const mockItems = [
  {
    id: 'account',
    label: 'Account',
    items: [
      { id: 'profile', label: 'Profile', href: '/account/profile' },
      { id: 'security', label: 'Security', href: '/account/security' },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    items: [{ id: 'order-history', label: 'Order history', href: '/account/orders' }],
  },
];

describe('SidebarNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders desktop navigation when not on mobile', () => {
    mockUseMediaQuery.mockReturnValue(false); // isMobile = false

    render(<SidebarNavigation items={mockItems} />);

    // Should render a <nav> with all headings and links
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    // No "Show navigation" / "Hide navigation" toggle button on desktop
    expect(screen.queryByRole('button', { name: /show navigation/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /hide navigation/i })).not.toBeInTheDocument();

    // Section headings appear
    expect(screen.getByRole('heading', { level: 2, name: 'Account' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Orders' })).toBeInTheDocument();

    // Links appear
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute(
      'href',
      '/account/profile'
    );
    expect(screen.getByRole('link', { name: 'Security' })).toHaveAttribute(
      'href',
      '/account/security'
    );
    expect(screen.getByRole('link', { name: 'Order history' })).toHaveAttribute(
      'href',
      '/account/orders'
    );

    // Total links = 3
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('renders mobile toggle button and hides navigation by default', async () => {
    mockUseMediaQuery.mockReturnValue(true); // isMobile = true

    render(<SidebarNavigation items={mockItems} />);

    // Toggle button shows "Show navigation" initially
    const toggle = screen.getByRole('button', { name: /show navigation/i });
    expect(toggle).toBeInTheDocument();

    // Navigation items should not be visible initially
    expect(screen.queryByText('Account')).not.toBeInTheDocument();
    expect(screen.queryByText('Orders')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Profile' })).not.toBeInTheDocument();
  });

  it('shows navigation when the mobile toggle button is clicked', async () => {
    mockUseMediaQuery.mockReturnValue(true); // isMobile = true
    const user = userEvent.setup();

    render(<SidebarNavigation items={mockItems} />);

    const toggle = screen.getByRole('button', { name: /show navigation/i });

    // Click to open
    await user.click(toggle);

    // Button label updates
    expect(screen.getByRole('button', { name: /hide navigation/i })).toBeInTheDocument();

    // Accordion content should now be visible
    expect(screen.getByRole('heading', { level: 2, name: 'Account' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Orders' })).toBeInTheDocument();

    // Links should now be visible
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute(
      'href',
      '/account/profile'
    );
    expect(screen.getByRole('link', { name: 'Order history' })).toHaveAttribute(
      'href',
      '/account/orders'
    );
  });

  it('hides navigation again when the mobile toggle button is clicked twice', async () => {
    mockUseMediaQuery.mockReturnValue(true); // isMobile = true
    const user = userEvent.setup();

    render(<SidebarNavigation items={mockItems} />);

    const toggle = screen.getByRole('button', { name: /show navigation/i });

    // Open
    await user.click(toggle);
    // Close
    await user.click(screen.getByRole('button', { name: /hide navigation/i }));

    // Back to initial label
    expect(screen.getByRole('button', { name: /show navigation/i })).toBeInTheDocument();

    // Content hidden again
    expect(screen.queryByText('Account')).not.toBeInTheDocument();
    expect(screen.queryByText('Orders')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Profile' })).not.toBeInTheDocument();
  });

  it('handles empty or undefined items without crashing', () => {
    mockUseMediaQuery.mockReturnValue(false); // desktop

    // Should not throw even if items is undefined
    render(<SidebarNavigation items={undefined as any} />);

    // Nav still exists but has no links/headings
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByRole('heading')).toBeNull();
  });
});
