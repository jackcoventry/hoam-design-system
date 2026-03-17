import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Footer } from '@/components/Footer';

vi.mock('@/mocks/socialLinks', () => ({
  default: [
    {
      name: 'Twitter',
      url: 'https://example.com/twitter',
      icon: 'twitter',
    },
    {
      name: 'Instagram',
      url: 'https://example.com/instagram',
      icon: 'instagram',
    },
  ],
}));

const topLinks = [
  {
    title: 'Products',
    links: [
      { label: 'Coffee', href: '/coffee' },
      { label: 'Subscriptions', href: '/subscriptions' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Support',
    links: [{ label: 'Help', href: '/help' }],
  },
  {
    title: 'Legal',
    links: [{ label: 'Privacy', href: '/privacy' }],
  },
  {
    title: 'Extra',
    links: [{ label: 'Ignored', href: '/ignored' }],
  },
];

const bottomLinks = [
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
];

describe('Footer', () => {
  it('renders the footer landmark', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    render(<Footer />);

    const logo = screen.getByAltText('HOAM logo');

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.png');
  });

  it('renders top link sections', () => {
    render(<Footer topLinks={topLinks.slice(0, 2)} />);

    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Coffee' })).toHaveAttribute('href', '/coffee');
    expect(screen.getByRole('link', { name: 'Careers' })).toHaveAttribute('href', '/careers');
  });

  it('limits rendered top link sections to four', () => {
    render(<Footer topLinks={topLinks} />);

    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();

    expect(screen.queryByText('Extra')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Ignored' })).not.toBeInTheDocument();
  });

  it('renders the social section heading', () => {
    render(<Footer />);

    expect(screen.getByText('Connect with us')).toBeInTheDocument();
  });

  it('renders social links from the mock data', () => {
    render(<Footer />);

    const links = screen.getAllByRole('link');

    expect(links.some((link) => link.getAttribute('href') === 'https://example.com/twitter')).toBe(
      true
    );
    expect(
      links.some((link) => link.getAttribute('href') === 'https://example.com/instagram')
    ).toBe(true);
  });

  it('renders bottom links', () => {
    render(<Footer bottomLinks={bottomLinks} />);

    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute(
      'href',
      '/privacy-policy'
    );
  });

  it('renders safely with no links provided', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByAltText('HOAM logo')).toBeInTheDocument();
  });
});
