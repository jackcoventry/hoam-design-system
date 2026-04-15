import { render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Footer, type FooterProps } from '@/components/Footer/Footer';

const mockUseMessages = vi.fn<
  (namespace: string) => {
    socialTitle: string;
    backToTop: string;
  }
>();

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => mockUseMessages(namespace),
}));

vi.mock('@/constants/site', () => ({
  SITE: {
    title: 'HOAM',
  },
}));

vi.mock('@/components/Icon', () => ({
  Icon: ({ id }: { id: string }) => (
    <span
      data-testid="icon"
      data-icon-id={id}
    />
  ),
}));

vi.mock('@/components/Layout', () => ({
  Container: ({ children }: { children: ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  Grid: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div
      data-testid="grid"
      className={className}
    >
      {children}
    </div>
  ),
  GridItem: ({ children }: { children: ReactNode }) => (
    <div data-testid="grid-item">{children}</div>
  ),
  Stack: ({ children }: { children: ReactNode }) => <div data-testid="stack">{children}</div>,
}));

vi.mock('@/components/Footer/Footer.module.css', () => ({
  default: {
    root: 'root',
    logo: 'logo',
    sectionTitle: 'sectionTitle',
    list: 'list',
    socialLinks: 'socialLinks',
    separator: 'separator',
    links: 'links',
    backToTop: 'backToTop',
  },
}));

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseMessages.mockReturnValue({
      socialTitle: 'Follow us',
      backToTop: 'Back to top',
    });
  });

  function renderFooter(props?: FooterProps) {
    return render(<Footer {...props} />);
  }

  it('renders the footer landmark', () => {
    renderFooter();

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders the site title logo text', () => {
    renderFooter();

    expect(screen.getByText('HOAM')).toBeInTheDocument();
  });

  it('calls useMessages with the footer namespace', () => {
    renderFooter();

    expect(mockUseMessages).toHaveBeenCalledWith('footer');
  });

  it('renders top link sections and their links', () => {
    renderFooter({
      topLinks: [
        {
          title: 'Shop',
          links: [
            { label: 'All products', href: '/products' },
            { label: 'New arrivals', href: '/new' },
          ],
        },
        {
          title: 'Company',
          links: [{ label: 'About', href: '/about' }],
        },
      ],
    });

    expect(screen.getByRole('heading', { name: 'Shop' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Company' })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'All products' })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: 'New arrivals' })).toHaveAttribute('href', '/new');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });

  it('renders only the first four top link sections', () => {
    renderFooter({
      topLinks: [
        { title: 'One', links: [{ label: 'Link 1', href: '/1' }] },
        { title: 'Two', links: [{ label: 'Link 2', href: '/2' }] },
        { title: 'Three', links: [{ label: 'Link 3', href: '/3' }] },
        { title: 'Four', links: [{ label: 'Link 4', href: '/4' }] },
        { title: 'Five', links: [{ label: 'Link 5', href: '/5' }] },
      ],
    });

    expect(screen.getByRole('heading', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Two' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Three' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Four' })).toBeInTheDocument();

    expect(screen.queryByRole('heading', { name: 'Five' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Link 5' })).not.toBeInTheDocument();
  });

  it('renders bottom links', () => {
    renderFooter({
      bottomLinks: [
        { label: 'Privacy policy', href: '/privacy' },
        { label: 'Terms and conditions', href: '/terms' },
      ],
    });

    expect(screen.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute(
      'href',
      '/privacy'
    );
    expect(screen.getByRole('link', { name: 'Terms and conditions' })).toHaveAttribute(
      'href',
      '/terms'
    );
  });

  it('always renders the back to top link with the translated label', () => {
    renderFooter();

    expect(screen.getByRole('link', { name: 'Back to top' })).toHaveAttribute('href', '#content');
  });

  it('renders the social links section when socialLinks are provided', () => {
    const { container } = renderFooter({
      socialLinks: [
        { label: 'Instagram', href: 'https://instagram.com/hoam', icon: 'instagram' },
        { label: 'X', href: 'https://x.com/hoam', icon: 'x' },
      ],
    });

    expect(screen.getByRole('heading', { name: 'Follow us' })).toBeInTheDocument();

    const socialAnchors = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')
    );

    expect(socialAnchors).toHaveLength(2);

    expect(socialAnchors[0]).toHaveAttribute('href', 'https://instagram.com/hoam');
    expect(socialAnchors[0]).toHaveAttribute('target', '_blank');
    expect(socialAnchors[0]).toHaveAttribute('rel', 'noopener noreferrer');

    expect(socialAnchors[1]).toHaveAttribute('href', 'https://x.com/hoam');
    expect(socialAnchors[1]).toHaveAttribute('target', '_blank');
    expect(socialAnchors[1]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders one icon per social link and passes the icon id through', () => {
    renderFooter({
      socialLinks: [
        { label: 'Instagram', href: 'https://instagram.com/hoam', icon: 'instagram' },
        { label: 'X', href: 'https://x.com/hoam', icon: 'x' },
      ],
    });

    const icons = screen.getAllByTestId('icon');
    expect(icons).toHaveLength(2);

    expect(icons[0]).toHaveAttribute('data-icon-id', 'instagram');
    expect(icons[1]).toHaveAttribute('data-icon-id', 'x');
  });

  it('does not render the social heading or icons when socialLinks is empty', () => {
    renderFooter({
      socialLinks: [],
    });

    expect(screen.queryByRole('heading', { name: 'Follow us' })).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  it('renders correctly with all link arrays omitted', () => {
    renderFooter();

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText('HOAM')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to top' })).toBeInTheDocument();
  });

  it('renders duplicate bottom labels if href keys differ', () => {
    renderFooter({
      bottomLinks: [
        { label: 'Help', href: '/help/customer' },
        { label: 'Help', href: '/help/orders' },
      ],
    });

    const helpLinks = screen.getAllByRole('link', { name: 'Help' });
    expect(helpLinks).toHaveLength(2);
    expect(helpLinks[0]).toHaveAttribute('href', '/help/customer');
    expect(helpLinks[1]).toHaveAttribute('href', '/help/orders');
  });

  it('renders links inside each top section in the correct grouping', () => {
    renderFooter({
      topLinks: [
        {
          title: 'Shop',
          links: [
            { label: 'Furniture', href: '/furniture' },
            { label: 'Lighting', href: '/lighting' },
          ],
        },
        {
          title: 'Support',
          links: [
            { label: 'Contact', href: '/contact' },
            { label: 'Delivery', href: '/delivery' },
          ],
        },
      ],
    });

    const shopHeading = screen.getByRole('heading', { name: 'Shop' });
    const supportHeading = screen.getByRole('heading', { name: 'Support' });

    const shopContainer = shopHeading.parentElement;
    const supportContainer = supportHeading.parentElement;

    expect(shopContainer).toBeTruthy();
    expect(supportContainer).toBeTruthy();

    if (!shopContainer || !supportContainer) {
      throw new Error('Expected section containers to be rendered');
    }

    expect(within(shopContainer).getByRole('link', { name: 'Furniture' })).toHaveAttribute(
      'href',
      '/furniture'
    );
    expect(within(shopContainer).getByRole('link', { name: 'Lighting' })).toHaveAttribute(
      'href',
      '/lighting'
    );

    expect(within(supportContainer).getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/contact'
    );
    expect(within(supportContainer).getByRole('link', { name: 'Delivery' })).toHaveAttribute(
      'href',
      '/delivery'
    );
  });
});
