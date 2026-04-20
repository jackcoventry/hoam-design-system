import { render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BlogArticle, type BlogArticleProps } from '@/components/BlogArticle/BlogArticle';

type MessageKey = 'blogArticle' | 'global';

type BlogArticleMessages = {
  by: string;
  avatarAria: string;
  readingTime: (minutes: number) => string;
};

type GlobalMessages = {
  share: string;
  shareAria: string;
};

type MessageMap = {
  blogArticle: BlogArticleMessages;
  global: GlobalMessages;
};

const formatDateMock = vi.fn<(value: string, options?: Intl.DateTimeFormatOptions) => string>();

const useMessagesMock = vi.fn<(key: MessageKey) => MessageMap[MessageKey]>();

vi.mock('@/hooks/useDate', () => ({
  useDate: () => ({
    formatDate: formatDateMock,
  }),
}));

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (key: MessageKey) => useMessagesMock(key),
}));

vi.mock('@/components/Common/BodyText', () => ({
  BodyText: ({ children }: { children: ReactNode }) => (
    <div data-testid="body-text">{children}</div>
  ),
}));

vi.mock('@/components/Icon', () => ({
  Icon: ({ id }: { id: string }) => <span data-testid="icon">{id}</span>,
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
  const baseProps: BlogArticleProps = {
    category: 'Engineering',
    title: 'Building a design system',
    summary: 'How we approached architecture and scaling.',
    author: {
      name: 'Jane Smith',
      id: 'jane-smith',
      image: '/authors/jane.jpg',
    },
    profileLink: '/authors/jane-smith',
    publishDate: '2026-04-18',
    readingTime: 8,
    image: {
      src: '/images/article-hero.jpg',
      alt: 'A design system moodboard',
      caption: 'Our design system in progress',
    },
    socialLinks: [
      {
        label: 'Twitter',
        href: 'https://twitter.com/share',
        icon: 'twitter',
      },
      {
        label: 'LinkedIn',
        href: 'https://linkedin.com/shareArticle',
        icon: 'linkedin',
      },
    ],
    children: <p>Article body content</p>,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    formatDateMock.mockReturnValue('April 18, 2026');

    useMessagesMock.mockImplementation((key) => {
      if (key === 'blogArticle') {
        return {
          by: 'By ',
          avatarAria: 'Avatar of',
          readingTime: (minutes: number) => `${minutes} min read`,
        };
      }

      return {
        share: 'Share',
        shareAria: 'Share on',
      };
    });
  });

  it('renders the main article content', () => {
    render(<BlogArticle {...baseProps} />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Building a design system',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'How we approached architecture and scaling.',
      })
    ).toBeInTheDocument();

    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Article body content')).toBeInTheDocument();
    expect(screen.getByTestId('body-text')).toBeInTheDocument();
  });

  it('formats and renders the publish date', () => {
    render(<BlogArticle {...baseProps} />);

    expect(formatDateMock).toHaveBeenCalledWith('2026-04-18', {
      dateStyle: 'long',
    });

    const time = screen.getByText('April 18, 2026');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('datetime', 'April 18, 2026');
  });

  it('renders the author as a link when profileLink is provided', () => {
    render(<BlogArticle {...baseProps} />);

    const authorLink = screen.getByRole('link', { name: /jane smith/i });
    expect(authorLink).toHaveAttribute('href', '/authors/jane-smith');
    expect(authorLink).toHaveAttribute('rel', 'author');

    const avatar = screen.getByRole('img', { name: 'Avatar of Jane Smith' });
    expect(avatar).toHaveAttribute('src', '/authors/jane.jpg');
  });

  it('renders the author as plain text when profileLink is not provided', () => {
    render(
      <BlogArticle
        {...baseProps}
        profileLink={undefined}
      />
    );

    expect(screen.queryByRole('link', { name: /jane smith/i })).not.toBeInTheDocument();

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    const avatar = screen.getByRole('img', { name: 'Avatar of Jane Smith' });
    expect(avatar).toHaveAttribute('src', '/authors/jane.jpg');
  });

  it('renders reading time with the clock icon', () => {
    render(<BlogArticle {...baseProps} />);

    expect(screen.getByText('8 min read')).toBeInTheDocument();

    const icons = screen.getAllByTestId('icon').map((icon) => icon.textContent);
    expect(icons).toContain('clock');
  });

  it('supports singular and plural reading time formatting from messages', () => {
    render(
      <BlogArticle
        {...baseProps}
        readingTime={1}
      />
    );

    expect(screen.getByText('1 min read')).toBeInTheDocument();
  });

  it('renders the social sharing section and links', () => {
    render(<BlogArticle {...baseProps} />);

    expect(screen.getByText('Share')).toBeInTheDocument();

    const twitterLink = screen.getByRole('link', { name: 'Share on Twitter' });
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/share');
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');

    const linkedInLink = screen.getByRole('link', { name: 'Share on LinkedIn' });
    expect(linkedInLink).toHaveAttribute('href', 'https://linkedin.com/shareArticle');
    expect(linkedInLink).toHaveAttribute('target', '_blank');
    expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the share icons for each social link', () => {
    render(<BlogArticle {...baseProps} />);

    const icons = screen.getAllByTestId('icon').map((icon) => icon.textContent);

    expect(icons).toContain('clock');
    expect(icons).toContain('twitter');
    expect(icons).toContain('linkedin');
  });

  it('renders no social link anchors when socialLinks is empty', () => {
    render(
      <BlogArticle
        {...baseProps}
        socialLinks={[]}
      />
    );

    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /share on/i })).not.toBeInTheDocument();
  });

  it('renders the hero image and caption', () => {
    render(<BlogArticle {...baseProps} />);

    const heroImage = screen.getByRole('img', {
      name: 'A design system moodboard',
    });

    expect(heroImage).toHaveAttribute('src', '/images/article-hero.jpg');
    expect(screen.getByText('Our design system in progress')).toBeInTheDocument();
  });

  it('does not render empty category, title, or summary content', () => {
    render(
      <BlogArticle
        {...baseProps}
        category=""
        title=""
        summary=""
      />
    );

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(screen.queryByText('Engineering')).not.toBeInTheDocument();
  });

  it('renders children inside the article body section', () => {
    render(
      <BlogArticle {...baseProps}>
        <div>
          <p>First paragraph</p>
          <p>Second paragraph</p>
        </div>
      </BlogArticle>
    );

    const bodyText = screen.getByTestId('body-text');
    expect(within(bodyText).getByText('First paragraph')).toBeInTheDocument();
    expect(within(bodyText).getByText('Second paragraph')).toBeInTheDocument();
  });

  it('requests the expected message namespaces', () => {
    render(<BlogArticle {...baseProps} />);

    expect(useMessagesMock).toHaveBeenCalledWith('blogArticle');
    expect(useMessagesMock).toHaveBeenCalledWith('global');
  });
});
