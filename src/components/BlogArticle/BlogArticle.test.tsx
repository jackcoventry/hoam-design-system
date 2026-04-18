import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BlogArticle } from '@/components/BlogArticle/BlogArticle';

type UseMessagesBlogArticle = {
  by: string;
  avatarAria: string;
  readingTime: string;
};

type UseMessagesGlobal = {
  share: string;
  shareAria: string;
};

const useMessagesMock = vi.fn<(namespace: string) => UseMessagesBlogArticle | UseMessagesGlobal>();

const parseLooseDateMock = vi.fn<(value: string) => Date | null>();
const formatReadableDateMock = vi.fn<(value: Date) => string>();
const formatISODateMock = vi.fn<(value: Date) => string>();

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => useMessagesMock(namespace),
}));

vi.mock('@/components/Common/BodyText', () => ({
  BodyText: ({ children }: { children: ReactNode }) => (
    <div data-testid="body-text">{children}</div>
  ),
}));

vi.mock('@/components/Icon', () => ({
  Icon: ({ id }: { id: string }) => <span data-testid={`icon-${id}`} />,
}));

vi.mock('@/components/Layout', () => ({
  Container: ({ children }: { children: ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  Grid: ({ children }: { children: ReactNode }) => <div data-testid="grid">{children}</div>,
  GridItem: ({ children }: { children: ReactNode }) => (
    <div data-testid="grid-item">{children}</div>
  ),
  Stack: ({ children }: { children: ReactNode }) => <div data-testid="stack">{children}</div>,
}));

describe('BlogArticle', () => {
  const parsedDate = new Date('2026-04-17T12:00:00.000Z');

  beforeEach(() => {
    vi.clearAllMocks();

    useMessagesMock.mockImplementation((namespace: string) => {
      if (namespace === 'blogArticle') {
        return {
          by: 'By ',
          avatarAria: 'Avatar for',
          readingTime: 'min read',
        };
      }

      return {
        share: 'Share',
        shareAria: 'Share on',
      };
    });

    parseLooseDateMock.mockReturnValue(parsedDate);
    formatReadableDateMock.mockReturnValue('17 April 2026');
    formatISODateMock.mockReturnValue('2026-04-17');
  });

  const baseProps = {
    category: 'Design',
    title: 'How to build a design system',
    summary: 'A practical guide to components and tokens.',
    author: {
      name: 'Jane Smith',
      id: 'jane-smith',
      image: '/authors/jane.jpg',
    },
    profileLink: '/authors/jane-smith',
    publishDate: '2026-04-17',
    readingTime: 8,
    image: {
      src: '/blog/hero.jpg',
      alt: 'Article hero image',
      caption: 'A lovely caption',
    },
    socialLinks: [
      { label: 'Twitter', href: 'https://example.com/twitter', icon: 'twitter' },
      { label: 'LinkedIn', href: 'https://example.com/linkedin', icon: 'linkedin' },
    ],
    children: <p>Article body content</p>,
  };

  it('renders the main article content', () => {
    render(<BlogArticle {...baseProps} />);

    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'How to build a design system' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'A practical guide to components and tokens.',
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId('body-text')).toBeInTheDocument();
    expect(screen.getByText('Article body content')).toBeInTheDocument();
  });

  it('renders author as a profile link when profileLink is provided', () => {
    render(<BlogArticle {...baseProps} />);

    const authorLink = screen.getByRole('link', { name: /Jane Smith/i });
    expect(authorLink).toHaveAttribute('href', '/authors/jane-smith');
    expect(authorLink).toHaveAttribute('rel', 'author');

    const avatar = screen.getByRole('img', { name: 'Avatar for Jane Smith' });
    expect(avatar).toHaveAttribute('src', '/authors/jane.jpg');
  });

  it('renders author without a link when profileLink is not provided', () => {
    render(
      <BlogArticle
        {...baseProps}
        profileLink={undefined}
      />
    );

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Jane Smith/i })).not.toBeInTheDocument();

    const avatar = screen.getByRole('img', { name: 'Avatar for Jane Smith' });
    expect(avatar).toBeInTheDocument();
  });

  it('formats and renders the publish date', () => {
    render(<BlogArticle {...baseProps} />);

    expect(parseLooseDateMock).toHaveBeenCalledWith('2026-04-17');
    expect(formatReadableDateMock).toHaveBeenCalledWith(parsedDate);
    expect(formatISODateMock).toHaveBeenCalledWith(parsedDate);

    const time = screen.getByText('17 April 2026');
    expect(time.tagName.toLowerCase()).toBe('time');
    expect(time).toHaveAttribute('datetime', '2026-04-17');
  });

  it('renders an empty date when parsing fails', () => {
    parseLooseDateMock.mockReturnValueOnce(null);

    render(<BlogArticle {...baseProps} />);

    const timeElements = document.querySelectorAll('time');
    expect(timeElements).toHaveLength(1);
    expect(timeElements[0]).toHaveTextContent('');
    expect(timeElements[0]).toHaveAttribute('datetime', '');
  });

  it('renders reading time and clock icon', () => {
    render(<BlogArticle {...baseProps} />);

    expect(screen.getByText('8 min read')).toBeInTheDocument();
    expect(screen.getByTestId('icon-clock')).toBeInTheDocument();
  });

  it('renders social share links and icons', () => {
    render(<BlogArticle {...baseProps} />);

    expect(screen.getByText('Share')).toBeInTheDocument();

    const twitterLink = screen.getByRole('link', { name: 'Share on Twitter' });
    const linkedInLink = screen.getByRole('link', { name: 'Share on LinkedIn' });

    expect(twitterLink).toHaveAttribute('href', 'https://example.com/twitter');
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(linkedInLink).toHaveAttribute('href', 'https://example.com/linkedin');
    expect(linkedInLink).toHaveAttribute('target', '_blank');
    expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(screen.getByTestId('icon-twitter')).toBeInTheDocument();
    expect(screen.getByTestId('icon-linkedin')).toBeInTheDocument();
  });

  it('renders the hero image and caption', () => {
    render(<BlogArticle {...baseProps} />);

    const heroImage = screen.getByRole('img', { name: 'Article hero image' });

    expect(heroImage).toHaveAttribute('src', '/blog/hero.jpg');
    expect(screen.getByText('A lovely caption')).toBeInTheDocument();
  });

  it('does not render category when empty', () => {
    render(
      <BlogArticle
        {...baseProps}
        category=""
      />
    );

    expect(screen.queryByText('Design')).not.toBeInTheDocument();
  });

  it('does not render title when empty', () => {
    render(
      <BlogArticle
        {...baseProps}
        title=""
      />
    );

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('does not render summary when empty', () => {
    render(
      <BlogArticle
        {...baseProps}
        summary=""
      />
    );

    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('does not render social links when none are provided', () => {
    render(
      <BlogArticle
        {...baseProps}
        socialLinks={[]}
      />
    );

    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Share on/i })).not.toBeInTheDocument();
  });
});
