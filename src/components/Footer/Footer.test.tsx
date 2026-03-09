import { render, screen, within } from '@testing-library/react';

import { Footer } from '@/components/Footer';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/mocks/socialLinks.json', () => ({
  default: [
    { name: 'Facebook', url: 'https://facebook.com/hoam', icon: 'facebook' },
    { name: 'Instagram', url: 'https://instagram.com/hoam', icon: 'instagram' },
    { name: 'TikTok', url: 'https://tiktok.com/@hoam', icon: 'tiktok' },
  ],
}));

vi.mock('./Footer.css', () => ({}));

describe('<Footer />', () => {
  const makeTopLinks = (count: number) =>
    Array.from({ length: count }).map((_, i) => ({
      title: `Section ${i + 1}`,
      links: [
        { label: `S${i + 1}-Link 1`, href: `/s${i + 1}-l1` },
        { label: `S${i + 1}-Link 2`, href: `/s${i + 1}-l2` },
      ],
    }));

  const bottomLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a <footer> landmark and the logo image', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();

    const logo = screen.getByRole('img', { name: /hoam logo/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.png');
    expect(logo).toHaveClass('hoam-footer__logo');
  });

  it('renders up to 4 top link sections (limits extras)', () => {
    const topLinks = makeTopLinks(6); // ask for 6, expect only 4 to render
    render(<Footer topLinks={topLinks} />);

    // Titles that should be present
    for (let i = 1; i <= 4; i++) {
      expect(screen.getByRole('heading', { level: 4, name: `Section ${i}` })).toBeInTheDocument();
    }

    // Titles that should NOT be present due to limit
    expect(screen.queryByRole('heading', { level: 4, name: 'Section 5' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 4, name: 'Section 6' })).not.toBeInTheDocument();

    // Check links for first section as a spot check
    const section1 = screen
      .getByRole('heading', {
        level: 4,
        name: 'Section 1',
      })
      .closest(String.raw`.span-12.xl\:span-2`);
    expect(section1).toBeTruthy();

    const list = within(section1 as HTMLElement).getByRole('list');
    // 2 items defined for each section in makeTopLinks
    const items = within(list).getAllByRole('listitem');
    expect(items.length).toBe(2);
    expect(within(list).getByRole('link', { name: 'S1-Link 1' })).toHaveAttribute('href', '/s1-l1');
    expect(within(list).getByRole('link', { name: 'S1-Link 2' })).toHaveAttribute('href', '/s1-l2');
  });

  it('renders social links with target and rel, and correct SVG <use> references', () => {
    render(<Footer />);

    const connectHeading = screen.getByRole('heading', {
      level: 4,
      name: /connect with us/i,
    });
    expect(connectHeading).toBeInTheDocument();

    const socialContainer = connectHeading.closest(String.raw`.span-12.xl\:span-2`);
    expect(socialContainer).toBeTruthy();

    const links = within(socialContainer as HTMLElement).getAllByRole('link');
    // Based on mocked JSON above -> 3 links
    expect(links.length).toBe(3);

    // Check attributes and nested <use> for each
    const expected = [
      { url: 'https://facebook.com/hoam', icon: 'facebook' },
      { url: 'https://instagram.com/hoam', icon: 'instagram' },
      { url: 'https://tiktok.com/@hoam', icon: 'tiktok' },
    ];

    links.forEach((a, idx) => {
      expect(a).toHaveAttribute('href', expected[idx].url);
      expect(a).toHaveAttribute('target', '_blank');
      expect(a).toHaveAttribute('rel', 'noopener noreferrer');

      const useEl = a.querySelector('use');
      expect(useEl).toBeTruthy();
      expect(useEl?.getAttribute('xlink:href') ?? useEl?.getAttribute('xlinkHref')).toBe(
        `/icons/icons.svg#${expected[idx].icon}`
      );
    });
  });

  it('renders bottom links with correct hrefs', () => {
    render(<Footer bottomLinks={bottomLinks} />);

    bottomLinks.forEach(({ label, href }) => {
      const link = screen.getByRole('link', { name: label });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', href);
    });
  });

  it('handles empty props (no top or bottom links) without crashing', () => {
    render(
      <Footer
        topLinks={[]}
        bottomLinks={[]}
      />
    );

    // Still should have footer and logo
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /hoam logo/i })).toBeInTheDocument();

    const sectionHeadings = screen.getAllByRole('heading', { level: 4 });
    // Expect exactly 1 h4 (the social heading)
    expect(sectionHeadings.map((h) => h.textContent?.trim())).toContain('Connect with us');
  });
});
